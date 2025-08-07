# <img src="icon.svg" width="32" height="32" alt="All Trees Tracker backend icon"></img> Frontend

> [!NOTE]
> This is developer documentation. If you just want to use the project, see the
> [project `README`](/README.md).

This directory contains the frontend, a Tauri SvelteKit app.

## Prerequisites

- [Bun](https://bun.sh/) 1.2.20
- [Rust](https://www.rust-lang.org/tools/install) 1.90.0+

## Build

```sh
bun i                        # install dependencies
turbo tauri -- build         # build for desktop
turbo tauri -- android build # build for Android
```

The AppImage, `.deb`, and `.rpm` bundles can be found in
`src-tauri/target/release/bundle/`. The APK can be found in
`src-tauri/gen/android/app/build/outputs/apk/universal/release/`.

## Develop

```sh
turbo tauri -- dev # run development server
turbo check lint   # lint Svelte and TypeScript code
```
