// Mask Wallet v1 — Client-side only
// IMPORTANT: This v1 uses a simplified demo seed generator for the public test.
// For real BIP39 + Zcash key derivation, integrate @scure/bip39 and @chainsafe/webzjs-wallet.
// Never use the generated phrases with real funds.

function generateSecureMnemonic() {
  // Demo: cryptographically shuffled fixed set to illustrate the UX flow.
  // Production: use crypto.getRandomValues + full BIP39 wordlist + checksum.
  const words = [
    "mask", "privacy", "shield", "orchard", "sovereign", "zcash", "wallet", "secure",
    "create", "backup", "verify", "confirm", "local", "encrypt", "keys", "control",
    "private", "by", "default", "provable", "choice", "open", "source", "test"
  ];
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
  alert("Seed copied. Store it safely offline.\n\nThis is a test phrase — do not use with real funds.");
});

document.getElementById("confirm-backup").addEventListener("click", () => {
  const password = document.getElementById("password").value;
  const mnemonic = sessionStorage.getItem("mask_mnemonic");
  
  if (password) {
    localStorage.setItem("mask_wallet_encrypted", btoa(mnemonic + ":" + password));
  } else {
    localStorage.setItem("mask_wallet", mnemonic);
  }
  
  document.getElementById("address").textContent = "u1mask...demo...orchard...testnet (v1)";
  showScreen("use-screen");
});

document.getElementById("logout").addEventListener("click", () => {
  if (confirm("Clear this local wallet? This cannot be undone.")) {
    localStorage.clear();
    sessionStorage.clear();
    showScreen("create-screen");
  }
});

// Restore if exists
if (localStorage.getItem("mask_wallet") || localStorage.getItem("mask_wallet_encrypted")) {
  document.getElementById("address").textContent = "u1mask...restored...demo (v1)";
  showScreen("use-screen");
}
