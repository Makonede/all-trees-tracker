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
  import * as L from 'leaflet'
  import { Map as SveafletMap, TileLayer } from 'sveaflet'
  import { onMount } from 'svelte'

  import 'leaflet/dist/leaflet.css'

  import { cutTrees } from './client.svelte'
  import { settings } from './settings.svelte'
  import { baseTrees, type MapTree } from './trees.svelte'

  const WIDTH = 24000
  const HEIGHT = 20000
  const BOUNDS = L.latLngBounds(
    [-HEIGHT / 2, -WIDTH / 2], [HEIGHT / 2, WIDTH / 2]
  )
  const CENTER = L.latLng(HEIGHT / 2, WIDTH / 2)

  const crs = { ...L.CRS.Simple, transformation: L.transformation(
    4 / 0x100, WIDTH / 0x100, 4 / 0x100, HEIGHT / 0x100
  ) }

  const trees = new Map<number, L.Circle>()
  for (const [hash, tree] of baseTrees) {
    let treeColor = settings.colors.get(tree.name)
    if (!treeColor) {
      treeColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 60%)`
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

  onMount(() => {
    map = map!
    map.getContainer().classList.add('bg-black!', 'rounded-lg!')
    map.setView(L.latLng(0, 0), 3, { animate: false })
    treeGroup.addTo(map)
  })

  $effect(() => {
    let lastTree: MapTree | undefined
    let reset = true

    for (const [hash, cut] of cutTrees) if (cut) {
      trees.get(hash)?.remove()
      lastTree = baseTrees.get(hash)
      reset = false
    }

    if (reset) treeGroup = L.layerGroup([...trees.entries().filter(
      (tree) => !cutTrees.get(tree[0])!
    ).map((tree) => tree[1])])
    else if (lastTree != null) // TODO: make pan configurable
      map?.panTo(L.latLng(lastTree.pos[2], lastTree.pos[0]))
  })
</script>

<div class='h-full bg-black rounded-lg'>
  <SveafletMap options={{
    zoomSnap: 0.5,
    zoomDelta: 0.5,
    crs,
    center: CENTER,
    zoom: 3,
    minZoom: 2,
    maxZoom: 10,
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
