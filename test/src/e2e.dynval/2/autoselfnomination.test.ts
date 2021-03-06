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

import { expect } from "chai";
import { H256 } from "../../primitives/src";
import "mocha";
import * as stake from "../../stakeholder";

import { validators } from "../../../tendermint.dynval/constants";
import { PromiseExpect } from "../../helper/promise";
import {
    findNode,
    selfNominate,
    setTermTestTimeout,
    withNodes
} from "../setup";

describe("Auto Self Nomination", function() {
    const promiseExpect = new PromiseExpect();
    const NOMINATION_EXPIRATION = 2;
    const TERM_SECOND = 30;

    describe("Alice doesn't self nominate in NOMINATION_EXPIRATION, Bob sends auto self nomination", async function() {
        const initialValidators = validators.slice(0, 3);
        const alice = validators[3];
        const bob = validators[4];
        const { nodes } = withNodes(this, {
            promiseExpect,
            overrideParams: {
                termSeconds: TERM_SECOND,
                nominationExpiration: NOMINATION_EXPIRATION
            },
            validators: [
                ...initialValidators.map((validator, index) => ({
                    signer: validator,
                    delegation: 5000 - index,
                    deposit: 100000
                })),
                { signer: alice, autoSelfNominate: false },
                { signer: bob, autoSelfNominate: true }
            ]
        });
        it("Alice be eligible after 2 terms and Bob did auto self nomination", async function() {
            const termWaiter = setTermTestTimeout(this, {
                terms: 3,
                params: {
                    termSeconds: TERM_SECOND
                }
            });

            const aliceNode = findNode(nodes, alice);
            const selfNominationHash = await selfNominate(
                aliceNode.rpc,
                aliceNode.testFramework,
                alice,
                10
            );
            await aliceNode.waitForTx(selfNominationHash);
            // bob will send self-nomination transaction automatically.
            const beforeCandidates = await stake.getCandidates(nodes[0].rpc);

            expect(
                beforeCandidates.map(candidate => candidate.pubkey.toString())
            ).to.includes(H256.ensure(alice.publicKey).toString());
            expect(
                beforeCandidates.map(candidate => candidate.pubkey.toString())
            ).to.includes(H256.ensure(bob.publicKey).toString());

            await termWaiter.waitNodeUntilTerm(nodes[0], {
                target: 4,
                termPeriods: 3
            });

            const [
                currentValidators,
                banned,
                candidates,
                jailed
            ] = await Promise.all([
                stake.getValidators(nodes[0].rpc, nodes[0].testFramework),
                stake.getBanned(nodes[0].rpc, nodes[0].testFramework),
                stake.getCandidates(nodes[0].rpc),
                stake.getJailed(nodes[0].rpc, nodes[0].testFramework)
            ]);

            expect(
                currentValidators.map(validator => validator.pubkey.toString())
            ).not.to.includes(alice.publicKey);
            expect(
                banned.map(ban => ban.getAccountId().toString())
            ).not.to.includes(alice.accountId);
            expect(
                candidates.map(candidate => candidate.pubkey.toString())
            ).not.to.includes(alice.publicKey);
            expect(jailed.map(jail => jail.address)).not.to.includes(
                alice.address.toString()
            );
            expect(
                currentValidators.map(validator => validator.pubkey.toString())
            ).not.to.includes(bob.publicKey);
            expect(
                candidates.map(candidate => candidate.pubkey.toString())
            ).to.includes(bob.publicKey);
        });
    });

    afterEach(function() {
        promiseExpect.checkFulfilled();
    });
});
