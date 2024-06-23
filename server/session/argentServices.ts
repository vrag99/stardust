import { Account, ArraySignatureType, Call, InvocationsSignerDetails, ec, hash, num, typedData } from "starknet";
import {
  OffChainSession,
  OutsideExecution,
  StarknetKeyPair,
  calculateTransactionHash,
  getSessionTypedData,
  getTypedData,
  manager,
} from "..";

export class ArgentX {
  constructor(
    public account: Account,
    public backendService: BackendService,
  ) {}

  public async getOffchainSignature(typedData: typedData.TypedData): Promise<ArraySignatureType> {
    return (await this.account.signMessage(typedData)) as ArraySignatureType;
  }
}

export class BackendService {
  // TODO We might want to update this to support KeyPair instead of StarknetKeyPair?
  // Or that backend becomes: "export class BackendService extends KeyPair {", can also extends RawSigner ?
  constructor(private backendKey: StarknetKeyPair) {}

  public async signTxAndSession(
    calls: Call[],
    transactionDetail: InvocationsSignerDetails,
    sessionTokenToSign: OffChainSession,
    cacheAuthorization: boolean,
  ): Promise<bigint[]> {
    // verify session param correct
    // extremely simplified version of the backend verification
    // backend must check, timestamps fees, used tokens nfts...
    const allowed_methods = sessionTokenToSign.allowed_methods;
    if (
      !calls.every((call) => {
        return allowed_methods.some(
          (method) => method["Contract Address"] === call.contractAddress && method.selector === call.entrypoint,
        );
      })
    ) {
      throw new Error("Call not allowed by backend");
    }

    const transactionHash = calculateTransactionHash(transactionDetail, calls);
    const sessionMessageHash = typedData.getMessageHash(
      await getSessionTypedData(sessionTokenToSign),
      transactionDetail.walletAddress,
    );
    const sessionWithTxHash = hash.computePoseidonHashOnElements([
      transactionHash,
      sessionMessageHash,
      +cacheAuthorization,
    ]);
    const signature = ec.starkCurve.sign(sessionWithTxHash, num.toHex(this.backendKey.privateKey));
    return [signature.r, signature.s];
  }

  public async signOutsideTxAndSession(
    calls: Call[],
    sessionTokenToSign: OffChainSession,
    accountAddress: string,
    outsideExecution: OutsideExecution,
    revision: typedData.TypedDataRevision,
    cacheAuthorization: boolean,
  ): Promise<bigint[]> {
    // TODO backend must verify, timestamps fees, used tokens nfts...
    const currentTypedData = getTypedData(outsideExecution, await manager.getChainId(), revision);
    const messageHash = typedData.getMessageHash(currentTypedData, accountAddress);
    const sessionMessageHash = typedData.getMessageHash(await getSessionTypedData(sessionTokenToSign), accountAddress);
    const sessionWithTxHash = hash.computePoseidonHashOnElements([
      messageHash,
      sessionMessageHash,
      +cacheAuthorization,
    ]);
    const signature = ec.starkCurve.sign(sessionWithTxHash, num.toHex(this.backendKey.privateKey));
    return [signature.r, signature.s];
  }

  public getBackendKey(accountAddress: string): bigint {
    return this.backendKey.publicKey;
  }
}
