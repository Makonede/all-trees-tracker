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
  import CircleQuestionMark from '@lucide/svelte/icons/circle-question-mark'

  import type { MouseEventHandler } from 'svelte/elements'

  import { connect, disconnect, errorsEffect } from './client.svelte'
  import { settings } from './config.svelte'
  import { t } from './translations.svelte'
  import { type ErrorReason, type IconType, SettingType } from './types.svelte'

  let { icon = $bindable(), tabState = $bindable() }: {
    icon: IconType, tabState: Record<string, unknown>
  } = $props()

  type Setting = ({
    kind: SettingType.Toggle | SettingType.Text
    options?: undefined
  } | {
    kind: SettingType.Integer
    options: {
      min: number
      max: number
    }
  }) & {
    name: keyof typeof settings
    help?: CircleQuestionMark
    tooltip?: HTMLDivElement
  }

  interface Button {
    name: string
    color: string
    disabled?: boolean
    callback: MouseEventHandler<HTMLButtonElement>
  }

  const CATEGORIES = [
    'connection',
  ] as const
  type Category = (typeof CATEGORIES)[number]

  let errors: Record<Category, string> = $state(Object.fromEntries(
    CATEGORIES.map((category) => [category, ''])
  ) as Record<Category, string>)

  const IPV4_REGEX =
    /^(?!0)(?!.*\.$)(?:(?:1?\d?\d|2[0-4]\d|25[0-5])(?:\.|$)){4}$/

  const translateError = (key: string) => $t('error.reason', {
    kind: 'Error',
    message: $t(`error.${key}`),
  })

  let categories: Record<Category, {
    settings: Setting[]
    buttons: Button[]
  }> = $derived({
    connection: {
      settings: [
        {
          name: 'address',
          kind: SettingType.Text,
        },
        {
          name: 'port',
          kind: SettingType.Integer,
          options: { min: 1, max: 65535 },
        },
      ],
      buttons: [
        {
          name: 'connect',
          color: 'bg-success-900/75',
          disabled: settings.connected ?? true,
          callback: async () => {
            errors.connection = ''

            if (!settings.address.match(IPV4_REGEX)) {
              errors.connection = translateError('invalidAddress')
              return
            }
            if (!(
              Number.isInteger(settings.port)
              && settings.port
              && settings.port === (Math.abs(settings.port) & 0xffff)
            )) {
              errors.connection = translateError('invalidPort')
              return
            }

            settings.connected = undefined
            try {
              await connect(settings.address, settings.port, () => {
                settings.connected = true
              })
              settings.connected = false
            }
            catch (error) {
              const reason = error as ErrorReason
              errors.connection = $t('error.reason', {
                kind: reason.kind ?? 'Error',
                message: reason.message
              })
              settings.connected = false
            }
          },
        },
        {
          name: 'disconnect',
          color: 'bg-error-900/75',
          disabled: !settings.connected,
          callback: disconnect,
        },
      ],
    },
  })

  $effect(errorsEffect)
</script>

<div class='p-8 space-y-4 w-full text-lg card preset-filled-surface-200-800'>
  {#each Object.entries(categories) as [categoryName, {
    settings: categorySettings, buttons: categoryButtons
  }] (categoryName)}
    <h2 class='h2'>{$t(`setting.category.${categoryName}`)}</h2>
    <hr class='border-surface-500 hr'>
    {#each categorySettings as { name, kind, options, tooltip }, i (name)}
      {@const enter = () => tooltip?.showPopover()}
      {@const leave = () => tooltip?.hidePopover()}
      <div
        class='flex flex-col 2xl:flex-row gap-4 justify-between 2xl:items-center'
        style='--anchor: {name};'
      >
        <div
          class='flex 2xl:gap-2 justify-between 2xl:justify-normal items-center'
        >
          <p>{$t(`setting.${name}.name`)}</p>
          <div>
            <!-- svelte-ignore binding_property_non_reactive  -->
            <CircleQuestionMark
              class='cursor-help anchor/(--anchor)'
              bind:this={categorySettings[i].help} onmouseenter={enter}
              onmouseleave={leave} onfocus={enter} onblur={leave}
            />
            <!-- svelte-ignore binding_property_non_reactive  -->
            <div
              popover='hint'
              class='p-4 mt-2 max-w-150 opacity-0 open:opacity-100 starting:open:opacity-0 transition-[display,opacity,overlay] transition-discrete duration-300 anchored/(--anchor) card preset-filled-surface-100-900 preset-outlined-primary-500'
              bind:this={categorySettings[i].tooltip}
            >{@html $t(`setting.${name}.description`)}</div>
          </div>
        </div>
        {#if kind === SettingType.Text}
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
    {/each}
    {#if categoryButtons}
      <br>
      <div
        class='flex flex-col 2xl:flex-row gap-4 2xl:justify-around items-center'
      >
        {#each categoryButtons as { name, color, disabled, callback } (name)}
          <button
            {disabled} class='{color} btn btn-lg' onclick={callback}
          >{$t(`setting.button.${name}`)}</button>
        {/each}
      </div>
      <svelte:boundary>
        {@const error = errors[categoryName as Category]}
        <p class='{error ? '' : 'hidden'} flex justify-center text-error-500'>
          {error}
        </p>
      </svelte:boundary>
    {/if}
  {/each}
</div>
