<!-- SPDX-License-Identifier: GPL-3.0-or-later -->
<!--
Copyright (C) 2025-2026 Mako

This file is part of All Trees Tracker.

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
  import CircleQuestionMark from '@lucide/svelte/icons/circle-question-mark'
  import { Switch } from '@skeletonlabs/skeleton-svelte'

  import { settings } from './config.svelte'
  import { t } from './translations.svelte'
  import { type Setting, SettingType } from './types.svelte'

  let {
    name, kind, options, tooltip = $bindable(), help = $bindable()
  }: Setting = $props()
</script>

<svelte:boundary>
  {@const enter = () => tooltip?.showPopover()}
  {@const leave = () => tooltip?.hidePopover()}
  <div
    class='flex flex-col 2xl:flex-row gap-4 justify-between 2xl:items-center'
    style='--anchor: {name};'
  >
    <div class='flex 2xl:gap-2 justify-between 2xl:justify-normal items-center'>
      <p>{$t(`setting.${name}.name`)}</p>
      <div>
        <!-- svelte-ignore binding_property_non_reactive  -->
        <CircleQuestionMark
          class='cursor-help anchor/(--anchor)' bind:this={help}
          onmouseenter={enter} onmouseleave={leave} onfocus={enter}
          onblur={leave}
        />
        <!-- svelte-ignore binding_property_non_reactive  -->
        <div
          popover='hint'
          class='p-4 mt-2 max-w-150 opacity-0 open:opacity-100 starting:open:opacity-0 transition-[display,opacity,overlay] transition-discrete duration-300 anchored/(--anchor) card preset-filled-surface-100-900 preset-outlined-primary-500'
          bind:this={tooltip}
        >{@html $t(`setting.${name}.description`)}</div>
      </div>
    </div>
    {#if kind === SettingType.Toggle}
      <Switch class='justify-center' checked={
        settings[name] as boolean
      } onCheckedChange={
        ({ checked }) => { (settings[name] as boolean) = checked }
      }>
        <Switch.Label class='text-lg'>{$t(`setting.${name}.off`)}</Switch.Label>
        <Switch.Control
          class='preset-filled-surface-100-900 data-[state=checked]:preset-filled-primary-500'
        >
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Label class='text-lg'>{$t(`setting.${name}.on`)}</Switch.Label>
        <Switch.HiddenInput />
      </Switch>
    {:else if kind === SettingType.Text}
      <input
        type='text' placeholder={$t(`setting.${name}.placeholder`)}
        class='2xl:w-1/2 font-mono placeholder:text-surface-500 input preset-filled-surface-100-900'
        bind:value={settings[name]}
      >
    {:else if kind === SettingType.Integer}
      <input
        type='number' min={options!.min} max={options!.max}
        placeholder={$t(`setting.${name}.placeholder`)}
        class='2xl:w-1/2 font-mono placeholder:text-surface-500 input preset-filled-surface-100-900'
        bind:value={settings[name]}
      >
    {/if}
  </div>
</svelte:boundary>
