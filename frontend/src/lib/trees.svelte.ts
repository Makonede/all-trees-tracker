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

import { loadTrees } from './client.svelte'

import hyrule from './trees_hyrule.json'
import tots from './trees_tots.json'

export interface Tree {
  hash: number
  name: string
  pos: [number, number, number]
  cut?: boolean
}

const base = <Tree[]>hyrule
const extended = base.concat(<Tree[]>tots)

export const loadBase = () => loadTrees(base)
export const loadExtended = () => loadTrees(extended)
