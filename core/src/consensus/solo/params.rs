// Copyright 2018-2020 Kodebox, Inc.
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

use ckey::{Address, PlatformAddress};
use std::collections::HashMap;

/// Params for a null engine.
#[derive(Clone, Default)]
pub struct SoloParams {
    pub genesis_stakes: HashMap<Address, u64>,
}

impl From<cjson::scheme::SoloParams> for SoloParams {
    fn from(p: cjson::scheme::SoloParams) -> Self {
        SoloParams {
            genesis_stakes: p
                .genesis_stakes
                .unwrap_or_default()
                .into_iter()
                .map(|(pa, amount)| (PlatformAddress::into_address(pa), amount))
                .collect(),
        }
    }
}
