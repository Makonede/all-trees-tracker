# <img src="icon.svg" width="32" height="32" alt="All Trees Tracker icon"></img> All Trees Tracker

A tracker mod for the *Breath of the Wild* All Trees challenge run.

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
[*Breath of the Wild* Speedrunning Discord server](https://discord.com/invite/Nmphzaq)
to see current routing progress or help with routing. Once one is created, this
`README` will be updated to contain a link to the route.

> Should I run All Trees?

No. Why would you subject yourself to such torture?

> Is this project available in my language?

The app&rsquo;s translations can be found in
[`frontend/src/lib/translations/`](frontend/src/lib/translations). If your
language isn&rsquo;t there and you&rsquo;d like to translate the app, copy
[`en-US/`](frontend/src/lib/translations/en-US) to a directory named the
corresponding
[IETF BCP 47 language tag](https://developer.mozilla.org/en-US/docs/Glossary/BCP_47_language_tag)
and translate the strings within.

## Development

This project consists of two parts: the [backend](backend), a LayeredFS mod for
*Breath of the Wild* 1.6.0, and the [frontend](frontend), a Tauri SvelteKit app.
See their respective `README`s for development instructions.
