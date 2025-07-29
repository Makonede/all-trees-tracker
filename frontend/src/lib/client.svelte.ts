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

import { Channel, invoke } from '@tauri-apps/api/core'
import { SvelteMap } from 'svelte/reactivity'

import { baseTrees } from './trees.svelte'

export let cutTrees = $state(new SvelteMap<number, boolean>())
export let lastTree = $state({ hash: -1 })

export const loadTrees = (hashes: Iterable<number>) => {
  cutTrees.clear()
  for (const hash of hashes) cutTrees.set(hash, false)
  lastTree.hash = -1
}

export const connect = async (address: string, port: number) => {
  const tracker = new Channel<number>()
  tracker.onmessage = (hash) => { if (cutTrees.has(hash)) {
    cutTrees.set(hash, true)
    if (baseTrees.has(hash)) lastTree.hash = hash
  } }

  await invoke('connect', { address, port, channel: tracker })
}

export const disconnect = () => { invoke('disconnect') }
