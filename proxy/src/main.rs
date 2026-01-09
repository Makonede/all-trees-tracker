// SPDX-License-Identifier: GPL-3.0-or-later
/*
Copyright (C) 2025-2026 Mako

This file is part of All Trees Tracker.

All Trees Tracker is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not,
see <https://www.gnu.org/licenses/>.
*/

#![feature(never_type)]

use std::{io, net::{Ipv6Addr, SocketAddr}, time::Duration};

use clap::Parser;
use clap_i18n_richformatter::{ClapI18nRichFormatter, clap_i18n, init_clap_rich_formatter_localizer};
use futures::{SinkExt, StreamExt, TryStreamExt};
use tokio::{net::{TcpListener, TcpStream}, task::JoinError};
use tokio_tungstenite::{accept_async, tungstenite::{self, Bytes, Message}};

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    IoError(#[from] io::Error),
    #[error(transparent)]
    JoinError(#[from] JoinError),
    #[error(transparent)]
    TungsteniteError(#[from] tungstenite::Error),
}

#[derive(Parser)]
#[command(
    version, about = "Connect the All Trees Tracker web app to Breath of the Wild.",
    long_about = None
)]
#[clap_i18n]
struct Args {
    /// Port to run the WebSocket server on
    #[arg(short, long, default_value_t = 5002, value_parser = clap::value_parser!(u16).range(1..))]
    port: u16,
}

#[tokio::main]
async fn main() -> Result<!, Error> {
    init_clap_rich_formatter_localizer();
    let args = Args::try_parse().map_err(|e| {
        let e = e.apply::<ClapI18nRichFormatter>();
        e.exit();
    }).unwrap();

    let server = TcpListener::bind((Ipv6Addr::LOCALHOST, args.port)).await?;
    println!("WebSocket server started on {:?}", server.local_addr()?);

    loop {
        let (stream, frontend) = server.accept().await?;
        let _ = tokio::spawn(async move || -> Result<(), Error> {
            let websocket = accept_async(stream).await?;
            println!("Frontend connected from {:?}", frontend);
            let (mut write, mut read) = websocket.split();

            let address = match read.try_next().await {
                Ok(Some(Message::Text(bytes))) => bytes,
                _ => { return Ok(()); }
            };
            let port = match read.try_next().await {
                Ok(Some(Message::Binary(bytes))) => {
                    let Ok(bytes) = (*bytes).try_into() else { return Ok(()); };
                    u16::from_be_bytes(bytes)
                }
                _ => { return Ok(()); }
            };

            let switch_address = SocketAddr::new({
                let Ok(address) = address.parse() else { return Ok(()); };
                address
            }, port);
            println!("Connecting to {:?}...", switch_address);
            let std_switch = std::net::TcpStream::connect_timeout(
                &switch_address, Duration::from_secs(10)
            )?;
            std_switch.set_nonblocking(true)?;
            let switch = TcpStream::from_std(std_switch)?;
            println!("Connected to backend at {:?}", switch.peer_addr()?);

            let mut connect = async move || -> Result<(), Error> {
                let mut hash = [0u8; 4];

                loop {
                    switch.readable().await?;
                    match switch.try_read(&mut hash) {
                        Ok(0) => {
                            return Err(io::Error::from(io::ErrorKind::ConnectionAborted).into());
                        }
                        Ok(_) => {
                            write.send(Message::Binary(Bytes::from_static(Box::leak(Box::from(
                                u32::from_le_bytes(hash).to_be_bytes()
                            ))))).await?;
                        }
                        Err(e) if e.kind() == io::ErrorKind::WouldBlock => { continue; }
                        Err(e) => { return Err(e.into()); }
                    }
                }
            };

            tokio::select! {
                res = connect() => res,
                res = read.try_for_each(async |message| {
                    if let Message::Close(_) = message { Err(tungstenite::Error::ConnectionClosed) }
                    else { Ok(()) }
                }) => Ok(res?),
            }
        }()).await?;

        println!("Frontend disconnected");
    }
}
