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

// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

use crate::cache::{GlobalCache, ModuleCache, ShardCache, TopCache};
use crate::impls::TopLevelState;
use cdb::{new_journaldb, Algorithm, AsHashDB, DatabaseError, HashDB, JournalDB};
use ctypes::{ShardId, StorageId};
use kvdb::DBTransaction;
use primitives::H256;
use std::collections::HashMap;
use std::sync::Arc;

/// State database abstraction.
pub struct StateDB {
    /// Backing database.
    db: Box<dyn JournalDB>,
    cache: GlobalCache,
    current_hash: Option<H256>,
}

impl StateDB {
    /// Create a new instance wrapping `JournalDB`
    pub fn new(db: Box<dyn JournalDB>) -> StateDB {
        StateDB {
            db,
            cache: Default::default(),
            current_hash: None,
        }
    }

    pub fn new_with_memorydb() -> Self {
        let memorydb = Arc::new(kvdb_memorydb::create(0));
        let db = new_journaldb(memorydb, Algorithm::Archive, None);
        Self::new(db)
    }

    /// Journal all recent operations under the given era and ID.
    pub fn journal_under(&mut self, batch: &mut DBTransaction, now: u64, id: H256) -> Result<u32, DatabaseError> {
        let records = self.db.journal_under(batch, now, &id)?;
        self.current_hash = Some(id);
        Ok(records)
    }

    /// Check if the database is empty.
    pub fn is_empty(&self) -> bool {
        self.db.is_empty()
    }

    pub fn top_cache(&self) -> TopCache {
        self.cache.top_cache()
    }

    pub fn shard_caches(&self) -> HashMap<ShardId, ShardCache> {
        self.cache.shard_caches()
    }

    pub fn module_caches(&self) -> HashMap<StorageId, ModuleCache> {
        self.cache.module_caches()
    }

    pub fn override_state(&mut self, state: &TopLevelState) {
        self.cache.override_cache(state.top_cache(), state.shard_caches(), state.module_caches());
        self.current_hash = Some(state.root());
    }

    pub fn clone(&self, hash: &H256) -> Self {
        let (cache, current_hash) = if self.current_hash.as_ref() == Some(hash) {
            (self.cache.clone(), self.current_hash)
        } else {
            (Default::default(), None)
        };

        Self {
            db: self.db.boxed_clone(),
            cache,
            current_hash,
        }
    }

    pub fn clear_cache(&mut self) {
        self.cache.clear();
    }
}

impl AsHashDB for StateDB {
    /// Conversion method to interpret self as `HashDB` reference
    fn as_hashdb(&self) -> &dyn HashDB {
        self.db.as_hashdb()
    }

    /// Conversion method to interpret self as mutable `HashDB` reference
    fn as_hashdb_mut(&mut self) -> &mut dyn HashDB {
        self.db.as_hashdb_mut()
    }
}
