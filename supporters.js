// Supporters listing logic
document.addEventListener("DOMContentLoaded", () => {
  loadSupporters();
  setupFilters();
});

// Load and display supporters
function loadSupporters() {
  const supporters = window.tipJar.getAllTippers();

  if (supporters.length === 0) {
    showEmptyState();
    return;
  }

  displaySupporters(supporters);
}

// Show empty state
function showEmptyState() {
  const grid = document.getElementById("supportersGrid");
  grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
            <h3>No Supporters Yet</h3>
            <p style="margin: 1rem 0;">Be the first to become a supporter!</p>
            <a href="create-tipper-profile.html" class="btn-primary">Create Profile</a>
        </div>
    `;
}

// Display supporters
function displaySupporters(supporters) {
  const grid = document.getElementById("supportersGrid");

  // Enhance supporters with stats
  const supportersWithStats = supporters.map((supporter) => {
    const tipsSent = window.tipJar.getTipsSentBy(supporter.wallet);
    const totalTips = tipsSent.reduce(
      (sum, tip) => sum + tip.amount / 1000000,
      0,
    );
    const creatorsSupported = new Set(tipsSent.map((tip) => tip.to)).size;

    return {
      ...supporter,
      totalTips,
      creatorsSupported,
    };
  });

  // Apply filters
  const filtered = applyFilters(supportersWithStats);

  if (filtered.length === 0) {
    grid.innerHTML =
      '<p style="grid-column: 1/-1; text-align: center; color: #999;">No supporters found</p>';
    return;
  }

  grid.innerHTML = filtered
    .map(
      (supporter) => `
        <div class="creator-card" onclick="window.location.href='supporter-profile.html?supporter=${supporter.wallet}'">
            <div class="creator-card-header">
                <img src="${supporter.avatarUrl && supporter.avatarUrl.startsWith("data:image") ? supporter.avatarUrl : "https://via.placeholder.com/60"}" 
                     alt="${supporter.displayName}" 
                     class="creator-card-avatar">
                <div class="creator-card-info">
                    <h3>${supporter.displayName}</h3>
                    <span class="category-badge">Supporter</span>
                </div>
            </div>
            <div class="creator-card-body">
                <p>${supporter.bio.substring(0, 100)}${supporter.bio.length > 100 ? "..." : ""}</p>
            </div>
            <div class="creator-card-stats">
                <div class="stat">
                    <span class="stat-value">${supporter.totalTips.toFixed(1)}</span>
                    <span class="stat-label">ALGO Sent</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${supporter.creatorsSupported}</span>
                    <span class="stat-label">Creators</span>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

// Setup filters
function setupFilters() {
  const searchFilter = document.getElementById("searchFilter");
  const sortFilter = document.getElementById("sortFilter");

  searchFilter.addEventListener("input", loadSupporters);
  sortFilter.addEventListener("change", loadSupporters);
}

// Apply filters
function applyFilters(supporters) {
  const searchTerm = document
    .getElementById("searchFilter")
    .value.toLowerCase();
  const sortFilter = document.getElementById("sortFilter").value;

  let filtered = [...supporters];

  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(
      (s) =>
        s.displayName.toLowerCase().includes(searchTerm) ||
        s.bio.toLowerCase().includes(searchTerm),
    );
  }

  // Apply sorting
  switch (sortFilter) {
    case "tips":
      filtered.sort((a, b) => b.totalTips - a.totalTips);
      break;
    case "creators":
      filtered.sort((a, b) => b.creatorsSupported - a.creatorsSupported);
      break;
    case "recent":
    default:
      filtered.sort((a, b) => b.createdAt - a.createdAt);
      break;
  }

  return filtered;
}
