// Tipper profile creation logic
let selectedAvatarBase64 = null;

document.addEventListener("DOMContentLoaded", () => {
  setupForm();
  setupAvatarUpload();
  // Delay prefillWallet slightly to ensure app.js has initialized wallet connection
  setTimeout(prefillWallet, 100);
});

// Setup form submission
function setupForm() {
  const form = document.getElementById("tipperProfileForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    await createTipperProfile();
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

function prefillWallet() {
  const connectedWallet = window.tipJar.getConnectedWallet();

  if (connectedWallet) {
    document.getElementById("walletAddress").value = connectedWallet;
  }

  // Check if editing existing tipper profile
  if (connectedWallet) {
    const existingTipper = window.tipJar.getTipper(connectedWallet);
    if (existingTipper) {
      prefillForm(existingTipper);
    }
  }
}

// Prefill form with existing data
function prefillForm(tipper) {
  document.getElementById("displayName").value = tipper.displayName || "";
  document.getElementById("bio").value = tipper.bio || "";
  document.getElementById("socialMedia").value = tipper.socialMedia || "";

  // Load existing avatar if it's a base64 image
  if (tipper.avatarUrl && tipper.avatarUrl.startsWith("data:image")) {
    selectedAvatarBase64 = tipper.avatarUrl;
    const previewImg = document.getElementById("previewImage");
    previewImg.src = selectedAvatarBase64;
    document.getElementById("avatarPreview").style.display = "block";
  }
}

// Create or update tipper profile
async function createTipperProfile() {
  const connectedWallet = window.tipJar.getConnectedWallet();

  if (!connectedWallet) {
    window.tipJar.showMessage("Please connect your wallet first", "error");
    return;
  }

  // Get form data
  const displayName = document.getElementById("displayName").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const socialMedia = document.getElementById("socialMedia").value.trim();

  // Validate
  if (!displayName || !bio) {
    window.tipJar.showMessage("Please fill in all required fields", "error");
    return;
  }

  // Create tipper object
  const tipper = {
    displayName,
    bio,
    avatarUrl: selectedAvatarBase64,
    socialMedia: socialMedia || null,
    wallet: connectedWallet,
    createdAt: Date.now(),
  };

  try {
    // Save tipper profile
    window.tipJar.saveTipper(tipper);

    window.tipJar.showMessage(
      "Supporter profile created successfully!",
      "success",
    );

    // Redirect after 2 seconds
    setTimeout(() => {
      window.location.href = `index.html`;
    }, 2000);
  } catch (error) {
    console.error("Tipper profile creation error:", error);
    window.tipJar.showMessage("Failed to create profile", "error");
  }
}
