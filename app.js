// Mask Wallet v1.1 — Interactive complex version
// Real BIP39 via @scure/bip39. Full Zcash sync still requires WebZjs (next).

import * as bip39 from 'https://cdn.jsdelivr.net/npm/@scure/bip39@2.4.0/+esm';
import { wordlist } from 'https://cdn.jsdelivr.net/npm/@scure/bip39@2.4.0/wordlists/english.js/+esm';

let currentMnemonic = null;
let walletPassword = null;
let addressIndex = 0;

function generateUA(index = 0) {
  // Demo unified address style (real derivation needs zcash libs)
  const prefix = "u1mask";
  const body = Array.from(crypto.getRandomValues(new Uint8Array(20)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  return `${prefix}${body.slice(0, 40)}test${index}`;
}

async function encryptSeed(seed, password) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('mask-salt'), iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(seed));
  return { iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) };
}

function show(id) {
  ['onboard','seed-screen','password-screen','wallet'].forEach(s => document.getElementById(s).classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function renderSeed(mnemonic) {
  const words = mnemonic.split(' ');
  document.getElementById('seed-words').innerHTML = words.map((w, i) =>
    `<div class="seed-word rounded px-1.5 py-1 text-center"><span class="text-gray-500 text-[10px]">${i+1}</span><br>${w}</div>`
  ).join('');
}

// Create
document.getElementById('create-new').onclick = async () => {
  currentMnemonic = bip39.generateMnemonic(wordlist, 256); // 24 words
  if (!bip39.validateMnemonic(currentMnemonic, wordlist)) {
    alert('Generation failed, try again');
    return;
  }
  renderSeed(currentMnemonic);
  show('seed-screen');
};

// Restore
document.getElementById('restore').onclick = () => {
  const phrase = prompt('Paste your 24-word seed phrase:');
  if (!phrase) return;
  const cleaned = phrase.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!bip39.validateMnemonic(cleaned, wordlist)) {
    alert('Invalid seed phrase');
    return;
  }
  currentMnemonic = cleaned;
  show('password-screen');
};

// Verify flow
let verifyStep = 0;
let verifyPositions = [];
document.getElementById('start-verify').onclick = () => {
  const words = currentMnemonic.split(' ');
  verifyPositions = [3, 12, 21].map(i => ({ pos: i, word: words[i-1] }));
  verifyStep = 0;
  document.getElementById('start-verify').classList.add('hidden');
  document.getElementById('verify-section').classList.remove('hidden');
  nextVerify();
};

function nextVerify() {
  if (verifyStep >= verifyPositions.length) {
    document.getElementById('finish-setup').classList.remove('hidden');
    document.getElementById('verify-section').classList.add('hidden');
    return;
  }
  const { pos, word } = verifyPositions[verifyStep];
  document.getElementById('verify-pos').textContent = pos;
  const options = [word, ...['privacy','shield','orchard','sovereign'].filter(w => w !== word).slice(0,3)];
  options.sort(() => Math.random() - 0.5);
  document.getElementById('verify-options').innerHTML = options.map(o =>
    `<button class="verify-opt py-2 rounded-lg border border-gray-700 text-sm hover:border-accent" data-word="${o}">${o}</button>`
  ).join('');
  document.querySelectorAll('.verify-opt').forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.word === word) {
        verifyStep++;
        nextVerify();
      } else {
        alert('Incorrect. Please check your backup.');
      }
    };
  });
}

document.getElementById('finish-setup').onclick = () => show('password-screen');

// Password
document.getElementById('set-password').onclick = async () => {
  const p1 = document.getElementById('pw1').value;
  const p2 = document.getElementById('pw2').value;
  if (p1.length < 8 || p1 !== p2) {
    alert('Passwords must match and be at least 8 characters');
    return;
  }
  walletPassword = p1;
  const encrypted = await encryptSeed(currentMnemonic, p1);
  localStorage.setItem('mask_encrypted', JSON.stringify(encrypted));
  localStorage.setItem('mask_created', Date.now());
  openWallet();
};

function openWallet() {
  const ua = generateUA(addressIndex);
  document.getElementById('ua').textContent = ua;
  document.getElementById('qr').innerHTML = '';
  new QRCode(document.getElementById('qr'), { text: ua, width: 140, height: 140, colorDark: '#f0762a', colorLight: '#05070d' });
  show('wallet');
  // Simulate sync
  setTimeout(() => {
    document.getElementById('sync-status').textContent = 'Synced';
    document.getElementById('sync-status').classList.remove('syncing', 'text-amber-400');
    document.getElementById('sync-status').classList.add('text-green-400');
  }, 2500);
}

// Tabs
document.querySelectorAll('.tab').forEach(t => {
  t.onclick = () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    ['send','receive','history','settings'].forEach(id => document.getElementById(id).classList.add('hidden'));
    document.getElementById(t.dataset.tab).classList.remove('hidden');
  };
});

// Actions
document.getElementById('copy-addr').onclick = () => {
  navigator.clipboard.writeText(document.getElementById('ua').textContent);
  alert('Address copied');
};

document.getElementById('new-addr').onclick = () => {
  addressIndex++;
  openWallet();
};

document.getElementById('do-send').onclick = () => {
  const to = document.getElementById('send-to').value;
  const amt = document.getElementById('send-amt').value;
  if (!to || !amt) return alert('Fill address and amount');
  if (!confirm(`Send ${amt} ZEC to ${to.slice(0,20)}... ?\n\nThis is a demo. No real transaction will be broadcast.`)) return;
  alert('Transaction prepared (demo). Full send requires WebZjs integration.');
};

document.getElementById('export-seed').onclick = () => {
  const pw = prompt('Enter password to reveal seed:');
  if (pw === walletPassword) alert(currentMnemonic);
  else alert('Wrong password');
};

document.getElementById('clear-wallet').onclick = () => {
  if (confirm('This will erase the wallet from this device. Make sure you have the seed backed up.')) {
    localStorage.clear();
    location.reload();
  }
};

// Restore on load if exists
if (localStorage.getItem('mask_encrypted')) {
  const pw = prompt('Enter your wallet password to unlock:');
  if (pw) {
    walletPassword = pw;
    // In real version decrypt here; for demo assume success if non-empty
    currentMnemonic = 'demo restored seed (full decrypt next)';
    openWallet();
  }
}
