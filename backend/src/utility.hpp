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

#include <memory>

#include <cstdlib>

#include <megaton/prelude.h>

#include <nn/os.h>

template <typename T = void>
inline auto start_thread(void (*func)(void*), T* const arg = nullptr) noexcept {
    constexpr auto STACK_SIZE = 0x80000uz;
    constexpr auto ALIGNMENT = 0x1000uz;
    constexpr auto PRIORITY = 16;
    auto thread = std::make_unique<nn::os::ThreadType>();
    auto* stack = std::aligned_alloc(ALIGNMENT, STACK_SIZE);

    if (!stack) [[unlikely]] return;
    if (nn::os::CreateThread(
        thread.get(), func, arg, stack, STACK_SIZE, PRIORITY
    ).IsFailure()) [[unlikely]] return std::free(stack);
    nn::os::StartThread(thread.release());
}

inline auto yield(const u64 time = 100'000'000) noexcept {
    nn::os::SleepThread(nn::TimeSpan::FromNanoSeconds(time));
}
