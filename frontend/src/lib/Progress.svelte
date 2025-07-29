<!--
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
-->

<script lang='ts'>
  import ChartColumn from '@lucide/svelte/icons/chart-column'
  import ChartLine from '@lucide/svelte/icons/chart-line'
  import ChartNoAxesCombined from '@lucide/svelte/icons/chart-no-axes-combined'
  import ChartPie from '@lucide/svelte/icons/chart-pie'

  import type { Component } from 'svelte'

  import BarChart from './progress/BarChart.svelte'
  import LineChart from './progress/LineChart.svelte'
  import PieChart from './progress/PieChart.svelte'
  import ProgressBar from './progress/ProgressBar.svelte'

  import { t } from './translations/translations.svelte'
  import type { IconType } from './types.svelte'

  enum ChartType {
    ProgressBar,
    BarChart,
    LineChart,
    PieChart,
  }

  let { icon = $bindable(), tabState = $bindable() }: {
    icon: IconType, tabState: { chartType?: ChartType }
  } = $props()

  const chartTypes: { name: string, type: ChartType }[] = [
    {
      name: $t('progress.progressBar'),
      type: ChartType.ProgressBar,
    },
    {
      name: $t('progress.barChart'),
      type: ChartType.BarChart,
    },
    {
      name: $t('progress.lineChart'),
      type: ChartType.LineChart,
    },
    {
      name: $t('progress.pieChart'),
      type: ChartType.PieChart,
    },
  ]

  tabState.chartType ??= ChartType.ProgressBar
  let chart = $state<Component>(ProgressBar)

  $effect(() => { switch (tabState.chartType) {
    case ChartType.ProgressBar:
      icon.icon = ChartNoAxesCombined
      chart = ProgressBar
      break
    case ChartType.BarChart:
      icon.icon = ChartColumn
      chart = BarChart
      break
    case ChartType.LineChart:
      icon.icon = ChartLine
      chart = LineChart
      break
    case ChartType.PieChart:
      icon.icon = ChartPie
      chart = PieChart
  } })
</script>

<div
  class='flex flex-col space-y-4 p-4 w-full card preset-filled-surface-200-800'
>
  <form class='flex justify-evenly'>
    {#each chartTypes as { name, type }, i}
      <label class='flex items-center space-x-2'>
        <input
          class='radio' type='radio' checked={!i} name='chart' value={type}
          bind:group={tabState.chartType}
        />
        <p>{name}</p>
      </label>
    {/each}
  </form>
  <svelte:boundary>
    {@const Chart = chart}
    <Chart />
  </svelte:boundary>
</div>
