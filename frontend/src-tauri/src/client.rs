// SPDX-License-Identifier: GPL-3.0-or-later
/*
This file is part of All Trees Tracker.
Copyright (C) 2025 Mako

All Trees Tracker is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not,
see <https://www.gnu.org/licenses/>.
*/

use std::{io, net::{AddrParseError, SocketAddr}, ops::Not, time::Duration};

use async_atomic::{AsyncAtomic, AsyncAtomicRef};
use serde::{ser::Serializer, Serialize};
use tauri::{AppHandle, Emitter, State, ipc::Channel};
use tokio::net::TcpStream;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    AddrParseError(#[from] AddrParseError),
    #[error(transparent)]
    IoError(#[from] io::Error),
}

#[derive(Serialize)]
#[serde(tag = "kind", content = "message")]
enum ErrorKind {
    AddrParseError(String),
    IoError(String),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> where S: Serializer {
        let error_message = self.to_string();
        let error_kind = match self {
            Self::AddrParseError(_) => ErrorKind::AddrParseError(error_message),
            Self::IoError(_) => ErrorKind::IoError(error_message),
        };
        error_kind.serialize(serializer)
    }
}

#[tauri::command]
pub async fn connect(
    app: AppHandle, address: String, port: u16, tracker: Channel<u32>,
    connected: State<'_, AsyncAtomic<bool>>
) -> Result<(), Error> {
    let std_stream = std::net::TcpStream::connect_timeout(
        &SocketAddr::new(address.parse()?, port), Duration::from_secs(10)
    )?;
    std_stream.set_nonblocking(true)?;
    let stream = TcpStream::from_std(std_stream)?;

    let mut hash = [0u8; 4];
    connected.store(true);
    app.emit("connected", ()).unwrap();

    loop {
        tokio::select! {
            _ = stream.readable() => {}
            _ = connected.wait(bool::not) => { break; }
        }

        match stream.try_read(&mut hash) {
            Ok(0) => { return Err(io::Error::from(io::ErrorKind::ConnectionAborted).into()); }
            Ok(_) => tracker.send(u32::from_le_bytes(hash)).unwrap(),
            Err(e) if e.kind() != io::ErrorKind::WouldBlock => { return Err(e.into()); }
            _ => {}
        }
    }

    Ok(())
}

#[tauri::command]
pub fn disconnect(connected: State<'_, AsyncAtomic<bool>>) {
    connected.store(false);
}
