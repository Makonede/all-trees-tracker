# <img src="icon.svg" width="32" height="32" alt="All Trees Tracker backend icon"></img> Frontend

> [!NOTE]
> This is developer documentation. If you just want to use the project, see the
> [project `README`](/README.md).

This directory contains the frontend, a Tauri SvelteKit app.

## Prerequisites

- [Deno](https://deno.com) 2.7.14+
- [Node.js](https://nodejs.org/en) v24.11.1+
- [Rust](https://www.rust-lang.org/tools/install) 1.90.0+

## Build

```sh
deno i                         # Install dependencies
deno task tauri build          # Build for desktop
deno task tauri android build  # Build for Android
```

The AppImage, `.deb`, and `.rpm` bundles can be found in
`src-tauri/target/release/bundle/`. The APK can be found in
`src-tauri/gen/android/app/build/outputs/apk/universal/release/`.

## Develop

```sh
deno task tauri dev                  # run development server
deno task check && deno task lint    # lint Svelte and TypeScript code
```
