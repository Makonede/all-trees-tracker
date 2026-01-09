// SPDX-License-Identifier: GPL-3.0-or-later
/*
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
*/

import CircleQuestionMark from '@lucide/svelte/icons/circle-question-mark'

import type { Component } from 'svelte'

import { settings } from './config.svelte'

export enum ChartType {
  ProgressBar,
  BarChart,
  LineChart,
  PieChart,
}

export enum SettingType {
  Toggle,
  Text,
  Integer,
}

export type Setting = ({
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

export type Filter = 'region' | 'type'
export type IconType = { icon: Component }

export type ErrorReason = {
  kind: string
  message: string
}
