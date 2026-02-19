// Dashboard logic
document.addEventListener("DOMContentLoaded", () => {
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

  // Check for creator profile first
  const creator = window.tipJar.getCreator(connectedWallet);
  if (creator) {
    displayCreatorDashboard(creator);
    return;
  }

  // Check for supporter profile
  const supporter = window.tipJar.getTipper(connectedWallet);
  if (supporter) {
    displaySupporterDashboard(supporter);
    return;
  }

  // No profile found
  showNoProfile();
}

// Show no profile message
function showNoProfile() {
  document.getElementById("creatorDashboard").style.display = "none";
  document.getElementById("supporterDashboard").style.display = "none";
  document.getElementById("noProfile").style.display = "block";
  document.getElementById("dashboardTitle").textContent = "Dashboard";
}

// Display creator dashboard
function displayCreatorDashboard(creator) {
  document.getElementById("creatorDashboard").style.display = "block";
  document.getElementById("supporterDashboard").style.display = "none";
  document.getElementById("noProfile").style.display = "none";
  document.getElementById("dashboardTitle").textContent = "Creator Dashboard";

  // Profile info
  document.getElementById("dashName").textContent = creator.name;
  document.getElementById("dashCategory").textContent = creator.category;
  document.getElementById("dashWallet").textContent = creator.wallet;

  // Set profile link
  const viewProfileLink = document.getElementById("viewProfile");
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
    .filter((tip) => tip.timestamp >= monthStart.getTime())
    .reduce((sum, tip) => sum + tip.amount / 1000000, 0);

  // Update stats
  document.getElementById("dashTotalTips").textContent =
    `${totalTips.toFixed(2)} ALGO`;
  document.getElementById("dashSupporters").textContent = supporterCount;
  document.getElementById("dashAvgTip").textContent =
    `${avgTip.toFixed(2)} ALGO`;
  document.getElementById("dashMonthTips").textContent =
    `${monthTips.toFixed(2)} ALGO`;

  // Load tip history
  loadDashTipHistory(tips);

  // Load leaderboard
  loadDashLeaderboard(creator.wallet);

  // Setup embed code
  const embedCode = window.tipJar.generateEmbedCode(creator.wallet);
  document.getElementById("dashEmbedCode").value = embedCode;
}

// Display supporter dashboard
function displaySupporterDashboard(supporter) {
  document.getElementById("creatorDashboard").style.display = "none";
  document.getElementById("supporterDashboard").style.display = "block";
  document.getElementById("noProfile").style.display = "none";
  document.getElementById("dashboardTitle").textContent = "Supporter Dashboard";

  // Profile info
  document.getElementById("suppDisplayName").textContent =
    supporter.displayName;
  document.getElementById("suppBio").textContent = supporter.bio;
  document.getElementById("suppWallet").textContent = supporter.wallet;

  // Social media link
  if (supporter.socialMedia) {
    document.getElementById("suppSocialLink").style.display = "block";
    document.getElementById("suppSocialUrl").href = supporter.socialMedia;
    document.getElementById("suppSocialUrl").textContent =
      supporter.socialMedia;
  } else {
    document.getElementById("suppSocialLink").style.display = "none";
  }

  // Display avatar if exists
  const profileImageDiv = document.getElementById("suppProfileImage");
  if (supporter.avatarUrl && supporter.avatarUrl.startsWith("data:image")) {
    profileImageDiv.innerHTML = `<img src="${supporter.avatarUrl}" style="width: 150px; height: 150px; border-radius: 8px; object-fit: cover;">`;
  } else {
    profileImageDiv.innerHTML = "";
  }

  // Calculate stats
  const tipsSent = window.tipJar.getTipsSentBy(supporter.wallet);
  const totalTips = tipsSent.reduce(
    (sum, tip) => sum + tip.amount / 1000000,
    0,
  );

  // Get unique creators supported
  const creatorsSupported = new Set(tipsSent.map((tip) => tip.to));
  const avgTip = tipsSent.length > 0 ? totalTips / tipsSent.length : 0;

  // Calculate this month's tips
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthTips = tipsSent
    .filter((tip) => tip.timestamp >= monthStart.getTime())
    .reduce((sum, tip) => sum + tip.amount / 1000000, 0);

  // Update stats
  document.getElementById("suppTotalTips").textContent =
    `${totalTips.toFixed(2)} ALGO`;
  document.getElementById("suppCreatorCount").textContent =
    creatorsSupported.size;
  document.getElementById("suppAvgTip").textContent =
    `${avgTip.toFixed(2)} ALGO`;
  document.getElementById("suppMonthTips").textContent =
    `${monthTips.toFixed(2)} ALGO`;

  // Load tips sent history
  loadSuppTipHistory(tipsSent);

  // Load creators supported
  loadCreatorsSupported(Array.from(creatorsSupported));
}

// Load tip history for creator dashboard
function loadDashTipHistory(tips) {
  const historyEl = document.getElementById("dashTipHistory");

  if (tips.length === 0) {
    historyEl.innerHTML =
      '<p style="text-align: center; color: #999;">No tips received yet</p>';
    return;
  }

  historyEl.innerHTML = tips
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    .map(
      (tip) => `
            <div class="tip-item">
                <div>
                    <div class="tip-from">${window.tipJar.formatAddress(tip.from)}</div>
                    <div class="tip-time">${window.tipJar.formatDate(tip.timestamp)}</div>
                </div>
                <div class="tip-amount">${(tip.amount / 1000000).toFixed(2)} ALGO</div>
            </div>
        `,
    )
    .join("");
}

// Load tips sent for supporter dashboard
function loadSuppTipHistory(tipsSent) {
  const historyEl = document.getElementById("suppTipHistory");

  if (tipsSent.length === 0) {
    historyEl.innerHTML =
      '<p style="text-align: center; color: #999;">You haven\'t sent any tips yet</p>';
    return;
  }

  historyEl.innerHTML = tipsSent
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    .map(
      (tip) => `
            <div class="tip-item">
                <div>
                    <div class="tip-from">To: ${window.tipJar.formatAddress(tip.to)}</div>
                    <div class="tip-time">${window.tipJar.formatDate(tip.timestamp)}</div>
                </div>
                <div class="tip-amount">${(tip.amount / 1000000).toFixed(2)} ALGO</div>
            </div>
        `,
    )
    .join("");
}

// Load creators supported by the supporter
function loadCreatorsSupported(creatorAddresses) {
  const container = document.getElementById("suppCreatorsSupported");
  const connectedWallet = window.tipJar.getConnectedWallet();

  if (creatorAddresses.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #999;">You haven\'t supported any creators yet</p>';
    return;
  }

  const allCreators = window.tipJar.getAllCreators();
  const supportedCreators = allCreators.filter((creator) =>
    creatorAddresses.includes(creator.wallet),
  );

  if (supportedCreators.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #999;">Creators you supported don\'t have profiles yet</p>';
    return;
  }

  container.innerHTML = supportedCreators
    .map((creator) => {
      const tipsSent = window.tipJar
        .getTipsForCreator(creator.wallet)
        .filter((tip) => tip.from === connectedWallet);
      const totalSent = tipsSent.reduce(
        (sum, tip) => sum + tip.amount / 1000000,
        0,
      );

      return `
            <div class="creator-item" style="padding: 1rem; border: 1px solid #eee; border-radius: 8px; margin-bottom: 1rem;">
                <div style="display: flex; gap: 1rem; align-items: flex-start;">
                    ${creator.avatarUrl && creator.avatarUrl.startsWith("data:image") ? `<img src="${creator.avatarUrl}" style="width: 60px; height: 60px; border-radius: 8px; object-fit: cover;">` : '<div style="width: 60px; height: 60px; background: #eee; border-radius: 8px;"></div>'}
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 0.5rem 0;">${creator.name}</h4>
                        <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.9rem;">${creator.category}</p>
                        <p style="margin: 0; color: #999; font-size: 0.85rem;">You've sent: <strong>${totalSent.toFixed(2)} ALGO</strong></p>
                    </div>
                    <a href="profile.html?creator=${creator.wallet}" class="btn-secondary" style="white-space: nowrap;">View Profile</a>
                </div>
            </div>
        `;
    })
    .join("");
}

// Load leaderboard for creator dashboard
function loadDashLeaderboard(creatorWallet) {
  const leaderboard = window.tipJar.getLeaderboard(creatorWallet);
  const leaderboardEl = document.getElementById("dashLeaderboard");

  if (leaderboard.length === 0) {
    leaderboardEl.innerHTML =
      '<p style="text-align: center; color: #999;">No supporters yet</p>';
    return;
  }

  leaderboardEl.innerHTML = leaderboard
    .map(
      (entry, index) => `
        <div class="leaderboard-item">
            <div>
                <span class="leaderboard-rank">#${index + 1}</span>
                <span class="leaderboard-address">${window.tipJar.formatAddress(entry.address)}</span>
            </div>
            <span class="leaderboard-amount">${entry.amount.toFixed(2)} ALGO</span>
        </div>
    `,
    )
    .join("");
}

// Setup embed code copy
function setupEmbedCopy() {
  const copyBtn = document.getElementById("copyDashEmbed");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const textarea = document.getElementById("dashEmbedCode");
      textarea.select();
      document.execCommand("copy");
      copyBtn.textContent = "✓ Copied!";
      setTimeout(() => {
        copyBtn.textContent = "Copy Code";
      }, 2000);
    });
  }
}
