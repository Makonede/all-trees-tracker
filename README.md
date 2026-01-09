# <img src="icon.svg" width="32" height="32" alt="All Trees Tracker icon"></img> All Trees Tracker

A tracker mod for the *Breath of the Wild* All Trees challenge run.

## Installation

### Prerequisities

- A homebrewed Nintendo Switch running [Atmosphère] or a Nintendo Switch
  emulator with support for Atmosphère LayeredFS
- *The Legend of Zelda: Breath of the Wild* 1.6.0
- To use the web app:
  - A modern web browser
  - A modern Linux, Windows, or macOS device, either being the one running the
    browser or on the same network as it
- To use the desktop or mobile app:
  - A modern Linux, Windows, macOS, or Android device

> [!IMPORTANT]
> All Trees Tracker does not currently support versions of *Breath of the Wild*
> above 1.6.0 and will never support versions below 1.6.0.

### Backend

The **backend** or **server** is a mod for *Breath of the Wild* that detects the
trees you cut and sends data about them to the [**frontend**](#frontend) or
[**proxy**](#proxy).

> [!WARNING]
> All Trees Tracker is not guaranteed to function together with other mods.

<details>
  <summary>

#### Console

  </summary>

  To install the backend on a Nintendo Switch, it must be homebrewed and running
  [Atmosphère].

  1. Download the [backend] from the [latest release].
  2. Extract the archive to the root of your microSD card.

</details>

<details>
  <summary>

#### Emulator

  </summary>

  To install the backend on a Nintendo Switch emulator, it must support
  Atmosphère LayeredFS. The [mod][backend] is the same as for console. Please
  see your emulator&rsquo;s instructions for installing LayeredFS mods.

</details>

<!-- markdownlint-capture -->
<!-- markdownlint-disable MD028 -->
> [!WARNING]
> Ensure the archive is extracted to the *root* of the microSD card, and not a
> directory *within* the root. If you see an `all-trees-tracker-backend`
> directory on your microSD card, you did not extract correctly.

> [!TIP]
> If installed correctly, the following files should exist on your microSD
> card:
>
> - `/atmospere/contents/01007EF00011E000/exefs/subsdk9`
> - `/atmospere/contents/01007EF00011E000/exefs/main.npdm`
<!-- markdownlint-restore -->

### Frontend

The **frontend** or **app** is a cross-platform app for web, Linux, Windows,
macOS, and Android that connects to the [**backend**](#backend) (on Linux,
Windows, macOS, and Android) or the [**proxy**](#proxy) (on web) and displays
your progress in All Trees in real time.

There are two ways to use the frontend:

- Use the [web app] and run the [proxy](#proxy).
- Install the app from the [latest release].

### Proxy

> [!NOTE]
> The proxy is only necessary when using the web app. The native app establishes
> a connection natively and does not require the proxy to function.

The **proxy** is a CLI (command-line interface) app for Linux, Windows, and
macOS that allows the web [**frontend**](#frontend) to connect to the
[**backend**](#backend).

To run the proxy, download it from the [latest release] and execute it. Run
`all-trees-tracker-proxy -h` for information about advanced options.

> [!IMPORTANT]
> The proxy must be running at all times in order to use the frontend.

<details>
  <summary>

#### Running the proxy and frontend on separate devices

  </summary>

  The frontend supports connecting to remote proxies. Expand
  `Connection > Advanced` in Settings and change the address (by default
  `localhost`) to that of the device running the proxy.

</details>

## Usage

To begin tracking trees, open the frontend and start the proxy, if necessary.
Configure the server address with the instructions shown by the help icon:

> The IP address of the machine running the game. On console, this can be found
> in `System Settings > Internet`.

When the game starts, the backend will immediately become accessible to the
frontend. Once this happens, you can connect to the server. Cut trees will begin
showing in real time.

If the connection is broken, the backend will keep track of all trees it was
unable to send to the frontend until a connection is reestablished, avoiding
data loss.

## Uninstallation

### Backend

To uninstall the backend, delete the files added during installation. On
console, these are `/atmospere/contents/01007EF00011E000/exefs/subsdk9` and
`/atmospere/contents/01007EF00011E000/exefs/main.npdm`.

> [!TIP]
> If you only want to temporarily disable All Trees Tracker, you can do so on
> console by holding <kbd>L</kbd> while launching.

### Frontend

If installed as a native app, the frontend can be uninstalled through your
operating system&rsquo;s native app management functionality.

### Proxy

The proxy is a standalone executable. To remove it, delete the file.

## Troubleshooting

### Connection errors

Ensure that:

- The backend, frontend, and, if using the web app, proxy, are all running on
  machines with Internet access.
- Firewall rules, either on the frontend or proxy machine(s) or the network, are
  not interfering with the connection.
- Your console or emulator is on the same network as the proxy (web app) or
  frontend (desktop or mobile app).
- You are connected to the correct backend, and, if using the web app, proxy,
  address.
- If you are using the web app, the proxy is running.

### White screen on Linux

Launch the app with `WEBKIT_DISABLE_COMPOSITING_MODE=1`.

## FAQ

> What is All Trees?

All Trees is a joke speedrun category for *The Legend of Zelda: Breath of the
Wild*. The goal is to cut every cuttable tree at least once (trees will respawn
once far enough away, so they cannot all be cut simultaneously).

> How many trees are there?

There are 15,461 trees in Hyrule. If running the Extended category,
DLC-exclusive trees are included, of which all 222 are located in the Trial of
the Sword, bringing the total to 15,683.

> Why a tracker?

Tracking 15,461 or 15,683 trees manually is nearly impossible. A tracker is
necessary for runners to know which trees they have already cut and which trees
are left to cut without losing track or spending unnecessary time keeping track
manually.

> How do I run All Trees?

If you don&rsquo;t care about speed, all you need to do is cut every tree. If
you want a fast time, however, the category has not yet been fully
routed&mdash;feel free to join the
[*Breath of the Wild* Speedrunning Discord server] to see current routing
progress or help with routing. Once one is created, this `README` will be
updated to contain a link to the route.

> Should I run All Trees?

No. Why would you subject yourself to such torture?

> Is this project available in my language?

The app&rsquo;s translations can be found in
[`frontend/src/lib/translations/`](frontend/src/lib/translations). If your
language isn&rsquo;t there and you&rsquo;d like to translate the app, copy
[`en-US/`](frontend/src/lib/translations/en-US) to a directory named the
corresponding [IETF BCP 47 language tag] and translate the strings within.

## Development

This project consists of three components: the [backend](backend), a LayeredFS
mod for *Breath of the Wild* 1.6.0, the [frontend](frontend), a Tauri SvelteKit
app, and the [proxy](proxy), a WebSocket server that interfaces the backend and
the web frontend. See their respective `README`s for development instructions.

## License

All Trees Tracker is licensed under the [GNU GPLv3]. Copyright notices specify
inclusive ranges of copyright years.

[Atmosphère]: https://github.com/Atmosphere-NX/Atmosphere
[backend]: https://github.com/Makonede/all-trees-tracker/releases/latest/download/all-trees-tracker-backend.zip
[web app]: https://trees.zelda.sr
[latest release]: https://github.com/Makonede/all-trees-tracker/releases/latest
[*Breath of the Wild* Speedrunning Discord server]: https://discord.com/invite/Nmphzaq
[IETF BCP 47 language tag]: https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag
[GNU GPLv3]: https://www.gnu.org/licenses/gpl-3.0.html
