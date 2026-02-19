// Supporter profile page logic
let currentSupporter = null;

document.addEventListener("DOMContentLoaded", () => {
  loadSupporterProfile();
});

// Load supporter profile from URL parameter
function loadSupporterProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const supporterWallet = urlParams.get("supporter");

  if (!supporterWallet) {
    // Load first supporter as demo
    const supporters = window.tipJar.getAllTippers();
    if (supporters.length > 0) {
      currentSupporter = supporters[0];
    } else {
      showDemoSupporter();
      return;
    }
  } else {
    currentSupporter = window.tipJar.getTipper(supporterWallet);
  }

  if (currentSupporter) {
    displaySupporterProfile(currentSupporter);
    loadCreatorsSupported();
    loadTipHistory();
  }
}

// Show demo supporter if none exists
function showDemoSupporter() {
  currentSupporter = {
    displayName: "Demo Supporter",
    bio: "Passionate supporter of creative talent. I love discovering and backing amazing artists!",
    wallet:
      window.tipJar.getConnectedWallet() ||
      "DEMO" + Math.random().toString(36).substring(2, 15).toUpperCase(),
    avatarUrl: "https://via.placeholder.com/150",
    socialMedia: null,
    createdAt: Date.now(),
  };
  displaySupporterProfile(currentSupporter);
}

// Display supporter profile
function displaySupporterProfile(supporter) {
  document.getElementById("supporterName").textContent = supporter.displayName;
  document.getElementById("supporterBio").textContent = supporter.bio;

  if (supporter.avatarUrl && supporter.avatarUrl.startsWith("data:image")) {
    document.getElementById("supporterAvatar").src = supporter.avatarUrl;
  }

  // Display social media link if available
  if (supporter.socialMedia) {
    document.getElementById("socialMediaSection").style.display = "block";
    document.getElementById("socialMediaLink").href = supporter.socialMedia;
    document.getElementById("socialMediaLink").textContent =
      "Visit " + new URL(supporter.socialMedia).hostname;
  }

  // Calculate stats
  const tipsSent = window.tipJar.getTipsSentBy(supporter.wallet);
  const totalTips = tipsSent.reduce(
    (sum, tip) => sum + tip.amount / 1000000,
    0,
  );
  const creatorsSupported = new Set(tipsSent.map((tip) => tip.to)).size;
  const avgTip = tipsSent.length > 0 ? totalTips / tipsSent.length : 0;

  document.getElementById("totalTipsSent").textContent = totalTips.toFixed(2);
  document.getElementById("creatorsCount").textContent = creatorsSupported;
  document.getElementById("averageTip").textContent = avgTip.toFixed(2);
}

// Load created supporters list
function loadCreatorsSupported() {
  const container = document.getElementById("creatorsSupported");

  if (!currentSupporter) {
    container.innerHTML = "<p>No creators found</p>";
    return;
  }

  const tipsSent = window.tipJar.getTipsSentBy(currentSupporter.wallet);
  const creatorWallets = new Set(tipsSent.map((tip) => tip.to));
  const allCreators = window.tipJar.getAllCreators();

  const supportedCreators = allCreators.filter((creator) =>
    creatorWallets.has(creator.wallet),
  );

  if (supportedCreators.length === 0) {
    container.innerHTML = "<p>No creators supported yet</p>";
    return;
  }

  container.innerHTML = supportedCreators
    .map((creator) => {
      const creatorTips = tipsSent.filter((tip) => tip.to === creator.wallet);
      const totalSent = creatorTips.reduce(
        (sum, tip) => sum + tip.amount / 1000000,
        0,
      );

      return `
      <div class="portfolio-item" style="cursor: pointer; position: relative; overflow: hidden;" onclick="window.location.href='profile.html?creator=${creator.wallet}'">
        <img src="${creator.avatarUrl || "https://via.placeholder.com/400"}" alt="${creator.name}" style="height: 100%; object-fit: cover;">
        <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); padding: 1rem; color: white;">
          <h4 style="margin: 0 0 0.5rem 0;">${creator.name}</h4>
          <p style="margin: 0; font-size: 0.9rem;">${creator.category}</p>
          <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; opacity: 0.9;">Sent: ${totalSent.toFixed(2)} ALGO</p>
        </div>
      </div>
    `;
    })
    .join("");
}

// Load tip history
function loadTipHistory() {
  const container = document.getElementById("tipHistory");

  if (!currentSupporter) {
    container.innerHTML = "<p>No tips found</p>";
    return;
  }

  const tipsSent = window.tipJar.getTipsSentBy(currentSupporter.wallet);

  if (tipsSent.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #999;">No tips sent yet</p>';
    return;
  }

  // Sort by most recent and get top 10
  const recentTips = tipsSent
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  const allCreators = window.tipJar.getAllCreators();

  container.innerHTML = recentTips
    .map((tip) => {
      const creator = allCreators.find((c) => c.wallet === tip.to);
      const creatorName = creator
        ? creator.name
        : window.tipJar.formatAddress(tip.to);

      return `
      <div class="tip-item">
        <div>
          <div class="tip-from">To: ${creatorName}</div>
          <div class="tip-time">${window.tipJar.formatDate(tip.timestamp)}</div>
        </div>
        <div class="tip-amount">${(tip.amount / 1000000).toFixed(2)} ALGO</div>
      </div>
    `;
    })
    .join("");
}
