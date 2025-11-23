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
  import { openUrl } from '@tauri-apps/plugin-opener'

  import * as L from 'leaflet'
  import { Map as SveafletMap, TileLayer } from 'sveaflet'

  import { onMount } from 'svelte'

  import 'leaflet/dist/leaflet.css'

  import { cutTrees, getLastTree } from './client.svelte'
  import { settings } from './config.svelte'
  import { baseTrees } from './trees.svelte'

  const WIDTH = 24000
  const HEIGHT = 20000
  const BOUNDS = L.latLngBounds(
    [-HEIGHT / 2, -WIDTH / 2], [HEIGHT / 2, WIDTH / 2]
  )
  const CENTER = L.latLng(HEIGHT / 2, WIDTH / 2)

  const MIN_ZOOM = 2
  const MAX_ZOOM = 10
  const DEFAULT_ZOOM = 3
  const TREE_ZOOM = 8

  const crs = { ...L.CRS.Simple, transformation: L.transformation(
    4 / 0x100, WIDTH / 0x100, 4 / 0x100, HEIGHT / 0x100
  ) }

  const trees = new Map<number, L.Circle>()
  for (const [hash, tree] of baseTrees) {
    let treeColor = settings.colors.get(tree.name)
    if (!treeColor) {
      treeColor = `oklch(from hsl(0deg, 100%, 60%) l c calc(h + ${
        Math.random() * 360
      }))`
      settings.colors.set(tree.name, treeColor)
    }
    trees.set(hash, L.circle(L.latLng(tree.pos[2], tree.pos[0]), {
      radius: 1,
      color: treeColor,
    }))
  }

  let treeGroup: L.LayerGroup = L.layerGroup([...trees.entries().filter(
    (tree) => !cutTrees.get(tree[0])!
  ).map((tree) => tree[1])])
  let map = $state<L.Map>()
  let mapReady = false

  $effect(() => { if (!mapReady && map != null) {
    mapReady = true
    map.getContainer().classList.add('bg-black!', 'rounded-lg!')
    map.setView(L.latLng(0, 0), undefined, { animate: false })
    treeGroup.addTo(map)
  } })

  $effect(() => {
    const hash = getLastTree()
    if (hash !== -1) {
      trees.get(hash)!.remove()
      // TODO: make fly configurable
      const tree = baseTrees.get(hash)!
      map?.flyTo(L.latLng(tree.pos[2], tree.pos[0]), TREE_ZOOM)
    }
    else treeGroup = L.layerGroup([...trees.entries().filter(
      (tree) => !cutTrees.get(tree[0])!
    ).map((tree) => tree[1])])
  })

  $effect(() => { for (const [hash, tree] of trees) tree.setStyle({
    color: settings.colors.get(baseTrees.get(hash)!.name)!
  }) })
</script>

<div class='h-full bg-black rounded-lg' onclickcapture={
  async (event: MouseEvent) => {
    const target = event.target! as HTMLElement
    if (target.tagName === 'A' && target.parentElement!.classList.contains(
      'leaflet-control-attribution'
    )) {
      event.preventDefault()
      event.stopPropagation()
      await openUrl((target as HTMLAnchorElement).href)
    }
  }
}>
  <SveafletMap options={{
    crs,
    center: CENTER,
    zoom: DEFAULT_ZOOM,
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    maxBounds: BOUNDS,
  }} bind:instance={map}>
    <TileLayer
      url={'https://objmap.zeldamods.org/game_files/maptex/{z}/{x}/{y}.webp'}
      options={{
        maxNativeZoom: 7,
        attribution: '&copy; ZeldaMods',
      }}
    />
  </SveafletMap>
</div>
