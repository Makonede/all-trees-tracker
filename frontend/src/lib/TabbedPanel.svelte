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
  import ChartNoAxesCombined from '@lucide/svelte/icons/chart-no-axes-combined'
  import SettingsIcon from '@lucide/svelte/icons/settings'
  import { TabItem, Tabs } from 'flowbite-svelte'
  import type { Component } from 'svelte'

  import Progress from './Progress.svelte'
  import Settings from './Settings.svelte'
  import type { IconType } from './types.svelte'

  let progressIcon = $state({ icon: ChartNoAxesCombined })

  let icons: IconType[] = $derived([
    progressIcon,
    { icon: SettingsIcon },
  ])

  interface Tab {
    name: string
    content: Component<{ icon: IconType }>
  }

  const tabs: Tab[] = [
    {
      name: 'Progress',
      content: Progress,
    },
    {
      name: 'Settings',
      content: Settings,
    },
  ]
</script>

<Tabs tabStyle='full' class='gap-4'>
  {#each tabs as { name, content }, i}
    {@const Content = content}
    {@const Icon = icons[i].icon}
    {@const CLASS = 'flex p-2 w-full border-b-4 rounded-sm transition-colors duration-300'}
    <TabItem
      open={!i} activeClass='{CLASS} text-primary-500'
      inactiveClass='{CLASS} text-surface-500' class='w-full'
    >
      {#snippet titleSlot()}
        <div class='flex items-center gap-2'>
          <Icon />
          <span>{name}</span>
        </div>
      {/snippet}
      <!-- svelte-ignore binding_property_non_reactive  -->
      <Content bind:icon={icons[i]} />
    </TabItem>
  {/each}
</Tabs>
