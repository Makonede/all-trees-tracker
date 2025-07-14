/*
This file is part of all-trees-tracker.
Copyright (C) 2025 Mako

all-trees-tracker is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option) any
later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <https://www.gnu.org/licenses/>.
*/

#include <cstdint>

#include <fcntl.h>
#include <sys/socket.h>

#include <nn/nifm.h>

#include <prim/seadScopedLock.h>

#include "sdk.hpp"

#include "tcp.hpp"

namespace tcp {
    void server_thread(void* const server) noexcept {
        static_cast<Server*>(server)->run();
    }

    Server::Server() noexcept : mutex(false) {
        nn::os::InitializeConditionVariable(&cv);
    }

    void Server::init() noexcept { start_thread(server_thread, this); }

    void Server::start(const u16 port) noexcept {
        if (connected) [[unlikely]] return;
        {
            const auto lock = sead::makeScopedLock(mutex);
            server_port = port;
            ready = true;
        }
        nn::os::SignalConditionVariable(&cv);
        nn::os::WaitConditionVariable(&cv, mutex.GetBase());
        mutex.Unlock();
    }

    void Server::send(const std::vector<u8> data) noexcept {
        {
            const auto lock = sead::makeScopedLock(mutex);
            packets.push_back(data);
        }
        nn::os::SignalConditionVariable(&cv);
    }

    void Server::run() noexcept {
        nn::os::WaitConditionVariable(&cv, mutex.GetBase());

        if (nn::nifm::Initialize().IsFailure()) [[unlikely]] return;

        constexpr auto POOL_SIZE = 0x100000uz;
        constexpr auto ALIGNMENT = 0x1000uz;
        auto* pool = std::aligned_alloc(ALIGNMENT, POOL_SIZE);
        if (!pool) [[unlikely]] return;

        constexpr auto BUFFER_SIZE = UINT64_C(0x20000);
        constexpr auto CONCURRENCY_LIMIT = INT32_C(4);
        if (nn::socket::Initialize(
            pool, POOL_SIZE, BUFFER_SIZE, CONCURRENCY_LIMIT
        ).IsFailure()) [[unlikely]] return std::free(pool);

        nn::nifm::SubmitNetworkRequest();
        while (nn::nifm::IsNetworkAvailable()) yield();
        if (!nn::nifm::IsNetworkAvailable()) [[unlikely]] {
            nn::socket::Finalize();
            std::free(pool);
            return;
        }

        server_socket = nn::socket::Socket(
            AF_INET, SOCK_STREAM | SOCK_NONBLOCK, 0
        );
        if (server_socket < 0) [[unlikely]] {
            nn::socket::Finalize();
            std::free(pool);
            return;
        }

        sockaddr_in address{
            .sin_family = AF_INET,
            .sin_port = nn::socket::InetHtons(server_port),
        };
        nn::socket::InetAton("0.0.0.0", reinterpret_cast<nn::socket::InAddr*>(
            &address.sin_addr.s_addr
        ));
        if (nn::socket::Bind(
            server_socket, reinterpret_cast<sockaddr*>(&address), sizeof address
        ) < 0) [[unlikely]] {
            nn::socket::Close(server_socket);
            server_socket = -1;
            nn::socket::Finalize();
            std::free(pool);
            return;
        }

        if (nn::socket::Listen(server_socket, 1) < 0) [[unlikely]] {
            nn::socket::Close(server_socket);
            server_socket = -1;
            nn::socket::Finalize();
            std::free(pool);
            return;
        }

        poll(end::SERVER);
        client_socket = nn::socket::Accept(server_socket, nullptr, nullptr);
        const auto flags = nn::socket::Fcntl(client_socket, F_GETFL);
        if (flags < 0) [[unlikely]] {
            nn::socket::Close(server_socket);
            server_socket = -1;
            nn::socket::Finalize();
            std::free(pool);
            return;
        }

        nn::socket::Fcntl(client_socket, F_SETFL, flags | O_NONBLOCK);
        connected = true;
        mutex.Unlock();
        nn::os::SignalConditionVariable(&cv);

        while (true) [[likely]] {
            nn::os::WaitConditionVariable(&cv, mutex.GetBase());

            const auto packet_it = packets.begin();
            const auto packet = *packet_it;
            packets.erase(packet_it);
            mutex.Unlock();

            auto result = nn::socket::Send(
                client_socket, packet.data(), packet.size(), 0
            );
            poll(end::CLIENT);

            while (result <= 0) [[unlikely]] {
                if (!result) [[likely]] reconnect();
                result = nn::socket::Send(
                    client_socket, packet.data(), packet.size(), 0
                );
                poll(end::CLIENT);
            }

            nn::os::SignalConditionVariable(&cv);
        }
    }
}
