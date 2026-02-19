// Dashboard logic
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    setupEmbedCopy();
});

// Load dashboard data
function loadDashboard() {
    const connectedWallet = window.tipJar.getConnectedWallet();
    
    if (!connectedWallet) {
        showNoProfile();
        return;
    }
    
    const creator = window.tipJar.getCreator(connectedWallet);
    
    if (!creator) {
        showNoProfile();
        return;
    }
    
    displayDashboard(creator);
}

// Show no profile message
function showNoProfile() {
    document.getElementById('dashboardContent').style.display = 'none';
    document.getElementById('noProfile').style.display = 'block';
}

// Display dashboard
function displayDashboard(creator) {
    document.getElementById('dashboardContent').style.display = 'block';
    document.getElementById('noProfile').style.display = 'none';
    
    // Profile info
    document.getElementById('dashName').textContent = creator.name;
    document.getElementById('dashCategory').textContent = creator.category;
    document.getElementById('dashWallet').textContent = creator.wallet;
    
    // Set profile link
    const viewProfileLink = document.getElementById('viewProfile');
    viewProfileLink.href = `profile.html?creator=${creator.wallet}`;
    
    // Calculate stats
    const tips = window.tipJar.getTipsForCreator(creator.wallet);
    const totalTips = window.tipJar.calculateTotalTips(creator.wallet);
    const supporterCount = window.tipJar.getSupportersCount(creator.wallet);
    const avgTip = tips.length > 0 ? totalTips / tips.length : 0;
    
    // Calculate this month's tips
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthTips = tips
        .filter(tip => tip.timestamp >= monthStart.getTime())
        .reduce((sum, tip) => sum + (tip.amount / 1000000), 0);
    
    // Update stats
    document.getElementById('dashTotalTips').textContent = `${totalTips.toFixed(2)} ALGO`;
    document.getElementById('dashSupporters').textContent = supporterCount;
    document.getElementById('dashAvgTip').textContent = `${avgTip.toFixed(2)} ALGO`;
    document.getElementById('dashMonthTips').textContent = `${monthTips.toFixed(2)} ALGO`;
    
    // Load tip history
    loadDashTipHistory(tips);
    
    // Load leaderboard
    loadDashLeaderboard(creator.wallet);
    
    // Setup embed code
    const embedCode = window.tipJar.generateEmbedCode(creator.wallet);
    document.getElementById('dashEmbedCode').value = embedCode;
}

// Load tip history for dashboard
function loadDashTipHistory(tips) {
    const historyEl = document.getElementById('dashTipHistory');
    
    if (tips.length === 0) {
        historyEl.innerHTML = '<p style="text-align: center; color: #999;">No tips received yet</p>';
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

// Load leaderboard for dashboard
function loadDashLeaderboard(creatorWallet) {
    const leaderboard = window.tipJar.getLeaderboard(creatorWallet);
    const leaderboardEl = document.getElementById('dashLeaderboard');
    
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

// Setup embed code copy
function setupEmbedCopy() {
    const copyBtn = document.getElementById('copyDashEmbed');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const textarea = document.getElementById('dashEmbedCode');
            textarea.select();
            document.execCommand('copy');
            copyBtn.textContent = '✓ Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Code';
            }, 2000);
        });
    }
}
