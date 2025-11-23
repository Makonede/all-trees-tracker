<!-- SPDX-License-Identifier: GPL-3.0-or-later -->
<!--
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
-->

<script lang='ts'>
  import ChevronDown from '@lucide/svelte/icons/chevron-down'
  import LandPlot from '@lucide/svelte/icons/land-plot'
  import Trees from '@lucide/svelte/icons/trees'
  import { Accordion, Progress } from '@skeletonlabs/skeleton-svelte'

  import type { Component } from 'svelte'
  import { slide } from 'svelte/transition'

  import { t } from '../translations.svelte'
  import { ChartType, type Filter } from '../types.svelte'

  import ProgressBarFilter from './ProgressBarFilter.svelte'

  import {
    getRegionTrees,
    getTotalMax,
    getTotalValue,
    getTreeTypeTrees,
    namesEffect,
  } from './progress.svelte'

  let { tabState = $bindable() }: { tabState: {
    chartType?: ChartType,
    filters?: Filter[],
  } } = $props()

  type FilterItem = {
    filter: Filter
    name: string
    icon: Component
    trees: () => [string, [number, number, string]][]
  }

  const filters: FilterItem[] = [
    {
      filter: 'region',
      name: 'progress.byRegion',
      icon: LandPlot,
      trees: getRegionTrees,
    },
    {
      filter: 'type',
      name: 'progress.byType',
      icon: Trees,
      trees: getTreeTypeTrees,
    },
  ]

  let complete = $derived(getTotalValue() === getTotalMax())

  $effect(namesEffect)
</script>

<div class='grid grid-cols-1 justify-items-center gap-4 p-4'>
  <h1 class='h1'>{$t('progress.overall')}</h1>
  <Progress
    class='w-fit relative' value={getTotalValue()} max={getTotalMax()}
    formatOptions={{
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }}
  >
    <div class='absolute inset-0 flex items-center justify-center'>
      <Progress.ValueText class='text-4xl font-bold {
        complete ? 'text-amber-400' : 'fill-current'
      } transition-color duration-300' />
    </div>
    <Progress.Circle
      class='{
        complete ? 'drop-shadow-[0px_0px_24px_var(--color-amber-400)]' : ''
      } transition duration-300 will-change-[filter]'
      style='--size: 12rem; --thickness: 1rem;'
    >
      <Progress.CircleTrack class='stroke-surface-100-900' />
      <Progress.CircleRange class='{
        complete ? 'stroke-amber-400' : ''
      } transition duration-300' />
    </Progress.Circle>
  </Progress>
  <p>{$t('progress.cutTrees', {
    cut: getTotalValue().toString(),
    total: getTotalMax().toString(),
  })}</p>
  <br>
  <Accordion value={tabState.filters} onValueChange={({ value }) => {
    tabState.filters = value as Filter[]
  }} multiple>
    {#each filters as { filter, name, icon, trees }, i}
    {@const Icon = icon}
      {#if i}<hr class='hr border-surface-300-700'>{/if}
      <Accordion.Item value={filter}>
        <h3 class='text-lg'>
          <Accordion.ItemTrigger class='flex justify-between items-center'>
            <div class='flex gap-4'>
              <Icon />
              {$t(name)}
            </div>
            <Accordion.ItemIndicator class='group'>
              <ChevronDown
                class='size-4 transition duration-300 group-data-[state=open]:rotate-180'
              />
            </Accordion.ItemIndicator>
          </Accordion.ItemTrigger>
        </h3>
        <Accordion.ItemContent>
          {#snippet element(attributes)}
            {#if !attributes.hidden}
              <div {...attributes} transition:slide={{ duration: 300 }}>
                <ProgressBarFilter trees={trees()} />
              </div>
            {/if}
          {/snippet}
        </Accordion.ItemContent>
      </Accordion.Item>
    {/each}
  </Accordion>
</div>
