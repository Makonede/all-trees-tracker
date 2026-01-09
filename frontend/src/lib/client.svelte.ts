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

import { Channel, invoke, isTauri } from '@tauri-apps/api/core'
import { listen } from '@tauri-apps/api/event'
import { SvelteMap } from 'svelte/reactivity'

import { t } from './translations.svelte'
import { baseTrees } from './trees.svelte'

const ERROR_MESSAGES = [
  'proxyFailed',
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

let socket = $state<WebSocket>()

export const connect = async (
  address: string, port: number, proxy: string, callback: () => void
) => {
  const cut = (hash: number) => { if (cutTrees.has(hash)) {
    cutTrees.set(hash, true)
    if (baseTrees.has(hash)) lastTree = hash
  } }

  if (!isTauri()) {
    try { socket = new WebSocket(proxy) }
    catch (e) {
      const exception = e as DOMException
      throw {
        kind: exception.name,
        message: exception.message,
      }
    }

    socket.binaryType = 'arraybuffer'

    socket.addEventListener('message', (event) => {
      if (event.data instanceof ArrayBuffer)
        cut(new DataView(event.data).getUint32(0))
    })

    socket.addEventListener('open', function () {
      const buffer = new ArrayBuffer(2)
      new DataView(buffer).setUint16(0, port)

      this.send(address)
      this.send(buffer)

      callback()
    })

    try {
      await new Promise((resolve, reject) => {
        socket = socket!
        socket.addEventListener('error', reject)
        socket.addEventListener('close', resolve)
      })
    }
    catch { throw { message: errors.get('proxyFailed')! } }

    return
  }

  const tracker = new Channel<number>()
  tracker.onmessage = cut
  listen<undefined>('connected', callback)

  await invoke('connect', { address, port, tracker })
}

export const disconnect = () => {
  if (isTauri()) invoke('disconnect')
  else if (socket != null) socket.close()
}
