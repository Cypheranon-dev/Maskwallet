// Mask Wallet v1 — Client-side only
// Seed generation uses Web Crypto. Full Zcash derivation pending WebZjs integration.

const WORDLIST = [
  "abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse",
  "access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act",
  // ... truncated for brevity in this demo; real version should include full BIP39 wordlist
  // For production test we generate and display a valid-looking phrase
];

function generateSecureMnemonic() {
  // In a real build, use full BIP39 (e.g. @scure/bip39) + Web Crypto entropy
  // This demo generates a cryptographically random 24-word style phrase
  const words = [
    "mask","privacy","shield","orchard","sovereign","zcash","wallet","secure",
    "create","backup","verify","confirm","local","encrypt","keys","control",
    "private","by","default","provable","choice","open","source","test"
  ];
  // Shuffle with crypto
  const arr = [...words];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join(" ");
}

function showScreen(id) {
  ["create-screen", "secure-screen", "use-screen"].forEach(s => {
    document.getElementById(s).classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

document.getElementById("create-btn").addEventListener("click", () => {
  const mnemonic = generateSecureMnemonic();
  sessionStorage.setItem("mask_mnemonic", mnemonic);
  
  const container = document.getElementById("seed-display");
  container.innerHTML = mnemonic.split(" ").map((w, i) => 
    `<div class="seed-word rounded-lg px-2 py-1.5 text-center"><span class="text-gray-500 text-xs mr-1">${i+1}</span>${w}</div>`
  ).join("");
  
  showScreen("secure-screen");
});

document.getElementById("copy-seed").addEventListener("click", () => {
  const m = sessionStorage.getItem("mask_mnemonic");
  navigator.clipboard.writeText(m);
  alert("Seed copied. Store it safely offline.");
});

document.getElementById("confirm-backup").addEventListener("click", () => {
  const password = document.getElementById("password").value;
  const mnemonic = sessionStorage.getItem("mask_mnemonic");
  
  // Simple local encryption demo (in production use proper AES-GCM + PBKDF2)
  if (password) {
    localStorage.setItem("mask_wallet_encrypted", btoa(mnemonic + ":" + password));
  } else {
    localStorage.setItem("mask_wallet", mnemonic);
  }
  
  // Demo unified address
  document.getElementById("address").textContent = "u1mask...demo...orchard...testnet";
  showScreen("use-screen");
});

document.getElementById("logout").addEventListener("click", () => {
  localStorage.clear();
  sessionStorage.clear();
  showScreen("create-screen");
});

// Restore if exists
if (localStorage.getItem("mask_wallet") || localStorage.getItem("mask_wallet_encrypted")) {
  document.getElementById("address").textContent = "u1mask...restored...demo";
  showScreen("use-screen");
}
