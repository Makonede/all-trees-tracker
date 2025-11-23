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
  import { Progress } from '@skeletonlabs/skeleton-svelte'
  import { t } from '../translations.svelte'

  let { trees }: { trees: [string, [number, number, string]][] } = $props()
</script>

<div class='flex flex-col gap-4'>
  {#each trees as [label, [value, max, percentage]], i}
    {@const complete = value === max}
    <div
      class='grid grid-cols-4'
      style='--filter-color: oklch(from hsl(0deg, 100%, 80%) l c calc(h + {
        360 / trees.length * i
      }));'
    >
      <p class='text-ellipsis'>
        <b
          class='underline decoration-(--filter-color) decoration-2 underline-offset-4'
        >{label}</b>
      </p>
      <p class='text-ellipsis'>
        <span class='{
          complete ? 'font-bold text-amber-400' : ''
        } transition-colors duration-300'>{percentage}%</span> ({$t(
          'progress.cutTreesShort', {
            cut: value.toString(),
            total: max.toString(),
          }
        )})
      </p>
      <Progress class='col-span-2' {value} {max}>
        <Progress.Track class='h-4 bg-surface-100-900 rounded-full'>
          <Progress.Range class='{
            complete
              ? 'bg-linear-to-r from-amber-400 via-amber-200 to-amber-400'
              : 'bg-(--filter-color)'
          } rounded-full transition-colors duration-300' />
        </Progress.Track>
      </Progress>
    </div>
  {/each}
</div>
