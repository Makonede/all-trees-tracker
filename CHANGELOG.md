# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-12-08

### Added

- Backend, a mod for *The Legend of Zelda: Breath of the Wild* 1.6.0 on the
  Nintendo Switch.
  - Communicate cut trees to the frontend.
  - Remember trees cut through disconnects.
- Frontend, a [web](https://trees.zelda.sr) and cross-platform Tauri app for
  Linux, Windows, macOS, and Android.
  - Connect to the backend and receive tree data.
  - Dynamic interactive map of remaining trees.
  - Progress bars for cut trees, including filters by region and type.
  - Configuration for DLC trees, map fly, and backend and proxy connection.
- Proxy, a CLI program for Linux, Windows, and macOS that proxies the connection
  between the backend and web frontend.

[Unreleased]: https://github.com/Makonede/all-trees-tracker/compare/1.0.0...HEAD
[1.0.0]: https://github.com/Makonede/all-trees-tracker/releases/tag/1.0.0
