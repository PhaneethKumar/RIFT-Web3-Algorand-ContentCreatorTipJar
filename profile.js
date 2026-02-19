// Profile page logic
let currentProfile = null;
let profileType = null; // 'creator' or 'supporter'

document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  setupTipButtons();
  setupEmbedCode();
});

// Load profile from URL parameter
function loadProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const profileWallet = urlParams.get("creator") || urlParams.get("supporter");
  const type = urlParams.get("creator") ? "creator" : "supporter";

  if (!profileWallet) {
    // Load first creator as demo
    const creators = window.tipJar.getAllCreators();
    if (creators.length > 0) {
      currentProfile = creators[0];
      profileType = "creator";
    } else {
      showDemoCreator();
      return;
    }
  } else {
    currentProfile =
      window.tipJar.getCreator(profileWallet) ||
      window.tipJar.getTipper(profileWallet);
    profileType = type;
  }

  if (currentProfile) {
    displayProfile(currentProfile);
    loadTipHistory();
    loadLeaderboard();
    updateSelfView();
  }
}

// Show demo creator if none exists
function showDemoCreator() {
  currentProfile = {
    name: "Demo Artist",
    category: "Artist",
    bio: "Digital artist creating stunning visual experiences. Support my work with a tip!",
    wallet:
      window.tipJar.getConnectedWallet() ||
      "DEMO" + Math.random().toString(36).substring(2, 15).toUpperCase(),
    avatarUrl: "https://via.placeholder.com/150",
    portfolio: [
      "https://via.placeholder.com/400x400/667eea/ffffff?text=Art+1",
      "https://via.placeholder.com/400x400/764ba2/ffffff?text=Art+2",
      "https://via.placeholder.com/400x400/f093fb/ffffff?text=Art+3",
      "https://via.placeholder.com/400x400/4facfe/ffffff?text=Art+4",
    ],
  };
  profileType = "creator";
  displayProfile(currentProfile);
}

// Display profile (works for both creator and supporter)
function displayProfile(profile) {
  const isCreator = profileType === "creator";

  document.getElementById("creatorName").textContent =
    profile.name || profile.displayName;
  document.getElementById("creatorCategory").textContent =
    profile.category || "Supporter";
  document.getElementById("creatorBio").textContent = profile.bio;
  document.getElementById("profileType").textContent = isCreator
    ? "Creator Profile"
    : "Supporter Profile";

  // Update avatar badge
  const badge = document.getElementById("avatarBadge");
  if (badge) {
    badge.textContent = isCreator ? "Creator" : "Supporter";
    badge.classList.toggle("creator-badge", isCreator);
    badge.classList.toggle("supporter-badge", !isCreator);
  }

  if (profile.avatarUrl) {
    document.getElementById("creatorAvatar").src = profile.avatarUrl;
  }

  // Update stats
  if (isCreator) {
    const totalTips = window.tipJar.calculateTotalTips(profile.wallet);
    const supporterCount = window.tipJar.getSupportersCount(profile.wallet);
    document.getElementById("totalTips").textContent = totalTips.toFixed(2);
    document.getElementById("supporterCount").textContent = supporterCount;
    document.getElementById("totalTipsGiven").textContent = "0";
  } else {
    // For supporters, show tips they've given
    const tipsSent = window.tipJar.getTipsSentBy(profile.wallet) || [];
    const totalTipsGiven = tipsSent.reduce(
      (sum, tip) => sum + (tip.amount / 1000000 || 0),
      0,
    );
    const uniqueCreators = new Set(tipsSent.map((t) => t.address)).size;
    document.getElementById("totalTips").textContent =
      totalTipsGiven.toFixed(2);
    document.getElementById("supporterCount").textContent = uniqueCreators;
    document.getElementById("totalTipsGiven").textContent =
      totalTipsGiven.toFixed(2);
  }

  // Load portfolio
  displayPortfolio(profile.portfolio || []);
}

// Display portfolio
function displayPortfolio(portfolio) {
  const grid = document.getElementById("portfolioGrid");
  grid.innerHTML = "";

  if (portfolio.length === 0) {
    grid.innerHTML = "<p>No portfolio items yet</p>";
    return;
  }

  portfolio.forEach((url) => {
    const item = document.createElement("div");
    item.className = "portfolio-item";
    item.innerHTML = `<img src="${url}" alt="Portfolio item">`;
    grid.appendChild(item);
  });
}

// Setup tip buttons
function setupTipButtons() {
  // Preset amount buttons
  document.querySelectorAll(".tip-btn-unique").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const amount = parseFloat(btn.dataset.amount);
      await processTip(amount);
    });
  });

  // Custom amount button
  const customBtn = document.getElementById("sendCustomTip");
  if (customBtn) {
    customBtn.addEventListener("click", async () => {
      const amount = parseFloat(document.getElementById("customAmount").value);
      if (amount && amount > 0) {
        await processTip(amount);
      } else {
        window.tipJar.showMessage("Please enter a valid amount", "error");
      }
    });
  }
}

// Process tip transaction
async function processTip(amount) {
  if (!currentProfile) {
    window.tipJar.showMessage("Profile not found", "error");
    return;
  }

  const connectedWallet = window.tipJar.getConnectedWallet();
  if (!connectedWallet) {
    window.tipJar.showMessage("Please connect your wallet first", "error");
    return;
  }

  // Prevent tipping your own creator profile
  if (connectedWallet === currentProfile.wallet) {
    window.tipJar.showMessage("You cannot tip your own profile", "error");
    toggleTipButtons(false);
    return;
  }

  try {
    // Disable tip buttons to prevent double-clicks
    toggleTipButtons(true);

    const displayAmount = Number(amount).toFixed(2);
    window.tipJar.showMessage(`Sending ${displayAmount} ALGO...`, "info");

    const txn = await window.tipJar.sendTip(currentProfile.wallet, amount);

    window.tipJar.showMessage(
      `✓ Successfully sent ${displayAmount} ALGO!`,
      "success",
    );

    // Refresh displays immediately
    loadProfile();
    loadTipHistory();
    loadLeaderboard();

    // Clear custom amount
    const customInput = document.getElementById("customAmount");
    if (customInput) customInput.value = "";
  } catch (error) {
    console.error("Tip error:", error);
    window.tipJar.showMessage("Failed to send tip", "error");
  } finally {
    // Re-enable buttons after attempt
    toggleTipButtons(false);
  }
}

// Enable or disable tip buttons and inputs
function toggleTipButtons(disabled) {
  document.querySelectorAll(".tip-btn").forEach((btn) => {
    btn.disabled = disabled;
    btn.style.opacity = disabled ? "0.6" : "";
    btn.style.cursor = disabled ? "not-allowed" : "";
  });

  const customBtn = document.getElementById("sendCustomTip");
  if (customBtn) {
    customBtn.disabled = disabled;
    customBtn.style.opacity = disabled ? "0.6" : "";
    customBtn.style.cursor = disabled ? "not-allowed" : "";
  }

  const customInput = document.getElementById("customAmount");
  if (customInput) customInput.disabled = disabled;
}

// Disable tip UI when viewing own profile, or re-enable otherwise
function updateSelfView() {
  const connected = window.tipJar.getConnectedWallet();
  const tipMsg = document.getElementById("tipMessage");

  if (connected && currentProfile && connected === currentProfile.wallet) {
    toggleTipButtons(true);
    if (tipMsg) {
      tipMsg.textContent = "This is your profile — tipping is disabled.";
      tipMsg.className = "tip-message warning";
      tipMsg.style.display = "block";
    }
  } else {
    toggleTipButtons(false);
    if (tipMsg) {
      tipMsg.textContent = "";
      tipMsg.style.display = "none";
    }
  }
}

// Load tip history
function loadTipHistory() {
  if (!currentProfile) return;

  const tips = window.tipJar.getTipsForCreator(currentProfile.wallet);
  const historyEl = document.getElementById("tipHistory");

  if (tips.length === 0) {
    historyEl.innerHTML =
      '<p style="text-align: center; color: #999; padding: 1rem;">No tips yet</p>';
    return;
  }

  historyEl.innerHTML = tips
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10)
    .map(
      (tip) => `
            <div class="tip-item-unique">
                <div class="tip-item-info">
                    <div class="tip-from-unique">${window.tipJar.formatAddress(tip.from)}</div>
                    <div class="tip-time-unique">${window.tipJar.formatDate(tip.timestamp)}</div>
                </div>
                <div class="tip-amount-unique">${(tip.amount / 1000000).toFixed(2)} ALGO</div>
            </div>
        `,
    )
    .join("");
}

// Load leaderboard
function loadLeaderboard() {
  if (!currentProfile) return;

  const leaderboard = window.tipJar.getLeaderboard(currentProfile.wallet);
  const leaderboardEl = document.getElementById("leaderboard");

  if (leaderboard.length === 0) {
    leaderboardEl.innerHTML =
      '<p style="text-align: center; color: #999; padding: 1rem;">No supporters yet</p>';
    return;
  }

  leaderboardEl.innerHTML = leaderboard
    .map(
      (entry, index) => `
        <div class="leaderboard-item-unique">
            <div class="leaderboard-info">
                <span class="leaderboard-rank-unique">#${index + 1}</span>
                <span class="leaderboard-address-unique">${window.tipJar.formatAddress(entry.address)}</span>
            </div>
            <span class="leaderboard-amount-unique">${entry.amount.toFixed(2)} ALGO</span>
        </div>
    `,
    )
    .join("");
}

// Setup embed code
function setupEmbedCode() {
  if (!currentProfile) return;

  const embedCode = window.tipJar.generateEmbedCode(currentProfile.wallet);
  const embedTextarea = document.getElementById("embedCode");

  if (embedTextarea) {
    embedTextarea.value = embedCode;
  }

  const copyBtn = document.getElementById("copyEmbed");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      embedTextarea.select();
      document.execCommand("copy");
      const originalText = copyBtn.textContent;
      copyBtn.textContent = "✓ Copied!";
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    });
  }
}
