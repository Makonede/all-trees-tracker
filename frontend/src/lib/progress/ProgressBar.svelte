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

  import { cutTrees } from '../client.svelte'
  import { locale, t } from '../translations.svelte'

  let value = $derived(cutTrees.values().reduce(
    (partial, cut) => partial + +cut, 0
  ))
  let max = $derived(cutTrees.size)
  let percentage = $derived((value / max * 100).toLocaleString(locale.get(), {
    style: 'decimal',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }))

  type Filter = 'region' | 'type'
  let filters = $state<Filter[]>(['region'])
</script>

<div class='grid grid-cols-1 justify-items-center gap-4 p-4'>
  <h1 class='h1'>{$t('progress.overall')}</h1>
  <ProgressRing
    label={percentage} showLabel size='size-48' trackStroke='stroke-surface-900'
    value={value} max={max}
  />
  <p>{$t('progress.cutTrees', {
    cut: value.toString(),
    total: max.toString(),
  })}</p>
  <br>
  <Accordion value={filters} onValueChange={(details) => {
    filters = details.value as Filter[]
  }} multiple>
    <Accordion.Item value='region'>
      {#snippet lead()}<LandPlot />{/snippet}
      {#snippet control()}By region{/snippet}
      {#snippet panel()}Regions placeholder{/snippet}
    </Accordion.Item>
    <Accordion.Item value='type'>
      {#snippet lead()}<Trees />{/snippet}
      {#snippet control()}By type{/snippet}
      {#snippet panel()}Types placeholder{/snippet}
    </Accordion.Item>
  </Accordion>
</div>
