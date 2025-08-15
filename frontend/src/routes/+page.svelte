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
  import TabbedPanel from '$lib/TabbedPanel.svelte'
  import TreeMap from '$lib/TreeMap.svelte'
  import { loadBase } from '$lib/trees.svelte'

  loadBase()
</script>

<main
  class='grid grid-flow-row lg:grid-flow-col grid-rows-3 lg:grid-rows-1 lg:grid-cols-3 gap-4 p-8 h-screen'
>
  <section
    class='row-span-2 lg:row-span-1 lg:col-span-2 p-4 card preset-filled-surface-100-900'
  ><TreeMap /></section>
  <section class='overflow-auto p-4 card preset-filled-surface-100-900'>
    <TabbedPanel />
  </section>
</main>
