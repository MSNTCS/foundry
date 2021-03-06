// FIXME: The SDK doesn't export addressValue.
// In the import statement below uses "foundry-primitives" which is installed by the SDK.
// We should use the SDK's addressValue when the SDK is updated.
import RPC from "foundry-rpc";
import { AddressValue } from "../primitives/src";
import { SDK } from "../sdk";
import { Address, H512, U64 } from "../sdk/core/classes";

import { toHex } from "../primitives/src";
import { HANDLER_ID } from "./index";
import { decodeaddress, decodeH256, decodeU64, isArrayOf } from "./util";

const RLP = require("rlp");

export async function getUndelegatedCCS(
    rpc: RPC,
    address: AddressValue,
    blockNumber?: number
): Promise<U64> {
    const data = await rpc.engine.getCustomActionData({
        handlerId: HANDLER_ID,
        bytes: `0x${toHex(
            RLP.encode([
                "Account",
                Address.ensure(address)
                    .getAccountId()
                    .toEncodeObject()
            ])
        )}`,
        blockNumber
    });
    if (data == null) {
        return new U64(0);
    }
    return decodeU64(RLP.decode(Buffer.from(data, "hex")));
}

export async function getCCSHolders(
    rpc: RPC,
    sdk: SDK,
    blockNumber?: number
): Promise<Address[]> {
    const data = await rpc.engine.getCustomActionData({
        handlerId: HANDLER_ID,
        bytes: `0x${toHex(RLP.encode(["StakeholderAddresses"]))}`,
        blockNumber
    });
    if (data == null) {
        throw Error("Expected non-null value, but got a null");
    }
    const decoded = RLP.decode(Buffer.from(data, "hex"));
    if (!isArrayOf<Buffer>(decoded, Buffer.isBuffer)) {
        throw Error(
            "Expected a rlp of Array<Buffer>, but got an invalid shaped value"
        );
    }
    return decoded.map(buf => decodeaddress(sdk, buf));
}

export interface Delegation {
    delegatee: Address;
    quantity: U64;
}
export async function getDelegations(
    rpc: RPC,
    sdk: SDK,
    delegator: Address,
    blockNumber?: number
): Promise<Delegation[]> {
    const data = await rpc.engine.getCustomActionData({
        handlerId: HANDLER_ID,
        bytes: `0x${toHex(
            RLP.encode(["Delegation", delegator.accountId.toEncodeObject()])
        )}`,
        blockNumber
    });
    if (data == null) {
        return [];
    }
    const decoded = RLP.decode(Buffer.from(data, "hex"));
    function isDelegationShape(entry: any): entry is Buffer[] {
        return entry != null && Array.isArray(entry) && entry.length === 2;
    }
    if (!isArrayOf<Buffer[]>(decoded, isDelegationShape)) {
        throw new Error(
            "Expected a rlp of Array<Buffer[4]>, but got an invalid shaped value"
        );
    }
    return decoded.map(([delegatee, quantity]) => {
        return {
            delegatee: decodeaddress(sdk, delegatee),
            quantity: decodeU64(quantity)
        };
    });
}

export interface Candidate {
    pubkey: H512;
    deposit: U64;
    nominationEndsAt: U64;
    metadata: Buffer;
}

export async function getCandidates(
    rpc: RPC,
    blockNumber?: number
): Promise<Candidate[]> {
    const data = await rpc.engine.getCustomActionData({
        handlerId: HANDLER_ID,
        bytes: `0x${toHex(RLP.encode(["Candidates"]))}`,
        blockNumber
    });
    if (data == null) {
        return [];
    }
    const decoded = RLP.decode(Buffer.from(data, "hex"));
    function isCandidateShape(entry: any): entry is Buffer[] {
        return entry != null && Array.isArray(entry) && entry.length === 4;
    }
    if (!isArrayOf<Buffer[]>(decoded, isCandidateShape)) {
        throw new Error(
            "Expected a rlp of Array<Buffer[4]>, but got an invalid shaped value"
        );
    }
    return decoded.map(([pubkey, deposit, nominationEndsAt, metadata]) => ({
        pubkey: decodeH256(pubkey),
        deposit: decodeU64(deposit),
        nominationEndsAt: decodeU64(nominationEndsAt),
        metadata
    }));
}

export interface Prisoner {
    address: Address;
    deposit: U64;
    custodyUntil: U64;
    releasedAt: U64;
}

export async function getJailed(
    rpc: RPC,
    sdk: SDK,
    blockNumber?: number
): Promise<Prisoner[]> {
    const data = await rpc.engine.getCustomActionData({
        handlerId: HANDLER_ID,
        bytes: `0x${toHex(RLP.encode(["Jail"]))}`,
        blockNumber
    });
    if (data == null) {
        return [];
    }
    const decoded = RLP.decode(Buffer.from(data, "hex"));
    const isCandidateShape = (entry: any): entry is Buffer[] =>
        entry != null && Array.isArray(entry) && entry.length === 4;
    if (!isArrayOf<Buffer[]>(decoded, isCandidateShape)) {
        throw new Error(
            "Expected a rlp of Array<Buffer[4]>, but got an invalid shaped value"
        );
    }
    return decoded.map(([address, deposit, custodyUntil, releasedAt]) => ({
        address: decodeaddress(sdk, address),
        deposit: decodeU64(deposit),
        custodyUntil: decodeU64(custodyUntil),
        releasedAt: decodeU64(releasedAt)
    }));
}

export async function getBanned(
    rpc: RPC,
    sdk: SDK,
    blockNumber?: number
): Promise<Address[]> {
    const data = await rpc.engine.getCustomActionData({
        handlerId: HANDLER_ID,
        bytes: `0x${toHex(RLP.encode(["Banned"]))}`,
        blockNumber
    });
    if (data == null) {
        return [];
    }
    const decoded = RLP.decode(Buffer.from(data, "hex"));
    if (!isArrayOf<Buffer>(decoded, Buffer.isBuffer)) {
        throw new Error(
            "Expected a rlp of Array<Buffer>, but an invalid shaped value"
        );
    }
    return decoded.map(address => decodeaddress(sdk, address));
}

export interface IntermediateRewards {
    previous: IntermediateReward[];
    current: IntermediateReward[];
}

export interface IntermediateReward {
    address: Address;
    quantity: U64;
}

export async function getIntermediateRewards(
    rpc: RPC,
    sdk: SDK,
    blockNumber?: number
): Promise<IntermediateRewards> {
    const data = await rpc.engine.getCustomActionData({
        handlerId: HANDLER_ID,
        bytes: `0x${toHex(RLP.encode(["IntermediateRewards"]))}`,
        blockNumber
    });
    if (data == null) {
        return {
            previous: [],
            current: []
        };
    }
    const decoded = RLP.decode(Buffer.from(data, "hex"));
    function isIntermediateRewardShape(entry: any): entry is Buffer[] {
        return entry != null && Array.isArray(entry) && entry.length === 2;
    }
    function isIntermediateRewardsFieldShape(entry: any): entry is Buffer[][] {
        return isArrayOf<Buffer[]>(entry, isIntermediateRewardShape);
    }
    if (
        !isArrayOf<Buffer[][]>(decoded, isIntermediateRewardsFieldShape) ||
        decoded.length !== 2
    ) {
        throw new Error(
            "Expected a rlp of Buffer[2][][2], but an invalid shaped value"
        );
    }
    function convert(entries: Buffer[][]): IntermediateReward[] {
        return entries.map(([address, quantity]) => ({
            address: decodeaddress(sdk, address),
            quantity: decodeU64(quantity)
        }));
    }
    return {
        previous: convert(decoded[0]),
        current: convert(decoded[1])
    };
}

export interface Validator {
    weight: U64;
    delegation: U64;
    deposit: U64;
    pubkey: H512;
}

export async function getValidators(
    rpc: RPC,
    sdk: SDK,
    blockNumber?: number
): Promise<Validator[]> {
    const data = await rpc.engine.getCustomActionData({
        handlerId: HANDLER_ID,
        bytes: `0x${toHex(RLP.encode(["Validators"]))}`,
        blockNumber
    });
    if (data == null) {
        return [];
    }
    const decoded = RLP.decode(Buffer.from(data, "hex"));
    function isValidatorShape(entry: any): entry is Buffer[] {
        return entry != null && Array.isArray(entry) && entry.length === 4;
    }
    if (!isArrayOf<Buffer[]>(decoded, isValidatorShape)) {
        throw new Error(
            "Expected a rlp of Buffer[4][], but an invalid shaped value"
        );
    }
    return decoded.map(([weight, delegation, deposit, pubkey]) => ({
        weight: decodeU64(weight),
        delegation: decodeU64(delegation),
        deposit: decodeU64(deposit),
        pubkey: decodeH256(pubkey)
    }));
}
