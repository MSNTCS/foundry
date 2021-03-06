import { U64 } from "../../primitives/src";

export type NetworkId = string;

export interface CommonParams {
    maxExtraDataSize: U64;
    networkID: NetworkId;
    maxBodySize: U64;
    snapshotPeriod: U64;
    termSeconds: U64;
    nominationExpiration: U64;
    custodyPeriod: U64;
    releasePeriod: U64;
    maxNumOfValidators: U64;
    minNumOfValidators: U64;
    delegationThreshold: U64;
    minDeposit: U64;
    maxCandidateMetadataSize: U64;
}
