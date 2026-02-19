/**
 * Algorand SDK Integration
 * Real implementation using algosdk and PeraWallet
 * 
 * To use:
 * 1. Include algosdk: <script src="https://unpkg.com/algosdk@2.7.0/dist/browser/algosdk.min.js"></script>
 * 2. Include PeraWallet: <script src="https://unpkg.com/@perawallet/connect@1.3.4/dist/index.min.js"></script>
 */

// Algorand client configuration
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

// Use TestNet by default
const NETWORK = 'testnet';
const config = ALGORAND_CONFIG[NETWORK];

// Initialize Algorand client
let algodClient = null;
let peraWallet = null;

// Initialize when SDK is loaded
function initAlgorandSDK() {
    if (typeof algosdk !== 'undefined') {
        algodClient = new algosdk.Algodv2(config.token, config.server, config.port);
        console.log('✓ Algorand SDK initialized');
    }
    
    if (typeof PeraWalletConnect !== 'undefined') {
        peraWallet = new PeraWalletConnect();
        console.log('✓ Pera Wallet initialized');
    }
}

// Create payment transaction
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

// Sign and send transaction
async function signAndSendTransaction(txn) {
    if (!peraWallet) throw new Error('Pera Wallet not initialized');
    
    const singleTxnGroups = [{ txn, signers: [txn.from.toString()] }];
    const signedTxn = await peraWallet.signTransaction([singleTxnGroups]);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();
    
    await algosdk.waitForConfirmation(algodClient, txId, 4);
    return txId;
}

// Export functions
window.AlgorandSDK = {
    initAlgorandSDK,
    createPaymentTransaction,
    signAndSendTransaction,
    getClient: () => algodClient,
    getWallet: () => peraWallet,
    NETWORK
};
