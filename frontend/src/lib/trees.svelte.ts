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

type Tree = {
  name: string
  pos: [number, number, number]
}

type JsonTree = Tree & { hash: number }

type Region =
  | 'akkala'
  | 'central'
  | 'duelingPeaks'
  | 'eldin'
  | 'faron'
  | 'gerudo'
  | 'greatPlateau'
  | 'hateno'
  | 'hebra'
  | 'lake'
  | 'lanayru'
  | 'ridgeland'
  | 'tabantha'
  | 'wasteland'
  | 'woodland'

export type MapTree = Tree & ({ tots: true } | {
  region: Region
  tots: false
})

type HyruleTrees = Record<Region, JsonTree[]>
type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][]

export const baseTrees = new Map<number, MapTree>(
  (<Entries<HyruleTrees>>Object.entries(<HyruleTrees>hyrule)).flatMap(
    ([region, trees]) => trees.map((tree) => [tree.hash, {
      name: tree.name,
      pos: tree.pos,
      region,
      tots: false,
    }])
  )
)

export const extendedTrees = new Map<number, MapTree>([
  ...baseTrees.entries(), ...(<JsonTree[]>tots).map(
    (tree): [number, MapTree] => [tree.hash, {
      name: tree.name,
      pos: tree.pos,
      tots: true,
    }]
  )
])

export let trees = new Map<number, MapTree>()

export const loadBase = () => {
  loadTrees(baseTrees.keys())
  trees = baseTrees
}
export const loadExtended = () => {
  loadTrees(extendedTrees.keys())
  trees = extendedTrees
}
