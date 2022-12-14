import { ethers } from 'ethers';
import { IWalletProvider } from '../context/IWalletContext';
import { IWallet } from './IWallet';
import { IToken, ITokenMetadata, ITokenAllocationBreakdown, IListToken } from './IToken';
import { ITransaction, TransactionStatus } from './ITransaction';

export enum NFTContractMetadataType {
    None = 'None',
    Hosted = 'Hosted',
    Url = 'Url'
}

export enum NFTContractType {
    ERC721 = 'ERC721',
    ERC1155 = 'ERC1155'
}

export enum NetworkType {
    Ethereum = 'Ethereum',
    Polygon = 'Polygon',
    Solana = 'Solana'
}

export enum NetworkEnvironment {
    Emulator = 'Emulator',
    Testnet = 'Testnet',
    Mainnet = 'Mainnet'
}

export enum NetworkChain {
    EVMLocal = 1337,
    ETHEREUM = 1,
    Ropsten = 3,
    Rinkeby = 4,
    Goerli = 5,
    POLYGON = 137,
    Mumbai = 80001
}

interface INFTContractWhitelist {
    startDate?: string | null;
    endDate?: string | null;
}
export interface INFTContract {
    name: string;
    symbol: string;
    allowBuyOnNetwork: boolean;
    allowBuyWithMoonPay: boolean;
    publicSaleAt?: Date;
    saleClosesAt?: Date;
    erc721Price?: number;
    tokenCount: number;
    erc721MaxPerTransaction?: number;
    whitelists: INFTContractWhitelist[];
    metadata: {
        type: NFTContractMetadataType;
        contractUrl?: string;
        tokenUrl?: string;
    };
    network: {
        chainId: NetworkChain;
        contractAddress: string;
        contractType: NFTContractType;
        environment: NetworkEnvironment;
        type: NetworkType;
    }
}

export interface IHyperMintContract {
    signer?: ethers.Signer | null;

    getTotalMinted: (tokenId: number) => Promise<number>;
    getConnectedWallet: () => Promise<IWallet>;

    openWalletConnector: () => Promise<IWalletProvider>;
    connect: () => Promise<void>;
    disconnect: () => void;
    getContractInformation: () => Promise<INFTContract>;
    getTokenBalance: () => Promise<number>;
    getTokens: () => Promise<IListToken[]>;
    getToken: (tokenId: number) => Promise<IToken>;
    getTokenAllocation: (tokenId: string, walletAddress: string) => Promise<ITokenAllocationBreakdown[]>;
    getTokenMetadataUrl: (tokenId: number) => Promise<string>;
    getTokenMetadata: (tokenId: number) => Promise<ITokenMetadata>;
    getTransactionStatus: (transaction: ITransaction) => Promise<TransactionStatus>;
    getWalletBalance: () => Promise<number>;
    getWalletAddress: () => Promise<string>;
    isWalletValid: () => Promise<boolean>;
    waitForTransaction: (transaction: ITransaction) => Promise<TransactionStatus>;
    buy: (amount: number, tokenId?: number, wait?: boolean) => Promise<ITransaction>;
    transfer: (to: string, tokenId: number, amount?: number) => Promise<ITransaction>;
    getMoonPayWidgetUrl: (tokenId?: number) => Promise<string>;
    buyAuthorised: (
        amount: number,
        tokenId: number,
        wait?: boolean,
        ethPrice?: number,
        maxPerAddress?: number,
        expires?: number,
        signature?: string
    ) => Promise<ITransaction>;
}
