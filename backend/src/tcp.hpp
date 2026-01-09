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

#pragma once

#include <queue>

#include <netinet/in.h>

#include <megaton/prelude.h>

#include <nn/socket.h>

namespace tcp {
    void server_thread(void* const server) noexcept;

    class Server {
    public:
        void init() noexcept;
        void start(const u16 port = 5001) noexcept;
        void send(const u32 hash) noexcept;

    private:
        void run() noexcept;
        friend void server_thread(void* const server) noexcept;

        s32 server_socket = -1;
        s32 client_socket = -1;
        bool ready = false;
        u16 server_port = 5001;
        bool connected = false;
        std::queue<u32> trees;
    };
}
