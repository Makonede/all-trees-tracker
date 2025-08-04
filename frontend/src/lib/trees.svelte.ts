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

import { loadTrees } from './client.svelte'

import hyrule from './trees_hyrule.json'
import tots from './trees_tots.json'

type Tree = {
  name: string
  pos: [number, number, number]
}

type JsonTree = { hash: number } & Tree

const REGIONS_BASE = [
  'akkala',
  'central',
  'duelingPeaks',
  'eldin',
  'faron',
  'gerudo',
  'greatPlateau',
  'hateno',
  'hebra',
  'lake',
  'lanayru',
  'ridgeland',
  'tabantha',
  'wasteland',
  'woodland',
] as const
const REGIONS_EXTENDED = [...REGIONS_BASE, 'tots'] as const
let dlc = $state(false)
let regions = $derived(dlc ? REGIONS_EXTENDED : REGIONS_BASE)
export const getRegions = () => regions

export type Region = typeof REGIONS_EXTENDED[number]
type HyruleRegion = typeof REGIONS_BASE[number]

export type MapTree = Tree & ({
  region: HyruleRegion
  tots: false
} | {
  region: 'tots'
  tots: true
})

type HyruleTrees = Record<HyruleRegion, JsonTree[]>
type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T][]

export const baseTrees = new Map<number, MapTree>(
  (<Entries<HyruleTrees>>Object.entries(<HyruleTrees>hyrule)).flatMap(
    ([region, trees]) => trees.map(({ hash, name, pos }) => [
      hash, { name, pos, region, tots: false }
    ])
  )
)

export const extendedTrees = new Map<number, MapTree>([
  ...baseTrees.entries(), ...(<JsonTree[]>tots).map((
    { hash, name, pos }
  ): [number, MapTree] => [hash, { name, pos, region: 'tots', tots: true }])
])

let trees = $state(new Map<number, MapTree>())
export const getTrees = () => trees

export const loadBase = () => {
  loadTrees(baseTrees.keys())
  trees = baseTrees
  dlc = false
}

export const loadExtended = () => {
  loadTrees(extendedTrees.keys())
  trees = extendedTrees
  dlc= true
}
