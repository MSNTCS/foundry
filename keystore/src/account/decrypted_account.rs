// Copyright 2019-2020 Kodebox, Inc.
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

use ckey::{sign, Ed25519Private as Private, Ed25519Public as Public, Error as KeyError, Message, Signature};

/// An opaque wrapper for secret. The inner data of Private implements Drop trait to clear memory.
#[derive(Clone)]
pub struct DecryptedAccount {
    secret: Private,
}

impl DecryptedAccount {
    pub fn new(secret: Private) -> DecryptedAccount {
        DecryptedAccount {
            secret,
        }
    }

    /// Sign a message.
    pub fn sign(&self, message: &Message) -> Result<Signature, KeyError> {
        Ok(sign(&message, &self.secret))
    }

    /// Derive public key.
    pub fn public(&self) -> Result<Public, KeyError> {
        Ok(self.secret.public_key())
    }
}
