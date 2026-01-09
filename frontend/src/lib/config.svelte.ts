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

import { isTauri } from '@tauri-apps/api/core'

import { SvelteMap } from 'svelte/reactivity'

type Settings = {
  dlc: boolean
  fly: boolean
  colors: SvelteMap<string, string>
  address: string
  port: number
  proxy: string
  connected?: boolean
}

export let settings: Settings = $state({
  dlc: false,
  fly: true,
  colors: new SvelteMap<string, string>(),
  address: '',
  port: 5001,
  proxy: !isTauri() ? 'ws://localhost:5002' : '',
  connected: false,
})
