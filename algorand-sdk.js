/**
 * Algorand SDK Integration with WalletConnect
 * Supports both Pera Wallet and WalletConnect
 */

const ALGORAND_CONFIG = {
    testnet: {
        token: '',
        server: 'https://testnet-api.algonode.cloud',
        port: ''
    },
    mainnet: {
        token: '',
        server: 'https://mainnet-api.algonode.cloud',
        port: ''
    }
};

const NETWORK = 'testnet';
const config = ALGORAND_CONFIG[NETWORK];

let algodClient = null;
let peraWallet = null;
let walletConnect = null;

function initAlgorandSDK() {
    if (typeof algosdk !== 'undefined') {
        algodClient = new algosdk.Algodv2(config.token, config.server, config.port);
        console.log('✓ Algorand SDK initialized');
    }
    
    if (typeof PeraWalletConnect !== 'undefined') {
        peraWallet = new PeraWalletConnect({ chainId: NETWORK === 'mainnet' ? 416001 : 416002 });
        console.log('✓ Pera Wallet initialized');
    }
    
    if (typeof WalletConnect !== 'undefined') {
        walletConnect = new WalletConnect({
            bridge: 'https://bridge.walletconnect.org',
            qrcodeModal: typeof QRCodeModal !== 'undefined' ? QRCodeModal : null
        });
        console.log('✓ WalletConnect initialized');
    }
}

async function connectPeraWallet() {
    if (!peraWallet) throw new Error('Pera Wallet not available');
    const accounts = await peraWallet.connect();
    return accounts[0];
}

async function connectWalletConnect() {
    if (!walletConnect) throw new Error('WalletConnect not available');
    
    if (!walletConnect.connected) {
        await walletConnect.createSession();
    }
    
    return new Promise((resolve, reject) => {
        walletConnect.on('connect', (error, payload) => {
            if (error) reject(error);
            const { accounts } = payload.params[0];
            resolve(accounts[0]);
        });
    });
}

async function createPaymentTransaction(from, to, amount, note) {
    if (!algodClient) throw new Error('Algorand client not initialized');
    
    const params = await algodClient.getTransactionParams().do();
    const microAlgos = Math.floor(amount * 1000000);
    
    return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from,
        to,
        amount: microAlgos,
        note: new Uint8Array(Buffer.from(note || 'Tip from Creator Tip Jar')),
        suggestedParams: params
    });
}

async function signAndSendTransaction(txn, walletType) {
    let signedTxn;
    
    if (walletType === 'pera' && peraWallet) {
        const singleTxnGroups = [{ txn, signers: [txn.from.toString()] }];
        signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
    } else if (walletType === 'walletconnect' && walletConnect) {
        const txnBase64 = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString('base64');
        const signedTxns = await walletConnect.sendCustomRequest({
            id: Date.now(),
            jsonrpc: '2.0',
            method: 'algo_signTxn',
            params: [[{ txn: txnBase64 }]]
        });
        signedTxn = signedTxns.map(tx => new Uint8Array(Buffer.from(tx, 'base64')));
    } else {
        throw new Error('No wallet available');
    }
    
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    await algosdk.waitForConfirmation(algodClient, txId, 4);
    return txId;
}

function disconnectWallet(walletType) {
    if (walletType === 'pera' && peraWallet) {
        peraWallet.disconnect();
    } else if (walletType === 'walletconnect' && walletConnect) {
        walletConnect.killSession();
    }
}

window.AlgorandSDK = {
    initAlgorandSDK,
    connectPeraWallet,
    connectWalletConnect,
    createPaymentTransaction,
    signAndSendTransaction,
    disconnectWallet,
    getClient: () => algodClient,
    getPeraWallet: () => peraWallet,
    getWalletConnect: () => walletConnect,
    NETWORK
};
