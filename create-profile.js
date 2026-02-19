// Create profile logic
document.addEventListener('DOMContentLoaded', () => {
    setupForm();
    prefillWallet();
});

// Setup form submission
function setupForm() {
    const form = document.getElementById('profileForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await createProfile();
    });
}

// Prefill wallet address if connected
function prefillWallet() {
    const connectedWallet = window.tipJar.getConnectedWallet();
    
    if (connectedWallet) {
        document.getElementById('walletAddress').value = connectedWallet;
    }
    
    // Check if editing existing profile
    if (connectedWallet) {
        const existingCreator = window.tipJar.getCreator(connectedWallet);
        if (existingCreator) {
            prefillForm(existingCreator);
        }
    }
}

// Prefill form with existing data
function prefillForm(creator) {
    document.getElementById('name').value = creator.name || '';
    document.getElementById('category').value = creator.category || '';
    document.getElementById('bio').value = creator.bio || '';
    document.getElementById('avatarUrl').value = creator.avatarUrl || '';
    
    if (creator.portfolio && creator.portfolio.length > 0) {
        document.getElementById('portfolioUrls').value = creator.portfolio.join('\n');
    }
}

// Create or update profile
async function createProfile() {
    const connectedWallet = window.tipJar.getConnectedWallet();
    
    if (!connectedWallet) {
        window.tipJar.showMessage('Please connect your wallet first', 'error');
        return;
    }
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const category = document.getElementById('category').value;
    const bio = document.getElementById('bio').value.trim();
    const avatarUrl = document.getElementById('avatarUrl').value.trim();
    const portfolioText = document.getElementById('portfolioUrls').value.trim();
    
    // Validate
    if (!name || !category || !bio) {
        window.tipJar.showMessage('Please fill in all required fields', 'error');
        return;
    }
    
    // Parse portfolio URLs
    const portfolio = portfolioText
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);
    
    // Create creator object
    const creator = {
        name,
        category,
        bio,
        avatarUrl: avatarUrl || 'https://via.placeholder.com/150',
        portfolio,
        wallet: connectedWallet,
        createdAt: Date.now()
    };
    
    try {
        // Save creator
        window.tipJar.saveCreator(creator);
        
        window.tipJar.showMessage('Profile created successfully!', 'success');
        
        // Redirect to profile page after 2 seconds
        setTimeout(() => {
            window.location.href = `profile.html?creator=${connectedWallet}`;
        }, 2000);
        
    } catch (error) {
        console.error('Profile creation error:', error);
        window.tipJar.showMessage('Failed to create profile', 'error');
    }
}
