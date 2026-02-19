// Create profile logic
let selectedAvatarBase64 = null;
let selectedPortfolioBase64 = [];

document.addEventListener("DOMContentLoaded", () => {
  setupForm();
  setupAvatarUpload();
  setupPortfolioUpload();
  // Delay prefillWallet slightly to ensure app.js has initialized wallet connection
  setTimeout(prefillWallet, 100);
});

// Setup form submission
function setupForm() {
  const form = document.getElementById("profileForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await createProfile();
  });
}

// Setup avatar file upload
function setupAvatarUpload() {
  const avatarInput = document.getElementById("avatarFile");

  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) {
      selectedAvatarBase64 = null;
      document.getElementById("avatarPreview").style.display = "none";
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      window.tipJar.showMessage("File size must be less than 5MB", "error");
      avatarInput.value = "";
      return;
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      window.tipJar.showMessage(
        "Please upload a valid image file (JPG, PNG, GIF, or WebP)",
        "error",
      );
      avatarInput.value = "";
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      selectedAvatarBase64 = event.target.result;

      // Show preview
      const previewImg = document.getElementById("previewImage");
      previewImg.src = selectedAvatarBase64;
      document.getElementById("avatarPreview").style.display = "block";
    };
    reader.onerror = () => {
      window.tipJar.showMessage("Failed to read file", "error");
      avatarInput.value = "";
    };
    reader.readAsDataURL(file);
  });
}

// Setup portfolio file uploads
function setupPortfolioUpload() {
  const portfolioInput = document.getElementById("portfolioFiles");
  const clearBtn = document.getElementById("clearPortfolio");

  portfolioInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      selectedPortfolioBase64 = [];
      document.getElementById("portfolioPreview").style.display = "none";
      return;
    }

    // Validate number of files
    if (files.length > 10) {
      window.tipJar.showMessage("Maximum 10 portfolio items allowed", "error");
      portfolioInput.value = "";
      return;
    }

    // Validate and convert files
    selectedPortfolioBase64 = [];
    let validFiles = 0;

    files.forEach((file, index) => {
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        window.tipJar.showMessage(
          `File "${file.name}" exceeds 5MB limit`,
          "error",
        );
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(file.type)) {
        window.tipJar.showMessage(
          `File "${file.name}" is not a valid image format`,
          "error",
        );
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        selectedPortfolioBase64.push(event.target.result);
        validFiles++;

        // Update preview when all files are loaded
        if (validFiles === files.length) {
          displayPortfolioPreview();
        }
      };
      reader.onerror = () => {
        window.tipJar.showMessage(
          `Failed to read file "${file.name}"`,
          "error",
        );
      };
      reader.readAsDataURL(file);
    });
  });

  clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    portfolioInput.value = "";
    selectedPortfolioBase64 = [];
    document.getElementById("portfolioPreview").style.display = "none";
  });
}

// Display portfolio preview grid
function displayPortfolioPreview() {
  const previewContainer = document.getElementById("portfolioPreview");
  const grid = document.getElementById("portfolioGrid");

  grid.innerHTML = "";
  selectedPortfolioBase64.forEach((imageData, index) => {
    const item = document.createElement("div");
    item.style.cssText =
      "position: relative; border-radius: 8px; overflow: hidden;";
    item.innerHTML = `
      <img src="${imageData}" style="width: 100%; height: 120px; object-fit: cover;" alt="Portfolio item ${index + 1}">
      <button type="button" class="btn-remove-portfolio" data-index="${index}" style="position: absolute; top: 4px; right: 4px; background: rgba(255,0,0,0.8); color: white; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; font-size: 14px; padding: 0;">×</button>
    `;
    grid.appendChild(item);
  });

  previewContainer.style.display = "block";

  // Setup remove buttons
  document.querySelectorAll(".btn-remove-portfolio").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const index = parseInt(btn.getAttribute("data-index"));
      selectedPortfolioBase64.splice(index, 1);
      document.getElementById("portfolioFiles").value = "";
      if (selectedPortfolioBase64.length === 0) {
        document.getElementById("portfolioPreview").style.display = "none";
      } else {
        displayPortfolioPreview();
      }
    });
  });
}

function prefillWallet() {
  const connectedWallet = window.tipJar.getConnectedWallet();

  if (connectedWallet) {
    document.getElementById("walletAddress").value = connectedWallet;
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
  document.getElementById("name").value = creator.name || "";
  document.getElementById("category").value = creator.category || "";
  document.getElementById("bio").value = creator.bio || "";

  // Load existing avatar if it's a base64 image
  if (creator.avatarUrl && creator.avatarUrl.startsWith("data:image")) {
    selectedAvatarBase64 = creator.avatarUrl;
    const previewImg = document.getElementById("previewImage");
    previewImg.src = selectedAvatarBase64;
    document.getElementById("avatarPreview").style.display = "block";
  }

  // Load existing portfolio if it contains base64 images
  if (creator.portfolio && creator.portfolio.length > 0) {
    const portfolio = creator.portfolio;
    // Check if portfolio items are base64 images
    if (portfolio[0] && portfolio[0].startsWith("data:image")) {
      selectedPortfolioBase64 = portfolio;
      displayPortfolioPreview();
    }
  }
}

// Create or update profile
async function createProfile() {
  const connectedWallet = window.tipJar.getConnectedWallet();

  if (!connectedWallet) {
    window.tipJar.showMessage("Please connect your wallet first", "error");
    return;
  }

  // Get form data
  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value;
  const bio = document.getElementById("bio").value.trim();

  // Validate
  if (!name || !category || !bio) {
    window.tipJar.showMessage("Please fill in all required fields", "error");
    return;
  }

  // Validate avatar
  if (!selectedAvatarBase64) {
    window.tipJar.showMessage("Please upload a profile picture", "error");
    return;
  }

  // Validate portfolio
  if (selectedPortfolioBase64.length === 0) {
    window.tipJar.showMessage(
      "Please upload at least one portfolio item",
      "error",
    );
    return;
  }

  const portfolio = selectedPortfolioBase64;

  // Create creator object
  const creator = {
    name,
    category,
    bio,
    avatarUrl: selectedAvatarBase64,
    portfolio,
    wallet: connectedWallet,
    createdAt: Date.now(),
  };

  try {
    // Save creator
    window.tipJar.saveCreator(creator);

    window.tipJar.showMessage("Profile created successfully!", "success");

    // Redirect to profile page after 2 seconds
    setTimeout(() => {
      window.location.href = `profile.html?creator=${connectedWallet}`;
    }, 2000);
  } catch (error) {
    console.error("Profile creation error:", error);
    window.tipJar.showMessage("Failed to create profile", "error");
  }
}
