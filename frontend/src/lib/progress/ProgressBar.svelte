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
  import LandPlot from '@lucide/svelte/icons/land-plot'
  import Trees from '@lucide/svelte/icons/trees'
  import {
    Accordion, Progress, ProgressRing
  } from '@skeletonlabs/skeleton-svelte'

  import { t } from '../translations.svelte'
  import { ChartType, type Filter } from '../types.svelte'

  import {
    getRegionTrees,
    getTotalMax,
    getTotalPercentage,
    getTotalValue,
    regionNamesEffect,
  } from './progress.svelte'

  let { tabState = $bindable() }: { tabState: {
    chartType?: ChartType,
    filters?: Filter[],
  } } = $props()

  $effect(regionNamesEffect)
</script>

<div class='grid grid-cols-1 justify-items-center gap-4 p-4'>
  <h1 class='h1'>{$t('progress.overall')}</h1>
  <ProgressRing
    label={getTotalPercentage()} showLabel size='size-48'
    trackStroke='stroke-surface-900' value={getTotalValue()} max={getTotalMax()}
  />
  <p>{$t('progress.cutTrees', {
    cut: getTotalValue().toString(),
    total: getTotalMax().toString(),
  })}</p>
  <br>
  <Accordion value={tabState.filters} onValueChange={({ value }) => {
    tabState.filters = value as Filter[]
  }} multiple>
    <Accordion.Item value='region'>
      {#snippet lead()}<LandPlot />{/snippet}
      {#snippet control()}{$t('progress.byRegion')}{/snippet}
      {#snippet panel()}
        <div class='flex flex-col gap-4'>
          {#each getRegionTrees() as [region, [
            value, max, percentage
          ]], i (region)}
            <div
              class='grid grid-cols-4'
              style='--region-color: oklch(from hsl(0deg, 100%, 80%) l c calc(h + {
                360 / getRegionTrees().length * i
              }));'
            >
              <p>
                <b
                  class='underline decoration-[var(--region-color)] decoration-2 underline-offset-4'
                >{region}</b>
              </p>
              <p>
                {percentage}% ({$t('progress.cutTreesShort', {
                  cut: value.toString(),
                  total: max.toString(),
                })})
              </p>
              <Progress
                {value} {max} height='h-4' classes='col-span-2'
                trackBg='bg-surface-900' trackRounded='rounded-full'
                meterBg='bg-[var(--region-color)]' meterRounded='rounded-full'
              />
            </div>
          {/each}
        </div>
      {/snippet}
    </Accordion.Item>
    <Accordion.Item value='type'>
      {#snippet lead()}<Trees />{/snippet}
      {#snippet control()}{$t('progress.byType')}{/snippet}
      {#snippet panel()}Types placeholder{/snippet}
    </Accordion.Item>
  </Accordion>
</div>
