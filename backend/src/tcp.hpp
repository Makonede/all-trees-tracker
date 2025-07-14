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

#pragma once

#include <utility>
#include <vector>

#include <netinet/in.h>

#include <megaton/prelude.h>

#include <nn/socket.h>

#include "nn/os.h"
#include "utility.hpp"

namespace tcp {
    enum class end : bool {
        SERVER,
        CLIENT,
    };

    void server_thread(void* const server) noexcept;

    class Server {
    public:
        Server() noexcept;
        void init() noexcept;
        void start(const u16 port = 5000) noexcept;
        void send(const std::vector<u8> data) noexcept;
        template <typename T>
        inline auto send(const T data) noexcept {
            const auto* const iterator = reinterpret_cast<
                const u8* const
            >(&data);
            send(std::vector(iterator, iterator + sizeof(T)));
        }

    private:
        inline auto poll(const end endpoint) const noexcept {
            s32 socket = -1;
            switch (endpoint) {
            case end::SERVER:
                socket = server_socket;
                break;

            case end::CLIENT:
                socket = client_socket;
                break;

            default: std::unreachable();
            }

            pollfd socket_fd{.fd = socket, .events = POLLIN};
            do yield(); while (!(nn::socket::Poll(
                &socket_fd, 1, 0
            ) > 0 && socket_fd.revents & POLLIN));
        }
        inline auto reconnect() noexcept {
            nn::socket::Close(client_socket);
            client_socket = -1;
            poll(end::SERVER);
            client_socket = nn::socket::Accept(server_socket, nullptr, nullptr);
        }
        void run() noexcept;
        friend void server_thread(void* server) noexcept;

        nn::os::Mutex mutex;
        nn::os::ConditionVariableType cv;
        s32 server_socket = -1;
        s32 client_socket = -1;
        u16 server_port = 5000;
        bool ready = false;
        bool connected = false;
        std::vector<std::vector<u8>> packets;
    };
}
