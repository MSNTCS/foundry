// Copyright 2018-2019 Kodebox, Inc.
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

use super::super::types::FilterStatus;
use cidr::IpCidr;
use ckey::X25519Public as Public;
use jsonrpc_core::Result;
use std::collections::HashMap;
use std::net::{IpAddr, SocketAddr};

#[rpc(server)]
pub trait Net {
    #[rpc(name = "net_localKeyFor")]
    fn local_key_for(&self, addr: IpAddr, port: u16) -> Result<Public>;

    #[rpc(name = "net_registerRemoteKeyFor")]
    fn register_remote_key_for(&self, addr: IpAddr, port: u16, public: Public) -> Result<Public>;

    #[rpc(name = "net_connect")]
    fn connect(&self, addr: IpAddr, port: u16) -> Result<()>;

    #[rpc(name = "net_disconnect")]
    fn disconnect(&self, addr: IpAddr, port: u16) -> Result<()>;

    #[rpc(name = "net_isConnected")]
    fn is_connected(&self, addr: IpAddr, port: u16) -> Result<bool>;

    #[rpc(name = "net_getPort")]
    fn get_port(&self) -> Result<u16>;

    #[rpc(name = "net_getPeerCount")]
    fn get_peer_count(&self) -> Result<usize>;

    #[rpc(name = "net_getEstablishedPeers")]
    fn get_established_peers(&self) -> Result<Vec<SocketAddr>>;

    #[rpc(name = "net_addToWhitelist")]
    fn add_to_whitelist(&self, addr: IpCidr, tag: Option<String>) -> Result<()>;

    #[rpc(name = "net_removeFromWhitelist")]
    fn remove_from_whitelist(&self, addr: IpCidr) -> Result<()>;

    #[rpc(name = "net_addToBlacklist")]
    fn add_to_blacklist(&self, addr: IpCidr, tag: Option<String>) -> Result<()>;

    #[rpc(name = "net_removeFromBlacklist")]
    fn remove_from_blacklist(&self, addr: IpCidr) -> Result<()>;

    #[rpc(name = "net_enableWhitelist")]
    fn enable_whitelist(&self) -> Result<()>;

    #[rpc(name = "net_disableWhitelist")]
    fn disable_whitelist(&self) -> Result<()>;

    #[rpc(name = "net_enableBlacklist")]
    fn enable_blacklist(&self) -> Result<()>;

    #[rpc(name = "net_disableBlacklist")]
    fn disable_blacklist(&self) -> Result<()>;

    #[rpc(name = "net_getWhitelist")]
    fn get_whitelist(&self) -> Result<FilterStatus>;

    #[rpc(name = "net_getBlacklist")]
    fn get_blacklist(&self) -> Result<FilterStatus>;

    #[rpc(name = "net_recentNetworkUsage")]
    fn recent_network_usage(&self) -> Result<HashMap<String, usize>>;
}
