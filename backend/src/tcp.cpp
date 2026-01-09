// SPDX-License-Identifier: GPL-3.0-or-later
/*
Copyright (C) 2025-2026 Mako

This file is part of All Trees Tracker.

All Trees Tracker is free software: you can redistribute it and/or modify it
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

#include <sys/socket.h>

#include <nn/nifm.h>

#include "tcp.hpp"
#include "utility.hpp"

namespace tcp {
    void server_thread(void* const server) noexcept {
        static_cast<Server*>(server)->run();
    }

    void Server::init() noexcept { start_thread(server_thread, this); }

    void Server::start(const u16 port) noexcept {
        if (connected) [[unlikely]] return;
        server_port = port;
        ready = true;
        yield();
    }

    void Server::send(const u32 hash) noexcept {
        if (!connected || client_socket < 0) [[unlikely]]
            return trees.push(hash);
        if (nn::socket::Send(
            client_socket, &hash, sizeof hash, 0
        ) <= 0) [[unlikely]] {
            nn::socket::Close(client_socket);
            client_socket = -1;
            trees.push(hash);
            return yield();
        }
        if (!trees.empty()) trees.pop();
        trees.push(hash);
    }

    void Server::run() noexcept {
        do yield(); while (!ready);
        ready = false;

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
        while (nn::nifm::IsNetworkRequestOnHold()) yield();
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

        connected = true;

        while (true) [[likely]] {
            if (client_socket < 0 && (client_socket = nn::socket::Accept(
                server_socket, nullptr, nullptr
            )) >= 0) [[unlikely]] for (
                ; !trees.empty(); trees.pop()
            ) [[unlikely]] {
                const auto tree = trees.front();
                if (nn::socket::Send(
                    client_socket, &tree, sizeof tree, 0
                ) <= 0) [[unlikely]] {
                    nn::socket::Close(client_socket);
                    client_socket = -1;
                    break;
                }
            }
            yield();
        }
    }
}
