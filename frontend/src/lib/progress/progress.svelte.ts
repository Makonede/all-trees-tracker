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

import { SvelteMap } from 'svelte/reactivity'

import { cutTrees } from '../client.svelte'
import { locale, t } from '../translations.svelte'
import {
  ACTOR_TYPES,
  getRegions,
  getTrees,
  type MapTree,
  REGIONS_EXTENDED,
  type Region,
  TREE_TYPES,
  type TreeType,
} from '../trees.svelte'

let cut = $derived(Array.from(cutTrees.entries().filter(
  ([, cut]) => cut
).map(([hash]) => hash)))

const PERCENTAGE: Intl.NumberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}

const regionNames = new SvelteMap<Region, string>()
const treeTypeNames = new SvelteMap<TreeType, string>()

export const namesEffect = () => {
  for (const region of REGIONS_EXTENDED)
    regionNames.set(region, t.get(`region.${region}`))
  for (const treeType of TREE_TYPES)
    treeTypeNames.set(treeType, t.get(`tree.${treeType}`))
}

let totalValue = $derived(cut.length)
let totalMax = $derived(cutTrees.size)
let totalPercentage = $derived((totalValue / totalMax * 100).toLocaleString(
  locale.get(), PERCENTAGE
))

export const getTotalValue = () => totalValue
export const getTotalMax = () => totalMax
export const getTotalPercentage = () => totalPercentage

let regionCounts: [Region, number][] = $derived(getRegions().map(
  (region) => [region, 0]
))
const countRegion = (regions: SvelteMap<Region, number>, tree: MapTree) =>
  regions.set(tree.region, regions.get(tree.region)! + 1)

let regionValues = $derived(getTrees().entries().reduce((
  regions, [hash, tree]
) => cut.includes(hash) ? countRegion(regions, tree) : regions, new SvelteMap(
  regionCounts
)))
let regionMaxes = $derived(getTrees().values().reduce((
  regions, tree
) => countRegion(regions, tree), new SvelteMap(regionCounts)))
let regionPercentages = $derived(new SvelteMap(
  regionValues.entries().map(([region, count]) => [region, (
    count / regionMaxes.get(region)! * 100
  ).toLocaleString(locale.get(), PERCENTAGE)])
))

let regionTrees = $derived(getRegions().map((region): [
  string, [number, number, string]
] => [regionNames.get(region)!, [
  regionValues, regionMaxes, regionPercentages
].map((map) => map.get(region)!) as [number, number, string]]).toSorted(
  ([nameA], [nameB]) => new Intl.Collator(locale.get()).compare(nameA, nameB)
))
export const getRegionTrees = () => regionTrees

const treeTypeCounts: [TreeType, number][] = TREE_TYPES.map(
  (treeType) => [treeType, 0]
)
const countTreeType = (treeTypes: SvelteMap<TreeType, number>, tree: MapTree) =>
  treeTypes.set(ACTOR_TYPES[tree.name], treeTypes.get(
    ACTOR_TYPES[tree.name]
  )! + 1)

let treeTypeValues = $derived(getTrees().entries().reduce(
  (treeTypes, [hash, tree]) => cut.includes(hash) ? countTreeType(
    treeTypes, tree
  ) : treeTypes,
  new SvelteMap(treeTypeCounts),
))
let treeTypeMaxes = $derived(getTrees().values().reduce((
  treeTypes, tree
) => countTreeType(treeTypes, tree), new SvelteMap(treeTypeCounts)))
let treeTypePercentages = $derived(new SvelteMap(treeTypeValues.entries().map(
  ([treeType, count]) => [treeType, (
    count / treeTypeMaxes.get(treeType)! * 100
  ).toLocaleString(locale.get(), PERCENTAGE)]
)))

let treeTypeTrees = $derived(TREE_TYPES.map((treeType): [
  string, [number, number, string]
] => [treeTypeNames.get(treeType)!, [
  treeTypeValues, treeTypeMaxes, treeTypePercentages
].map((map) => map.get(treeType)!) as [number, number, string]]).toSorted(
  ([nameA], [nameB]) => new Intl.Collator(locale.get()).compare(nameA, nameB)
))
export const getTreeTypeTrees = () => treeTypeTrees
