import { Address, U64 } from "../classes";
import { Transaction } from "../Transaction";
import { NetworkId } from "../types";

export interface RevokeActionJSON {
    address: string;
    quantity: string;
}

export class Revoke extends Transaction {
    private readonly address: Address;
    private readonly quantity: U64;

    public constructor(address: Address, quantity: U64, networkId: NetworkId) {
        super(networkId);
        this.address = address;
        this.quantity = quantity;
    }

    public type(): string {
        return "revoke";
    }

    protected actionToEncodeObject(): any[] {
        return [
            0x23,
            this.address.getAccountId().toEncodeObject(),
            this.quantity.toEncodeObject()
        ];
    }

    protected actionToJSON(): RevokeActionJSON {
        return {
            address: this.address.value,
            quantity: this.quantity.toJSON()
        };
    }
}
