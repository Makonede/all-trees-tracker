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
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import { Map as SveafletMap, TileLayer } from 'sveaflet'
  import { onMount } from 'svelte'

  const WIDTH = 24000
  const HEIGHT = 20000
  const BOUNDS = L.latLngBounds(
    [-HEIGHT / 2, -WIDTH / 2], [HEIGHT / 2, WIDTH / 2]
  )
  const CENTER = L.latLng(HEIGHT / 2, WIDTH / 2)

  const crs = { ...L.CRS.Simple, transformation: L.transformation(
    4 / 0x100, WIDTH / 0x100, 4 / 0x100, HEIGHT / 0x100
  ) }

  let map: L.Map

  onMount(() => {
    map.getContainer().classList.add('bg-black!', 'rounded-lg!')
    map.setView([0, 0], 3, { animate: false })
    map.attributionControl.addAttribution('Map data by ZeldaMods')
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
      options={{ maxNativeZoom: 7 }}
    />
  </SveafletMap>
</div>
