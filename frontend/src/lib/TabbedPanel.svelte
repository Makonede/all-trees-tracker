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
  import SettingsIcon from '@lucide/svelte/icons/settings'
  import { TabItem, Tabs } from 'flowbite-svelte'
  import type { Component } from 'svelte'

  import { getProgressIcon } from './icons.svelte'
  import Progress from './Progress.svelte'
  import Settings from './Settings.svelte'

  interface Tab {
    name: string
    content: Component
    icon: Component
  }

  const tabs: Tab[] = [
    {
      name: 'Progress',
      content: Progress,
      icon: getProgressIcon(),
    },
    {
      name: 'Settings',
      content: Settings,
      icon: SettingsIcon,
    },
  ]
</script>

<Tabs tabStyle='underline'>
  {#each tabs as { name, content, icon }, i}
    {@const Content = content}
    {@const Icon = icon}
    <TabItem open={!i}>
      {#snippet titleSlot()}
        <div class='flex items-center gap-2'>
          <Icon />
          <span>{name}</span>
        </div>
      {/snippet}
      <Content />
    </TabItem>
  {/each}
</Tabs>
