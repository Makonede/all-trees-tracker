/*
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
*/

import i18n, { type Config } from 'sveltekit-i18n'

const LOCALES = [
  'en-US',
]
const KEYS = [
  'common',
  'tab',
  'progress',
  'region',
]

const CONFIG: Config = { loaders: LOCALES.flatMap((locale) => KEYS.map(
  (key) => ({ locale, key, loader: ((locale, key) => async () => (await import(
    `./translations/${locale}/${key}.json`
  )).default)(locale, key) })
)) }

export const {
  t, locale, locales, loading, loadTranslations
} = new i18n(CONFIG)
