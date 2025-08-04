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
  getRegions, getTrees, type MapTree, type Region
} from '../trees.svelte'

let cut = $derived(Array.from(cutTrees.entries().filter(
  ([, cut]) => cut
).map(([hash]) => hash)))

const PERCENTAGE: Intl.NumberFormatOptions = {
  style: 'decimal',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
}

let totalValue = $derived(cut.length)
let totalMax = $derived(cutTrees.size)
let totalPercentage = $derived((totalValue / totalMax * 100).toLocaleString(
  locale.get(), PERCENTAGE
))

export const getTotalValue = () => totalValue
export const getTotalMax = () => totalMax
export const getTotalPercentage = () => totalPercentage

export type Filter = 'region' | 'type'
type Filters = { filters: Filter[] }
export let filters = $state<Filters>({ filters: ['region'] })

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
let regionMaxes = $derived(getTrees().entries().reduce((
  regions, [, tree]
) => countRegion(regions, tree), new SvelteMap(regionCounts)))
let regionPercentages = $derived(new SvelteMap(
  regionValues.entries().map(([region, count]) => [region, (
    count / regionMaxes.get(region)! * 100
  ).toLocaleString(locale.get(), PERCENTAGE)])
))

let regionNames = $state(new SvelteMap<Region, string>())
export const regionNamesEffect = () => { t.subscribe((run) => {
  for (const region of getRegions())
    regionNames.set(region, run(`region.${region}`))
})() }
regionNamesEffect()

let regionTrees = $derived(getRegions().map((region): [
  string, [number, number, string]
] => [regionNames.get(region)!, [
  regionValues, regionMaxes, regionPercentages
].map((map) => map.get(region)!) as [number, number, string]]).toSorted())
export const getRegionTrees = () => regionTrees
