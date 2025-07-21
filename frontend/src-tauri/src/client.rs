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

use std::{io, sync::Mutex};

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

#[derive(Default)]
pub struct AppState { connected: bool }

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase", rename_all_fields = "camelCase", tag = "event", content = "data")]
pub enum TrackerEvent { Tree(u32) }

#[tauri::command]
pub async fn connect(
    address: String, port: u16, state: State<'_, Mutex<AppState>>, channel: Channel<TrackerEvent>
) -> Result<(), Error> {
    let stream = StubbornTcpStream::connect((address, port)).await?;
    let mut hash = vec![0u8; 4];
    {
        let mut state = state.lock().unwrap();
        state.connected = true;
    }

    loop {
        stream.readable().await?;

        match stream.try_read(&mut hash) {
            Ok(_) => { channel.send(TrackerEvent::Tree(u32::from_le_bytes(
                hash.clone().try_into().unwrap()
            ))).unwrap(); }
            Err(e) if e.kind() != io::ErrorKind::WouldBlock => { return Err(e.into()); }
            _ => {}
        }

        if !state.lock().unwrap().connected { break; }
    }

    Ok(())
}

#[tauri::command]
pub fn disconnect(state: State<'_, Mutex<AppState>>) {
    let mut state = state.lock().unwrap();
    state.connected = false;
}
