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

const config: Config = { loaders: [
  {
    locale: 'en-US',
    key: 'common',
    loader: async () => (await import('./en-US/common.json')).default,
  },
  {
    locale: 'en-US',
    key: 'tab',
    loader: async () => (await import('./en-US/tab.json')).default,
  },
  {
    locale: 'en-US',
    key: 'progress',
    loader: async () => (await import('./en-US/progress.json')).default,
  },
  {
    locale: 'en-US',
    key: 'region',
    loader: async () => (await import('./en-US/region.json')).default,
  },
] }

export const {
  t, locale, locales, loading, loadTranslations
} = new i18n(config)
