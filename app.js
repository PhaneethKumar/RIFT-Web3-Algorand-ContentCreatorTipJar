// Global state
let connectedWallet = null;
let walletType = null; // 'pera', 'walletconnect', or 'mock'
let useRealAlgorand = false;

document.addEventListener('DOMContentLoaded', () => {
    checkAlgorandSDK();
    setupWalletConnection();
    checkWalletConnection();
});

function checkAlgorandSDK() {
    if (typeof algosdk !== 'undefined' && (typeof PeraWalletConnect !== 'undefined' || typeof WalletConnect !== 'undefined')) {
        useRealAlgorand = true;
        window.AlgorandSDK.initAlgorandSDK();
        console.log('✓ Using real Algorand SDK');
    } else {
        console.log('ℹ Using demo mode');
    }
}

// Setup wallet connection button
function setupWalletConnection() {
    const connectBtn = document.getElementById('connectWallet');
    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
    }
}

async function connectWallet() {
    if (!useRealAlgorand) {
        const mockWallet = localStorage.getItem('mockWallet') || generateMockWallet();
        localStorage.setItem('mockWallet', mockWallet);
        connectedWallet = mockWallet;
        walletType = 'mock';
        updateWalletUI();
        showMessage('Wallet connected (demo mode)', 'success');
        return;
    }
    
    // Show wallet selection modal
    const choice = await showWalletModal();
    
    try {
        if (choice === 'pera') {
            connectedWallet = await window.AlgorandSDK.connectPeraWallet();
            walletType = 'pera';
            
            const peraWallet = window.AlgorandSDK.getPeraWallet();
            peraWallet.connector?.on('disconnect', () => {
                connectedWallet = null;
                walletType = null;
                updateWalletUI();
            });
        } else if (choice === 'walletconnect') {
            connectedWallet = await window.AlgorandSDK.connectWalletConnect();
            walletType = 'walletconnect';
            
            const wc = window.AlgorandSDK.getWalletConnect();
            wc.on('disconnect', () => {
                connectedWallet = null;
                walletType = null;
                updateWalletUI();
            });
        }
        
        localStorage.setItem('walletType', walletType);
        localStorage.setItem('connectedWallet', connectedWallet);
        updateWalletUI();
        showMessage('Wallet connected!', 'success');
    } catch (error) {
        console.error('Connection error:', error);
        showMessage('Failed to connect wallet', 'error');
    }
}

function showWalletModal() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000';
        modal.innerHTML = `
            <div style="background:white;padding:2rem;border-radius:12px;max-width:400px;text-align:center">
                <h3 style="margin-bottom:1rem">Connect Wallet</h3>
                <button id="peraBtn" style="width:100%;padding:1rem;margin:0.5rem 0;border:2px solid #667eea;border-radius:8px;background:white;cursor:pointer;font-size:1rem">
                    🔷 Pera Wallet
                </button>
                <button id="wcBtn" style="width:100%;padding:1rem;margin:0.5rem 0;border:2px solid #667eea;border-radius:8px;background:white;cursor:pointer;font-size:1rem">
                    🔗 WalletConnect
                </button>
                <button id="cancelBtn" style="width:100%;padding:0.5rem;margin-top:1rem;border:none;background:transparent;cursor:pointer;color:#666">Cancel</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('#peraBtn').onclick = () => { document.body.removeChild(modal); resolve('pera'); };
        modal.querySelector('#wcBtn').onclick = () => { document.body.removeChild(modal); resolve('walletconnect'); };
        modal.querySelector('#cancelBtn').onclick = () => { document.body.removeChild(modal); resolve(null); };
    });
}

// Generate mock wallet address for demo
function generateMockWallet() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let address = '';
    for (let i = 0; i < 58; i++) {
        address += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return address;
}

function checkWalletConnection() {
    const savedWallet = localStorage.getItem('connectedWallet');
    const savedType = localStorage.getItem('walletType');
    if (savedWallet && savedType) {
        connectedWallet = savedWallet;
        walletType = savedType;
        updateWalletUI();
    }
}

// Update wallet UI
function updateWalletUI() {
    const connectBtn = document.getElementById('connectWallet');
    if (connectBtn && connectedWallet) {
        connectBtn.textContent = `${connectedWallet.substring(0, 6)}...${connectedWallet.substring(connectedWallet.length - 4)}`;
        connectBtn.style.background = '#28a745';
    }
}

async function sendTip(recipientAddress, amount) {
    if (!connectedWallet) {
        showMessage('Please connect your wallet first', 'error');
        return false;
    }
    
    try {
        if (useRealAlgorand && walletType !== 'mock') {
            const txn = await window.AlgorandSDK.createPaymentTransaction(
                connectedWallet,
                recipientAddress,
                amount,
                'Tip from Creator Tip Jar'
            );
            
            const txId = await window.AlgorandSDK.signAndSendTransaction(txn, walletType);
            
            const transaction = {
                from: connectedWallet,
                to: recipientAddress,
                amount: amount * 1000000,
                timestamp: Date.now(),
                txId
            };
            
            storeTip(transaction);
            return transaction;
        } else {
            const txn = {
                from: connectedWallet,
                to: recipientAddress,
                amount: amount * 1000000,
                timestamp: Date.now(),
                txId: generateTxId()
            };
            
            storeTip(txn);
            return txn;
        }
    } catch (error) {
        console.error('Transaction error:', error);
        throw error;
    }
}

// Generate mock transaction ID
function generateTxId() {
    return 'TXN' + Math.random().toString(36).substring(2, 15).toUpperCase();
}

// Store tip in localStorage
function storeTip(txn) {
    const tips = JSON.parse(localStorage.getItem('tips') || '[]');
    tips.push(txn);
    localStorage.setItem('tips', JSON.stringify(tips));
}

// Get tips for a creator
function getTipsForCreator(creatorAddress) {
    const tips = JSON.parse(localStorage.getItem('tips') || '[]');
    return tips.filter(tip => tip.to === creatorAddress);
}

// Get tips sent by a wallet
function getTipsSentBy(walletAddress) {
    const tips = JSON.parse(localStorage.getItem('tips') || '[]');
    return tips.filter(tip => tip.from === walletAddress);
}

// Calculate total tips for creator
function calculateTotalTips(creatorAddress) {
    const tips = getTipsForCreator(creatorAddress);
    return tips.reduce((sum, tip) => sum + (tip.amount / 1000000), 0);
}

// Get unique supporters count
function getSupportersCount(creatorAddress) {
    const tips = getTipsForCreator(creatorAddress);
    const uniqueSupporters = new Set(tips.map(tip => tip.from));
    return uniqueSupporters.size;
}

// Get leaderboard for creator
function getLeaderboard(creatorAddress) {
    const tips = getTipsForCreator(creatorAddress);
    const supporterTotals = {};
    
    tips.forEach(tip => {
        if (!supporterTotals[tip.from]) {
            supporterTotals[tip.from] = 0;
        }
        supporterTotals[tip.from] += tip.amount / 1000000;
    });
    
    return Object.entries(supporterTotals)
        .map(([address, amount]) => ({ address, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10);
}

// Format wallet address
function formatAddress(address) {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
}

// Show message
function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('tipMessage') || 
                     document.getElementById('formMessage') || 
                     document.getElementById('message');
    
    if (messageEl) {
        messageEl.textContent = text;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

// Storage helpers
function saveCreator(creator) {
    const creators = JSON.parse(localStorage.getItem('creators') || '[]');
    const existingIndex = creators.findIndex(c => c.wallet === creator.wallet);
    
    if (existingIndex >= 0) {
        creators[existingIndex] = creator;
    } else {
        creators.push(creator);
    }
    
    localStorage.setItem('creators', JSON.stringify(creators));
}

function getCreator(walletAddress) {
    const creators = JSON.parse(localStorage.getItem('creators') || '[]');
    return creators.find(c => c.wallet === walletAddress);
}

function getAllCreators() {
    return JSON.parse(localStorage.getItem('creators') || '[]');
}

// Generate embed code
function generateEmbedCode(creatorWallet) {
    const baseUrl = window.location.origin;
    return `<iframe src="${baseUrl}/widget.html?creator=${creatorWallet}" width="320" height="400" frameborder="0" style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"></iframe>`;
}

// Export functions for use in other scripts
window.tipJar = {
    connectWallet,
    sendTip,
    getTipsForCreator,
    getTipsSentBy,
    calculateTotalTips,
    getSupportersCount,
    getLeaderboard,
    formatAddress,
    formatDate,
    showMessage,
    saveCreator,
    getCreator,
    getAllCreators,
    generateEmbedCode,
    getConnectedWallet: () => connectedWallet
};
