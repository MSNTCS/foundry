import { expect } from "chai";
import { H512, U128 } from "../../../primitives/src";
import "mocha";
import * as Message from "../message";

describe("Check P2P Message RLP encoding", function() {
    it("Sync1 RLP encoding test", function() {
        const msg = new Message.Sync1(
            new H512(
                "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef"
            ),
            "ab",
            3048
        );
        expect([...msg.rlpBytes()]).deep.equal([
            248,
            73,
            1,
            184,
            64,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            130,
            97,
            98,
            130,
            11,
            232
        ]);
    });

    it("Sync2 RLP encoding test", function() {
        const msg = new Message.Sync2(
            new H512(
                "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef"
            ),
            new H512(
                "fedcba0987654321" +
                    "fedcba0987654321" +
                    "fedcba0987654321" +
                    "fedcba0987654321" +
                    "fedcba0987654321" +
                    "fedcba0987654321" +
                    "fedcba0987654321" +
                    "fedcba0987654321"
            ),
            "ab",
            3048
        );
        expect([...msg.rlpBytes()]).deep.equal([
            248,
            139,
            2,
            184,
            64,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            184,
            64,
            254,
            220,
            186,
            9,
            135,
            101,
            67,
            33,
            254,
            220,
            186,
            9,
            135,
            101,
            67,
            33,
            254,
            220,
            186,
            9,
            135,
            101,
            67,
            33,
            254,
            220,
            186,
            9,
            135,
            101,
            67,
            33,
            254,
            220,
            186,
            9,
            135,
            101,
            67,
            33,
            254,
            220,
            186,
            9,
            135,
            101,
            67,
            33,
            254,
            220,
            186,
            9,
            135,
            101,
            67,
            33,
            254,
            220,
            186,
            9,
            135,
            101,
            67,
            33,
            130,
            97,
            98,
            130,
            11,
            232
        ]);
    });

    it("Ack RLP encoding test", function() {
        const msg = new Message.Ack(
            new H512(
                "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef" +
                    "1234567890abcdef"
            ),
            Buffer.of(0xd, 0xe, 0xa, 0xd, 0xb, 0xe, 0xe, 0xf)
        );
        expect([...msg.rlpBytes()]).deep.equal([
            248,
            76,
            3,
            184,
            64,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            18,
            52,
            86,
            120,
            144,
            171,
            205,
            239,
            136,
            13,
            14,
            10,
            13,
            11,
            14,
            14,
            15
        ]);
    });

    it("Nack RLP encoding test", function() {
        const msg = new Message.Nack();
        expect([...msg.rlpBytes()]).deep.equal([193, 4]);
    });

    it("RequestMessage RLP encoding test", function() {
        const msg = new Message.NegotiationRequest("extension name", [
            1,
            2,
            3,
            4
        ]);
        expect([...msg.rlpBytes()]).deep.equal([
            213,
            5,
            142,
            101,
            120,
            116,
            101,
            110,
            115,
            105,
            111,
            110,
            32,
            110,
            97,
            109,
            101,
            196,
            1,
            2,
            3,
            4
        ]);
    });

    it("ResponseMessage RLP encoding test", function() {
        const msg = new Message.NegotiationResponse("extension name", 0);
        expect([...msg.rlpBytes()]).deep.equal([
            209,
            6,
            142,
            101,
            120,
            116,
            101,
            110,
            115,
            105,
            111,
            110,
            32,
            110,
            97,
            109,
            101,
            128
        ]);
    });

    it("EncryptedMessage RLP encoding test", function() {
        const extensionName = "encrypt";
        const data = "this data must be encrypted";
        const msg = new Message.Encrypted(extensionName, Buffer.from(data));
        expect([...msg.rlpBytes()]).deep.equal([
            229,
            7,
            135,
            101,
            110,
            99,
            114,
            121,
            112,
            116,
            155,
            116,
            104,
            105,
            115,
            32,
            100,
            97,
            116,
            97,
            32,
            109,
            117,
            115,
            116,
            32,
            98,
            101,
            32,
            101,
            110,
            99,
            114,
            121,
            112,
            116,
            101,
            100
        ]);
    });

    it("UnencryptedMessage RLP encoding test", function() {
        const extensionName = "unencrypt";
        const data = "this data must be encrypted";
        const msg = new Message.Unencrypted(extensionName, Buffer.from(data));
        expect([...msg.rlpBytes()]).deep.equal([
            231,
            8,
            137,
            117,
            110,
            101,
            110,
            99,
            114,
            121,
            112,
            116,
            155,
            116,
            104,
            105,
            115,
            32,
            100,
            97,
            116,
            97,
            32,
            109,
            117,
            115,
            116,
            32,
            98,
            101,
            32,
            101,
            110,
            99,
            114,
            121,
            112,
            116,
            101,
            100
        ]);
    });

    it("SignedMessage RLP encoding test", function() {
        const msg = new Message.Ack(
            new H512(
                "deadbeefcafe" +
                    "deadbeefcafe" +
                    "deadbeefcafe" +
                    "deadbeefcafe" +
                    "deadbeefcafe" +
                    "deadbeefcafe" +
                    "deadbeefcafe" +
                    "deadbeefcafe" +
                    "deadbeefcafe" +
                    "deadbeefcafe" +
                    "deadbeef"
            ),
            Buffer.of(0xd, 0xe, 0xa, 0xd, 0xb, 0xe, 0xe, 0xf)
        );
        const signed = new Message.SignedMessage(
            msg,
            new U128("0x00000000000000000000000000000000")
        );
        expect([...signed.rlpBytes()]).deep.equal([
            248,
            113,
            184,
            78,
            248,
            76,
            3,
            184,
            64,
            222,
            173,
            190,
            239,
            202,
            254,
            222,
            173,
            190,
            239,
            202,
            254,
            222,
            173,
            190,
            239,
            202,
            254,
            222,
            173,
            190,
            239,
            202,
            254,
            222,
            173,
            190,
            239,
            202,
            254,
            222,
            173,
            190,
            239,
            202,
            254,
            222,
            173,
            190,
            239,
            202,
            254,
            222,
            173,
            190,
            239,
            202,
            254,
            222,
            173,
            190,
            239,
            202,
            254,
            222,
            173,
            190,
            239,
            202,
            254,
            222,
            173,
            190,
            239,
            136,
            13,
            14,
            10,
            13,
            11,
            14,
            14,
            15,
            160,
            149,
            212,
            176,
            135,
            92,
            208,
            151,
            240,
            9,
            149,
            211,
            232,
            151,
            75,
            246,
            2,
            60,
            232,
            146,
            189,
            98,
            102,
            165,
            17,
            43,
            227,
            150,
            252,
            204,
            73,
            54,
            67
        ]);
    });
});
