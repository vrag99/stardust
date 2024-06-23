import * as utils from "@noble/curves/abstract/utils";
import { p256 as secp256r1 } from "@noble/curves/p256";
import { secp256k1 } from "@noble/curves/secp256k1";
import { Signature as EthersSignature, Wallet } from "ethers";
import { CairoCustomEnum, CallData, hash, num, shortString, uint256 } from "starknet";
import { KeyPair, SignerType, signerTypeToCustomEnum } from "../signers/signers";

export type NormalizedSecpSignature = { r: bigint; s: bigint; yParity: boolean };

export function normalizeSecpR1Signature(signature: {
  r: bigint;
  s: bigint;
  recovery: number;
}): NormalizedSecpSignature {
  return normalizeSecpSignature(secp256r1, signature);
}

export function normalizeSecpK1Signature(signature: {
  r: bigint;
  s: bigint;
  recovery: number;
}): NormalizedSecpSignature {
  return normalizeSecpSignature(secp256k1, signature);
}

export function normalizeSecpSignature(
  curve: typeof secp256r1 | typeof secp256k1,
  signature: { r: bigint; s: bigint; recovery: number },
): NormalizedSecpSignature {
  let s = signature.s;
  let yParity = signature.recovery !== 0;
  if (s > curve.CURVE.n / 2n) {
    s = curve.CURVE.n - s;
    yParity = !yParity;
  }
  return { r: signature.r, s, yParity };
}

export class EthKeyPair extends KeyPair {
  pk: bigint;
  allowLowS?: boolean;

  constructor(pk?: string | bigint, allowLowS?: boolean) {
    super();

    if (pk == undefined) {
      pk = Wallet.createRandom().privateKey;
    }
    if (typeof pk === "string") {
      pk = BigInt(pk);
    }
    this.pk = pk;
    this.allowLowS = allowLowS;
  }

  public get address(): bigint {
    return BigInt(new Wallet("0x" + padTo32Bytes(num.toHex(this.pk))).address);
  }

  public get guid(): bigint {
    return BigInt(hash.computePoseidonHash(shortString.encodeShortString("Secp256k1 Signer"), this.address));
  }

  public get storedValue(): bigint {
    throw new Error("Not implemented yet");
  }

  public get signer(): CairoCustomEnum {
    return signerTypeToCustomEnum(SignerType.Secp256k1, { signer: this.address });
  }

  public async signRaw(messageHash: string): Promise<string[]> {
    const signature = normalizeSecpK1Signature(
      secp256k1.sign(padTo32Bytes(messageHash), this.pk, { lowS: this.allowLowS }),
    );

    return CallData.compile([
      signerTypeToCustomEnum(SignerType.Secp256k1, {
        pubkeyHash: this.address,
        r: uint256.bnToUint256(signature.r),
        s: uint256.bnToUint256(signature.s),
        y_parity: signature.yParity,
      }),
    ]);
  }
}

export class Eip191KeyPair extends KeyPair {
  pk: string;

  constructor(pk?: string | bigint) {
    super();
    this.pk = pk ? "0x" + padTo32Bytes(num.toHex(pk)) : Wallet.createRandom().privateKey;
  }

  public get address() {
    return BigInt(new Wallet(this.pk).address);
  }

  public get guid(): bigint {
    return BigInt(hash.computePoseidonHash(shortString.encodeShortString("Eip191 Signer"), this.address));
  }

  public get storedValue(): bigint {
    throw new Error("Not implemented yet");
  }

  public get signer(): CairoCustomEnum {
    return signerTypeToCustomEnum(SignerType.Eip191, { signer: this.address });
  }

  public async signRaw(messageHash: string): Promise<string[]> {
    const ethSigner = new Wallet(this.pk);
    messageHash = "0x" + padTo32Bytes(messageHash);
    const ethersSignature = EthersSignature.from(ethSigner.signMessageSync(num.hexToBytes(messageHash)));

    const signature = normalizeSecpK1Signature({
      r: BigInt(ethersSignature.r),
      s: BigInt(ethersSignature.s),
      recovery: ethersSignature.yParity ? 1 : 0,
    });

    return CallData.compile([
      signerTypeToCustomEnum(SignerType.Eip191, {
        ethAddress: this.address,
        r: uint256.bnToUint256(signature.r),
        s: uint256.bnToUint256(signature.s),
        y_parity: signature.yParity,
      }),
    ]);
  }
}

export class EstimateEip191KeyPair extends KeyPair {
  readonly address: bigint;

  constructor(address: bigint) {
    super();
    this.address = address;
  }

  public get privateKey(): string {
    throw new Error("EstimateEip191KeyPair does not have a private key");
  }

  public get guid(): bigint {
    throw new Error("Not implemented yet");
  }

  public get storedValue(): bigint {
    throw new Error("Not implemented yet");
  }

  public get signer(): CairoCustomEnum {
    return signerTypeToCustomEnum(SignerType.Eip191, { signer: this.address });
  }

  public async signRaw(messageHash: string): Promise<string[]> {
    return CallData.compile([
      signerTypeToCustomEnum(SignerType.Eip191, {
        ethAddress: this.address,
        r: uint256.bnToUint256("0x1556a70d76cc452ae54e83bb167a9041f0d062d000fa0dcb42593f77c544f647"),
        s: uint256.bnToUint256("0x1643d14dbd6a6edc658f4b16699a585181a08dba4f6d16a9273e0e2cbed622da"),
        y_parity: false,
      }),
    ]);
  }
}

export class Secp256r1KeyPair extends KeyPair {
  pk: bigint;
  private allowLowS?: boolean;

  constructor(pk?: string | bigint, allowLowS?: boolean) {
    super();
    this.pk = BigInt(pk ? `${pk}` : Wallet.createRandom().privateKey);
    this.allowLowS = allowLowS;
  }

  public get publicKey() {
    const publicKey = secp256r1.getPublicKey(this.pk).slice(1);
    return uint256.bnToUint256("0x" + utils.bytesToHex(publicKey));
  }

  public get guid(): bigint {
    return BigInt(
      hash.computePoseidonHashOnElements([
        shortString.encodeShortString("Secp256r1 Signer"),
        this.publicKey.low,
        this.publicKey.high,
      ]),
    );
  }

  public get storedValue(): bigint {
    throw new Error("Not implemented yet");
  }

  public get signer() {
    return signerTypeToCustomEnum(SignerType.Secp256r1, { signer: this.publicKey });
  }

  public async signRaw(messageHash: string): Promise<string[]> {
    messageHash = padTo32Bytes(messageHash);
    const signature = normalizeSecpR1Signature(secp256r1.sign(messageHash, this.pk, { lowS: this.allowLowS }));
    return CallData.compile([
      signerTypeToCustomEnum(SignerType.Secp256r1, {
        pubkey: this.publicKey,
        r: uint256.bnToUint256(signature.r),
        s: uint256.bnToUint256(signature.s),
        y_parity: signature.yParity,
      }),
    ]);
  }
}

export function padTo32Bytes(hexString: string): string {
  if (hexString.startsWith("0x")) {
    hexString = hexString.slice(2);
  }
  if (hexString.length < 64) {
    hexString = "0".repeat(64 - hexString.length) + hexString;
  }
  return hexString;
}

export const randomEthKeyPair = () => new EthKeyPair();
export const randomEip191KeyPair = () => new Eip191KeyPair();
export const randomSecp256r1KeyPair = () => new Secp256r1KeyPair();
