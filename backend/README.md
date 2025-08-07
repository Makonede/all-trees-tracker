# <img src="icon.svg" width="32" height="32" alt="All Trees Tracker backend icon"></img> Backend

> [!NOTE]
> This is developer documentation. If you just want to use the project, see the
> [project `README`](/README.md).

This directory contains the backend, a LayeredFS mod for *Breath of the Wild*
1.6.0.

## Prerequisites

- [Megaton](https://megaton.pistonite.dev/install.html) 0.0.0+
  - [devkitPro `switch-dev`](https://devkitpro.org/wiki/Getting_Started)
  - [Rust](https://www.rust-lang.org/tools/install) 1.56.0+
  - [Ninja](https://ninja-build.org/) 1.12.0+
  - [CMake](https://cmake.org/download/) 4.0.0+

## Build

Build the backend with
[Megaton](https://megaton.pistonite.dev/create_project.html#build):

```sh
megaton build -L # initial
megaton build    # subsequent
```

The NSO can be found in `target/megaton/none/`.
