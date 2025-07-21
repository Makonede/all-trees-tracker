/*
This file is part of all-trees-tracker.
Copyright (C) 2025 Mako

all-trees-tracker is free software: you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not,
see <https://www.gnu.org/licenses/>.
*/

use std::{io, sync::atomic::{AtomicBool, Ordering}};

use serde::{ser::Serializer, Serialize};
use stubborn_io::StubbornTcpStream;
use tauri::{State, ipc::Channel};

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error(transparent)]
    IoError(#[from] io::Error),
}

#[derive(Serialize)]
#[serde(tag = "kind", content = "message")]
#[serde(rename_all = "camelCase")]
enum ErrorKind {
    IoError(String),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> where S: Serializer {
        let error_message = self.to_string();
        let error_kind = match self {
            Self::IoError(_) => ErrorKind::IoError(error_message),
        };
        error_kind.serialize(serializer)
    }
}

#[tauri::command]
pub async fn connect(
    address: String, port: u16, channel: Channel<u32>, connected: State<'_, AtomicBool>
) -> Result<(), Error> {
    let stream = StubbornTcpStream::connect((address, port)).await?;
    let mut hash = [0u8; 4];
    connected.store(true, Ordering::Relaxed);

    loop {
        stream.readable().await?;

        match stream.try_read(&mut hash) {
            Ok(_) => { channel.send(u32::from_le_bytes(hash)).unwrap(); }
            Err(e) if e.kind() != io::ErrorKind::WouldBlock => { return Err(e.into()); }
            _ => {}
        }

        if !connected.load(Ordering::Relaxed) { break; }
    }

    Ok(())
}

#[tauri::command]
pub fn disconnect(connected: State<'_, AtomicBool>) {
    connected.store(false, Ordering::Relaxed);
}
