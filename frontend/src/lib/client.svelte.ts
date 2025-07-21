/*
This file is part of all-trees-tracker.
Copyright (C) 2025 Mako

all-trees-tracker is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not,
see <https://www.gnu.org/licenses/>.
*/

import { Channel, invoke } from '@tauri-apps/api/core'

export const trees = $state(new Map<number, boolean>())

export const loadTrees = (hashes: number[]) => {
  // biome-ignore format: block expansion
  hashes.forEach((hash) => { trees.set(hash, false) })
}

export const connect = async (address: string, port: number) => {
  const tracker = new Channel<number>()
  // biome-ignore format: block expansion
  tracker.onmessage = (hash) => { if (trees.has(hash)) trees.set(hash, true) }

  await invoke('connect', { address, port, channel: tracker })
}

// biome-ignore format: block expansion
export const disconnect = () => { invoke('disconnect') }
