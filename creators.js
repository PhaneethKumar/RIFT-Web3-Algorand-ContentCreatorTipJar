// Creators listing logic
document.addEventListener('DOMContentLoaded', () => {
    loadCreators();
    setupFilters();
});

// Load and display creators
function loadCreators() {
    const creators = window.tipJar.getAllCreators();
    
    if (creators.length === 0) {
        showEmptyState();
        return;
    }
    
    displayCreators(creators);
}

// Show empty state
function showEmptyState() {
    const grid = document.getElementById('creatorsGrid');
    grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
            <h3>No Creators Yet</h3>
            <p style="margin: 1rem 0;">Be the first to create a profile!</p>
            <a href="create-profile.html" class="btn-primary">Create Profile</a>
        </div>
    `;
}

// Display creators
function displayCreators(creators) {
    const grid = document.getElementById('creatorsGrid');
    
    // Enhance creators with stats
    const creatorsWithStats = creators.map(creator => ({
        ...creator,
        totalTips: window.tipJar.calculateTotalTips(creator.wallet),
        supporterCount: window.tipJar.getSupportersCount(creator.wallet)
    }));
    
    // Apply filters
    const filtered = applyFilters(creatorsWithStats);
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">No creators found</p>';
        return;
    }
    
    grid.innerHTML = filtered.map(creator => `
        <div class="creator-card" onclick="window.location.href='profile.html?creator=${creator.wallet}'">
            <div class="creator-card-header">
                <img src="${creator.avatarUrl || 'https://via.placeholder.com/60'}" 
                     alt="${creator.name}" 
                     class="creator-card-avatar">
                <div class="creator-card-info">
                    <h3>${creator.name}</h3>
                    <span class="category-badge">${creator.category}</span>
                </div>
            </div>
            <div class="creator-card-body">
                <p>${creator.bio.substring(0, 100)}${creator.bio.length > 100 ? '...' : ''}</p>
            </div>
            <div class="creator-card-stats">
                <div class="stat">
                    <span class="stat-value">${creator.totalTips.toFixed(1)}</span>
                    <span class="stat-label">ALGO</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${creator.supporterCount}</span>
                    <span class="stat-label">Supporters</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup filters
function setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    categoryFilter.addEventListener('change', loadCreators);
    sortFilter.addEventListener('change', loadCreators);
}

// Apply filters
function applyFilters(creators) {
    const categoryFilter = document.getElementById('categoryFilter').value;
    const sortFilter = document.getElementById('sortFilter').value;
    
    let filtered = [...creators];
    
    // Apply category filter
    if (categoryFilter) {
        filtered = filtered.filter(c => c.category === categoryFilter);
    }
    
    // Apply sorting
    switch (sortFilter) {
        case 'tips':
            filtered.sort((a, b) => b.totalTips - a.totalTips);
            break;
        case 'supporters':
            filtered.sort((a, b) => b.supporterCount - a.supporterCount);
            break;
        case 'recent':
        default:
            filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
            break;
    }
    
    return filtered;
}
