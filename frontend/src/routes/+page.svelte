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
  import TabbedPanel from '$lib/TabbedPanel.svelte'
  import TreeMap from '$lib/TreeMap.svelte'
  import { loadBase, loadExtended } from '$lib/trees.svelte'

  loadBase()
</script>

<main
  class='grid grid-flow-row lg:grid-flow-col grid-cols-2 grid-rows-3 lg:grid-cols-3 lg:grid-rows-3 gap-4 p-8 h-screen'
>
  <div
    class='col-span-2 row-span-2 lg:col-span-2 lg:row-span-3 p-4 card preset-filled-surface-100-900'
  >
    <TreeMap />
  </div>
  <div class='lg:row-span-2 p-4 card preset-filled-surface-100-900'>
    <TabbedPanel />
  </div>
  <div class='p-4 card preset-filled-surface-100-900'>
    <TabbedPanel />
  </div>
</main>
