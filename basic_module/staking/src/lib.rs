// Copyright 2020 Kodebox, Inc.
// This file is part of CodeChain.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

#[macro_use]
extern crate serde_derive;

mod error;
mod runtime_error;
mod state;
mod types;

use coordinator::context::{ChainHistoryAccess, SubStateHistoryAccess, SubStorageAccess};

fn substorage() -> Box<dyn SubStorageAccess> {
    unimplemented!()
}

fn deserialize<T: serde::de::DeserializeOwned>(buffer: Vec<u8>) -> T {
    serde_cbor::from_slice(&buffer).unwrap()
}

fn serialize<T: serde::ser::Serialize>(data: T) -> Vec<u8> {
    serde_cbor::to_vec(&data).unwrap()
}

fn chain_history_manager() -> Box<dyn ChainHistoryAccess> {
    unimplemented!()
}

fn state_history_manager() -> Box<dyn SubStateHistoryAccess> {
    unimplemented!()
}
