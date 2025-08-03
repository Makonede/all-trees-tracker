/*
This file is part of All Trees Tracker.
Copyright (C) 2025 Mako

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

#include <megaton/hook.h>

#include <KingSystem/ActorSystem/actActor.h>

#include "tcp.hpp"

static tcp::Server server;

struct hook_inline_(cut_tree) {
    target_offset_(0x7dd64c) // aiAiLumberjackTreeStuff
    static void call(const megaton::hook::InlineCtx* const ctx) noexcept {
        const auto* const tree = reinterpret_cast<
            const ksys::act::Actor* const
        >(ctx->x<28>());
        const auto id = tree->getId();
        const auto& mubin = tree->getMapObjIter();
        u32 hash = 0;
        if (mubin.tryGetParamUIntByKey(
            &hash, sead::SafeString("HashId")
        )) [[likely]] server.send(hash);
    }
};

extern "C" void megaton_main() noexcept {
    server.init();
    server.start();
    cut_tree::install();
}
