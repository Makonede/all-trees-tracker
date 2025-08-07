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
export const REGIONS_EXTENDED = [...REGIONS_BASE, 'tots'] as const
let dlc = $state(false)
let regions = $derived(dlc ? REGIONS_EXTENDED : REGIONS_BASE)
export const getRegions = () => regions

export type Region = (typeof REGIONS_EXTENDED)[number]
type HyruleRegion = (typeof REGIONS_BASE)[number]

const ACTORS = [
  'Obj_TreeApple_A_L_01',
  'Obj_TreeApple_A_M_01',
  'Obj_TreeBanana_A_01',
  'Obj_TreeBroadleafDead_B_L_01',
  'Obj_TreeBroadleaf_A_L',
  'Obj_TreeBroadleaf_BossArea_A_L',
  'Obj_TreeBurned_A_01',
  'Obj_TreeBurned_B_01',
  'Obj_TreeBurned_B_02',
  'Obj_TreeConiferousDead_A_01',
  'Obj_TreeConiferousDead_A_02',
  'Obj_TreeConiferousDead_A_Snow_01',
  'Obj_TreeConiferous_A_01',
  'Obj_TreeConiferous_A_02',
  'Obj_TreeConiferous_A_03',
  'Obj_TreeConiferous_A_04',
  'Obj_TreeConiferous_A_Snow_01',
  'Obj_TreeConiferous_A_Snow_02',
  'Obj_TreeConiferous_A_Snow_03',
  'Obj_TreeConiferous_C_01',
  'Obj_TreeConiferous_C_02',
  'Obj_TreeConiferous_C_03',
  'Obj_TreeDeadLeaf_A_01',
  'Obj_TreeDead_A_01',
  'Obj_TreeDead_A_Snow_01',
  'Obj_TreeDorian_A_01',
  'Obj_TreeDragonblood_A_03',
  'Obj_TreeGhost_A_03',
  'Obj_TreeMaple_A_01',
  'Obj_TreeMaple_A_02',
  'Obj_TreeMaple_B_01',
  'Obj_TreeMaple_B_02',
  'Obj_TreeMaple_C_01',
  'Obj_TreeMaple_C_02',
  'Obj_TreePalmBeach_A_01',
  'Obj_TreePalmBeach_A_02',
  'Obj_TreePalm_A_01',
  'Obj_TreePalm_A_02',
  'Obj_TreePine_A_01',
  'Obj_TreeWhiteBirch_A_01',
  'Obj_TreeWhiteBirch_A_02',
  'Obj_TreeWhiteBirch_A_03',
  'Obj_TreeWhiteBirch_A_04',
  'Obj_TreeWillow_A_01',
] as const
type TreeActor = (typeof ACTORS)[number]

export const TREE_TYPES = [
  'apple',
  'banana',
  'birch',
  'broadleaf',
  'conifer',
  'dead',
  'durian',
  'dragonblood',
  'ghost',
  'maple',
  'palm',
  'willow',
] as const
export type TreeType = (typeof TREE_TYPES)[number]

export const ACTOR_TYPES: Record<TreeActor, TreeType> = {
  Obj_TreeApple_A_L_01: 'apple',
  Obj_TreeApple_A_M_01: 'apple',
  Obj_TreeBanana_A_01: 'banana',
  Obj_TreeBroadleafDead_B_L_01: 'broadleaf',
  Obj_TreeBroadleaf_A_L: 'broadleaf',
  Obj_TreeBroadleaf_BossArea_A_L: 'broadleaf',
  Obj_TreeBurned_A_01: 'dead',
  Obj_TreeBurned_B_01: 'dead',
  Obj_TreeBurned_B_02: 'dead',
  Obj_TreeConiferousDead_A_01: 'conifer',
  Obj_TreeConiferousDead_A_02: 'conifer',
  Obj_TreeConiferousDead_A_Snow_01: 'conifer',
  Obj_TreeConiferous_A_01: 'conifer',
  Obj_TreeConiferous_A_02: 'conifer',
  Obj_TreeConiferous_A_03: 'conifer',
  Obj_TreeConiferous_A_04: 'conifer',
  Obj_TreeConiferous_A_Snow_01: 'conifer',
  Obj_TreeConiferous_A_Snow_02: 'conifer',
  Obj_TreeConiferous_A_Snow_03: 'conifer',
  Obj_TreeConiferous_C_01: 'conifer',
  Obj_TreeConiferous_C_02: 'conifer',
  Obj_TreeConiferous_C_03: 'conifer',
  Obj_TreeDead_A_01: 'dead',
  Obj_TreeDead_A_Snow_01: 'dead',
  Obj_TreeDeadLeaf_A_01: 'dead',
  Obj_TreeDorian_A_01: 'durian',
  Obj_TreeDragonblood_A_03: 'dragonblood',
  Obj_TreeGhost_A_03: 'ghost',
  Obj_TreeMaple_A_01: 'maple',
  Obj_TreeMaple_A_02: 'maple',
  Obj_TreeMaple_B_01: 'maple',
  Obj_TreeMaple_B_02: 'maple',
  Obj_TreeMaple_C_01: 'maple',
  Obj_TreeMaple_C_02: 'maple',
  Obj_TreePalm_A_01: 'palm',
  Obj_TreePalm_A_02: 'palm',
  Obj_TreePalmBeach_A_01: 'palm',
  Obj_TreePalmBeach_A_02: 'palm',
  Obj_TreePine_A_01: 'conifer',
  Obj_TreeWhiteBirch_A_01: 'birch',
  Obj_TreeWhiteBirch_A_02: 'birch',
  Obj_TreeWhiteBirch_A_03: 'birch',
  Obj_TreeWhiteBirch_A_04: 'birch',
  Obj_TreeWillow_A_01: 'willow',
}

type Tree = {
  name: TreeActor
  pos: [number, number, number]
}

type JsonTree = { hash: number } & Tree

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
