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
  import { isTauri } from '@tauri-apps/api/core'
  import { isValid as isValidIp } from 'ipaddr.js'
  import type { MouseEventHandler } from 'svelte/elements'

  import { connect, disconnect, errorsEffect } from './client.svelte'
  import { settings } from './config.svelte'
  import SettingEntry from './SettingEntry.svelte'
  import { t } from './translations.svelte'
  import {
    type ErrorReason, type IconType, type Setting, SettingType
  } from './types.svelte'

  let { icon = $bindable(), tabState = $bindable() }: {
    icon: IconType, tabState: { advanced?: boolean[] }
  } = $props()

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

  tabState.advanced ??= Array(CATEGORIES.length).fill(false)

  let errors: Record<Category, string> = $state(Object.fromEntries(
    CATEGORIES.map((category) => [category, ''])
  ) as Record<Category, string>)

  const translateError = (key: string) => $t('error.reason', {
    kind: 'Error',
    message: $t(`error.${key}`),
  })

  let categories: Record<Category, {
    settings: Setting[]
    advancedSettings?: Setting[]
    buttons?: Button[]
  }> = $derived({
    trees: {
      settings: [
        {
          name: 'dlc',
          kind: SettingType.Toggle,
        },
        {
          name: 'fly',
          kind: SettingType.Toggle,
        },
      ],
    },
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
      advancedSettings: !isTauri() ? [
        {
          name: 'proxy',
          kind: SettingType.Text,
        },
      ] : undefined,
      buttons: [
        {
          name: 'connect',
          color: 'bg-success-900/75',
          disabled: settings.connected ?? true,
          callback: async () => {
            errors.connection = ''

            if (!isValidIp(settings.address)) {
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
              await connect(
                settings.address, settings.port, settings.proxy,
                () => { settings.connected = true }
              )
              settings.connected = false
            }
            catch (error) {
              const reason = error as ErrorReason
              errors.connection = $t('error.reason', {
                kind: reason.kind ?? $t('error.error'),
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
    settings: categorySettings, advancedSettings: categoryAdvancedSettings,
    buttons: categoryButtons
  }], i (categoryName)}
    <h2 class='h2'>{$t(`setting.category.${categoryName}`)}</h2>
    <hr class='hr border-surface-500'>
    {#each categorySettings as { name, kind, options, tooltip, help } (name)}
      <SettingEntry {name} kind={kind as any} {options} {tooltip} {help} />
    {/each}
    {#if categoryAdvancedSettings != null && categoryAdvancedSettings.length}
      <details bind:open={tabState.advanced![i]}>
        <summary class='cursor-pointer'>{$t('setting.advanced')}</summary>
        {#each categoryAdvancedSettings as {
          name, kind, options, tooltip, help
        } (name)}
          <SettingEntry {name} kind={kind as any} {options} {tooltip} {help} />
        {/each}
      </details>
    {/if}
    {#if categoryButtons != null && categoryButtons.length}
      <hr class='hr border-surface-300-700'>
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
        {#if error}
          <p class='flex justify-center text-error-500'>
            {error}
          </p>
        {/if}
      </svelte:boundary>
    {/if}
  {/each}
</div>
