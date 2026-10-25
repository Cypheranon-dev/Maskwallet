// Mask Wallet for Cypher (CYP)
// Inspired by ZODL but built for Cypher. Integrates with Mask Swap.
// New wallets receive 1000 CYP bonus. Each CYP costs $0.25.

import * as bip39 from 'https://cdn.jsdelivr.net/npm/@scure/bip39@2.4.0/+esm';
import { wordlist } from 'https://cdn.jsdelivr.net/npm/@scure/bip39@2.4.0/wordlists/english.js/+esm';

let currentMnemonic = null;
let walletPassword = null;
let addressIndex = 0;
let accountIndex = 0;
let cypPrice = 0.25; // each CYP costs $0.25
let isNewWallet = false;

function generateUA(account = 0, index = 0) {
  const entropy = crypto.getRandomValues(new Uint8Array(32));
  const hex = Array.from(entropy).map(b => b.toString(16).padStart(2,'0')).join('');
  return `cyp1${hex.slice(0,48)}mask${account}${index}`;
}

async function encryptSeed(seed, password) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('mask-cyp-salt'), iterations: 150000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
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

document.getElementById('create-new').onclick = async () => {
  currentMnemonic = bip39.generateMnemonic(wordlist, 256);
  if (!bip39.validateMnemonic(currentMnemonic, wordlist)) return alert('Generation failed');
  isNewWallet = true;
  renderSeed(currentMnemonic);
  show('seed-screen');
};

document.getElementById('restore').onclick = () => {
  const phrase = prompt('Paste your 24-word seed phrase:');
  if (!phrase) return;
  const cleaned = phrase.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!bip39.validateMnemonic(cleaned, wordlist)) return alert('Invalid seed phrase');
  currentMnemonic = cleaned;
  isNewWallet = false;
  show('password-screen');
};

let verifyStep = 0, verifyPositions = [];
document.getElementById('start-verify').onclick = () => {
  const words = currentMnemonic.split(' ');
  verifyPositions = [5, 14, 23].map(i => ({ pos: i, word: words[i-1] }));
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
  const opts = [word, ...['privacy','shield','cypher','sovereign','mask'].filter(w=>w!==word).slice(0,3)];
  opts.sort(() => Math.random() - 0.5);
  document.getElementById('verify-options').innerHTML = opts.map(o =>
    `<button class="verify-opt py-2 rounded-lg border border-gray-700 text-sm hover:border-accent" data-word="${o}">${o}</button>`
  ).join('');
  document.querySelectorAll('.verify-opt').forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.word === word) { verifyStep++; nextVerify(); }
      else alert('Incorrect. Check your backup.');
    };
  });
}

document.getElementById('finish-setup').onclick = () => show('password-screen');

document.getElementById('set-password').onclick = async () => {
  const p1 = document.getElementById('pw1').value;
  const p2 = document.getElementById('pw2').value;
  if (p1.length < 8 || p1 !== p2) return alert('Passwords must match (min 8 chars)');
  walletPassword = p1;
  const encrypted = await encryptSeed(currentMnemonic, p1);
  localStorage.setItem('mask_encrypted', JSON.stringify(encrypted));
  localStorage.setItem('mask_account', accountIndex);
  openWallet();
};

function openWallet() {
  const ua = generateUA(accountIndex, addressIndex);
  document.getElementById('ua').textContent = ua;
  document.getElementById('qr').innerHTML = '';
  new QRCode(document.getElementById('qr'), { text: ua, width: 140, height: 140, colorDark: '#f0762a', colorLight: '#05070d' });
  document.getElementById('account-num').textContent = accountIndex + 1;
  show('wallet');

  let p = 0;
  const bar = document.getElementById('progress-bar');
  const status = document.getElementById('sync-status');
  const interval = setInterval(() => {
    p += 12;
    bar.style.width = Math.min(p, 100) + '%';
    if (p >= 100) {
      clearInterval(interval);
      status.textContent = 'Synced (demo)';
      status.classList.remove('syncing','text-amber-400');
      status.classList.add('text-green-400');
      // New wallets get 1000 CYP bonus
      const bonus = isNewWallet ? 1000 : 0;
      const bal = (bonus + (Math.random() * 50)).toFixed(2);
      document.getElementById('balance').innerHTML = `${bal} <span class="text-lg text-gray-400">CYP</span>`;
      document.getElementById('usd').textContent = `\u2248 $${(bal * cypPrice).toFixed(2)} USD`;
      if (isNewWallet) {
        alert('Welcome! Your new wallet received a 1000 CYP bonus.');
        isNewWallet = false;
      }
    }
  }, 300);
}

document.querySelectorAll('.tab').forEach(t => {
  t.onclick = () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    ['send','receive','history','settings'].forEach(id => document.getElementById(id).classList.add('hidden'));
    document.getElementById(t.dataset.tab).classList.remove('hidden');
  };
});

document.getElementById('copy-addr').onclick = () => {
  navigator.clipboard.writeText(document.getElementById('ua').textContent);
  alert('Address copied');
};

document.getElementById('new-addr').onclick = () => {
  addressIndex++;
  openWallet();
};

document.getElementById('switch-account').onclick = () => {
  accountIndex = (accountIndex + 1) % 5;
  addressIndex = 0;
  openWallet();
};

document.getElementById('do-send').onclick = () => {
  const to = document.getElementById('send-to').value;
  const amt = document.getElementById('send-amt').value;
  if (!to || !amt) return alert('Fill address and amount');
  if (!confirm(`Send ${amt} CYP to ${to.slice(0,16)}... ?\n\nDemo mode for Cypher.`)) return;
  alert('Cypher transaction prepared (demo).');
};

// Paper backup
document.getElementById('export-seed').onclick = () => {
  const pw = prompt('Enter password to reveal seed for paper backup:');
  if (pw === walletPassword && currentMnemonic && currentMnemonic !== 'restored-seed-placeholder') {
    const text = 'MASK WALLET PAPER BACKUP\n\nWrite these 24 words on paper in order.\nStore offline in a safe place.\nNever share digitally or take a photo.\n\n' + currentMnemonic.split(' ').map((w,i) => (i+1) + '. ' + w).join('\n');
    alert(text);
    if (confirm('Copy seed phrase to clipboard for manual writing? (recommended to write by hand)')) {
      navigator.clipboard.writeText(currentMnemonic);
    }
  } else if (pw === walletPassword) {
    alert('Seed is locked. For full paper backup, restore from original seed or create a new wallet.');
  } else alert('Wrong password');
};

document.getElementById('tor-toggle').onchange = (e) => {
  alert(e.target.checked ? 'Tor routing enabled (demo).' : 'Tor disabled');
};

// Hardware wallet
document.getElementById('hw-wallet').onclick = () => {
  const choice = prompt('Add / Connect Hardware Wallet:\n\n1. Keystone (QR air-gapped)\n2. Ledger (Bluetooth)\n3. Other / Learn more\n\nEnter 1, 2, or 3:');
  if (choice === '1') alert('Keystone:\n1. Open Keystone and select Cypher/Zcash account.\n2. Show QR of viewing key or address.\n3. Scan in Mask Wallet (coming soon).\nYour seed never leaves the device.');
  else if (choice === '2') alert('Ledger:\n1. Install Cypher/Zcash app on Ledger.\n2. Pair via Bluetooth.\n3. Select account and sign on device.\nStructure ready for Cypher.');
  else alert('Hardware wallets keep your seed offline.\nSupported path: Keystone (QR) and Ledger.\nUse paper backup as well.');
};

document.getElementById('clear-wallet').onclick = () => {
  if (confirm('Erase wallet from this device? Make sure you have a paper backup of the seed.')) {
    localStorage.clear();
    location.reload();
  }
};

if (localStorage.getItem('mask_encrypted')) {
  const pw = prompt('Enter wallet password to unlock:');
  if (pw) {
    walletPassword = pw;
    currentMnemonic = 'restored-seed-placeholder';
    accountIndex = parseInt(localStorage.getItem('mask_account') || '0');
    isNewWallet = false;
    openWallet();
  }
}
