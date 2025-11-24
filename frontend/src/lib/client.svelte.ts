// SPDX-License-Identifier: GPL-3.0-or-later
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

import { Channel, invoke, isTauri } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { SvelteMap } from 'svelte/reactivity'

import { t } from './translations.svelte'
import { baseTrees } from './trees.svelte'

const ERROR_MESSAGES = [
  'noRemote',
] as const
type ErrorMessage = (typeof ERROR_MESSAGES)[number]

const errors = new SvelteMap<ErrorMessage, string>()

export const errorsEffect = () => {
  for (const key of ERROR_MESSAGES) errors.set(key, t.get(`error.${key}`))
}

export let cutTrees = $state(new SvelteMap<number, boolean>())
let lastTree = $state(-1)
export const getLastTree = () => lastTree

export const loadTrees = (hashes: Iterable<number>) => {
  cutTrees.clear()
  for (const hash of hashes) cutTrees.set(hash, false)
  lastTree = -1
}

export const connect = async (
  address: string, port: number, callback: () => void
) => {
  if (!isTauri()) throw { message: errors.get('noRemote')! }

  const tracker = new Channel<number>()
  tracker.onmessage = (hash) => { if (cutTrees.has(hash)) {
    cutTrees.set(hash, true)
    if (baseTrees.has(hash)) lastTree = hash
  } }
  listen<undefined>('connected', () => callback())

  await invoke('connect', { address, port, tracker })
}

export const disconnect = () => { invoke('disconnect') }
