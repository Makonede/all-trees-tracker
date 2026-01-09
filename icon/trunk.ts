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

scale(10)
size(1, 1, 8).at(0, 0, 0).render('#483000')
size(5, 5, 1).at(-2, -2, 5)
  .union(size(3, 5, 1).at(-1, -2, 6))
  .union(size(5, 3, 1).at(-2, -1, 6))
  .union(size(3, 3, 1).at(-1, -1, 7))
  .union(size(3, 1, 1).at(-1, 0, 8))
  .union(size(1, 3, 1).at(0, -1, 8))
  .render('#00600010')
