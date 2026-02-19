// Profile page logic
let currentCreator = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCreatorProfile();
    setupTipButtons();
    setupEmbedCode();
});

// Load creator profile from URL parameter
function loadCreatorProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const creatorWallet = urlParams.get('creator');
    
    if (!creatorWallet) {
        // Load first creator as demo
        const creators = window.tipJar.getAllCreators();
        if (creators.length > 0) {
            currentCreator = creators[0];
        } else {
            showDemoCreator();
            return;
        }
    } else {
        currentCreator = window.tipJar.getCreator(creatorWallet);
    }
    
    if (currentCreator) {
        displayCreatorProfile(currentCreator);
        loadTipHistory();
        loadLeaderboard();
    }
}

// Show demo creator if none exists
function showDemoCreator() {
    currentCreator = {
        name: 'Demo Artist',
        category: 'Artist',
        bio: 'Digital artist creating stunning visual experiences. Support my work with a tip!',
        wallet: window.tipJar.getConnectedWallet() || 'DEMO' + Math.random().toString(36).substring(2, 15).toUpperCase(),
        avatarUrl: 'https://via.placeholder.com/150',
        portfolio: [
            'https://via.placeholder.com/400x400/667eea/ffffff?text=Art+1',
            'https://via.placeholder.com/400x400/764ba2/ffffff?text=Art+2',
            'https://via.placeholder.com/400x400/f093fb/ffffff?text=Art+3',
            'https://via.placeholder.com/400x400/4facfe/ffffff?text=Art+4'
        ]
    };
    displayCreatorProfile(currentCreator);
}

// Display creator profile
function displayCreatorProfile(creator) {
    document.getElementById('creatorName').textContent = creator.name;
    document.getElementById('creatorCategory').textContent = creator.category;
    document.getElementById('creatorBio').textContent = creator.bio;
    
    if (creator.avatarUrl) {
        document.getElementById('creatorAvatar').src = creator.avatarUrl;
    }
    
    // Update stats
    const totalTips = window.tipJar.calculateTotalTips(creator.wallet);
    const supporterCount = window.tipJar.getSupportersCount(creator.wallet);
    
    document.getElementById('totalTips').textContent = totalTips.toFixed(2);
    document.getElementById('supporterCount').textContent = supporterCount;
    
    // Load portfolio
    displayPortfolio(creator.portfolio || []);
}

// Display portfolio
function displayPortfolio(portfolio) {
    const grid = document.getElementById('portfolioGrid');
    grid.innerHTML = '';
    
    if (portfolio.length === 0) {
        grid.innerHTML = '<p>No portfolio items yet</p>';
        return;
    }
    
    portfolio.forEach(url => {
        const item = document.createElement('div');
        item.className = 'portfolio-item';
        item.innerHTML = `<img src="${url}" alt="Portfolio item">`;
        grid.appendChild(item);
    });
}

// Setup tip buttons
function setupTipButtons() {
    // Preset amount buttons
    document.querySelectorAll('.tip-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const amount = parseFloat(btn.dataset.amount);
            await processTip(amount);
        });
    });
    
    // Custom amount button
    const customBtn = document.getElementById('sendCustomTip');
    if (customBtn) {
        customBtn.addEventListener('click', async () => {
            const amount = parseFloat(document.getElementById('customAmount').value);
            if (amount && amount > 0) {
                await processTip(amount);
            } else {
                window.tipJar.showMessage('Please enter a valid amount', 'error');
            }
        });
    }
}

// Process tip transaction
async function processTip(amount) {
    if (!currentCreator) {
        window.tipJar.showMessage('Creator not found', 'error');
        return;
    }
    
    const connectedWallet = window.tipJar.getConnectedWallet();
    if (!connectedWallet) {
        window.tipJar.showMessage('Please connect your wallet first', 'error');
        return;
    }
    
    try {
        window.tipJar.showMessage(`Sending ${amount} ALGO...`, 'info');
        
        const txn = await window.tipJar.sendTip(currentCreator.wallet, amount);
        
        window.tipJar.showMessage(`✓ Successfully sent ${amount} ALGO!`, 'success');
        
        // Refresh displays
        setTimeout(() => {
            loadCreatorProfile();
            loadTipHistory();
            loadLeaderboard();
        }, 1000);
        
        // Clear custom amount
        const customInput = document.getElementById('customAmount');
        if (customInput) customInput.value = '';
        
    } catch (error) {
        console.error('Tip error:', error);
        window.tipJar.showMessage('Failed to send tip', 'error');
    }
}

// Load tip history
function loadTipHistory() {
    if (!currentCreator) return;
    
    const tips = window.tipJar.getTipsForCreator(currentCreator.wallet);
    const historyEl = document.getElementById('tipHistory');
    
    if (tips.length === 0) {
        historyEl.innerHTML = '<p style="text-align: center; color: #999;">No tips yet</p>';
        return;
    }
    
    historyEl.innerHTML = tips
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 10)
        .map(tip => `
            <div class="tip-item">
                <div>
                    <div class="tip-from">${window.tipJar.formatAddress(tip.from)}</div>
                    <div class="tip-time">${window.tipJar.formatDate(tip.timestamp)}</div>
                </div>
                <div class="tip-amount">${(tip.amount / 1000000).toFixed(2)} ALGO</div>
            </div>
        `).join('');
}

// Load leaderboard
function loadLeaderboard() {
    if (!currentCreator) return;
    
    const leaderboard = window.tipJar.getLeaderboard(currentCreator.wallet);
    const leaderboardEl = document.getElementById('leaderboard');
    
    if (leaderboard.length === 0) {
        leaderboardEl.innerHTML = '<p style="text-align: center; color: #999;">No supporters yet</p>';
        return;
    }
    
    leaderboardEl.innerHTML = leaderboard.map((entry, index) => `
        <div class="leaderboard-item">
            <div>
                <span class="leaderboard-rank">#${index + 1}</span>
                <span class="leaderboard-address">${window.tipJar.formatAddress(entry.address)}</span>
            </div>
            <span class="leaderboard-amount">${entry.amount.toFixed(2)} ALGO</span>
        </div>
    `).join('');
}

// Setup embed code
function setupEmbedCode() {
    if (!currentCreator) return;
    
    const embedCode = window.tipJar.generateEmbedCode(currentCreator.wallet);
    const embedTextarea = document.getElementById('embedCode');
    
    if (embedTextarea) {
        embedTextarea.value = embedCode;
    }
    
    const copyBtn = document.getElementById('copyEmbed');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            embedTextarea.select();
            document.execCommand('copy');
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Code';
            }, 2000);
        });
    }
}
