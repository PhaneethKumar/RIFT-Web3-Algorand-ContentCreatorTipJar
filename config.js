/**
 * Algorand Network Configuration
 * 
 * Update these settings based on your deployment environment
 */

const CONFIG = {
    // Network selection
    network: 'testnet', // 'testnet', 'mainnet', or 'betanet'
    
    // TestNet Configuration
    testnet: {
        algodToken: '',
        algodServer: 'https://testnet-api.algonode.cloud',
        algodPort: '',
        indexerServer: 'https://testnet-idx.algonode.cloud',
        indexerPort: '',
        explorerUrl: 'https://testnet.algoexplorer.io'
    },
    
    // MainNet Configuration (for production)
    mainnet: {
        algodToken: '',
        algodServer: 'https://mainnet-api.algonode.cloud',
        algodPort: '',
        indexerServer: 'https://mainnet-idx.algonode.cloud',
        indexerPort: '',
        explorerUrl: 'https://algoexplorer.io'
    },
    
    // Application Settings
    app: {
        name: 'Creator Tip Jar',
        version: '1.0.0',
        minTipAmount: 0.1, // Minimum tip in ALGO
        maxTipAmount: 1000, // Maximum tip in ALGO
        defaultTipAmounts: [1, 5, 10, 25], // Preset tip amounts
        transactionNote: 'Tip from Creator Tip Jar',
        
        // Feature flags
        features: {
            customTokens: false, // Enable custom ASA tokens
            subscriptions: false, // Enable recurring tips
            messages: false, // Enable messages with tips
            analytics: true // Enable analytics tracking
        }
    },
    
    // UI Settings
    ui: {
        theme: 'default',
        currency: 'ALGO',
        dateFormat: 'relative', // 'relative' or 'absolute'
        itemsPerPage: 10
    }
};

// Get current network configuration
function getNetworkConfig() {
    return CONFIG[CONFIG.network];
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
