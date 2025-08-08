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
  import { Accordion, ProgressRing } from '@skeletonlabs/skeleton-svelte'

  import { t } from '../translations.svelte'
  import { ChartType, type Filter } from '../types.svelte'

  import ProgressBarFilter from './ProgressBarFilter.svelte'

  import {
    getRegionTrees,
    getTotalMax,
    getTotalPercentage,
    getTotalValue,
    getTreeTypeTrees,
    namesEffect,
  } from './progress.svelte'

  let { tabState = $bindable() }: { tabState: {
    chartType?: ChartType,
    filters?: Filter[],
  } } = $props()

  let complete = $derived(getTotalValue() === getTotalMax())

  $effect(namesEffect)
</script>

<div class='grid grid-cols-1 justify-items-center gap-4 p-4'>
  <h1 class='h1'>{$t('progress.overall')}</h1>
  <ProgressRing
    label={getTotalPercentage()} showLabel size='size-48' svgClasses='{
      complete
        ? 'shadow-[0px_0px_24px_var(--color-amber-400),_inset_0px_0px_44px_var(--color-amber-400)]'
        : ''
    } transition-shadow duration-300' trackStroke='stroke-surface-900'
    meterStroke={complete ? 'stroke-amber-400' : ''}
    meterTransition='transition-colors duration-300'
    labelFill={complete ? 'fill-amber-400' : 'fill-current'} labelFontSize={20}
    labelClasses='transition-colors duration-300' value={getTotalValue()}
    max={getTotalMax()}
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
      {#snippet panel()}<ProgressBarFilter trees={getRegionTrees()} />{/snippet}
    </Accordion.Item>
    <Accordion.Item value='type'>
      {#snippet lead()}<Trees />{/snippet}
      {#snippet control()}{$t('progress.byType')}{/snippet}
      {#snippet panel()}<ProgressBarFilter trees={
        getTreeTypeTrees()
      } />{/snippet}
    </Accordion.Item>
  </Accordion>
</div>
