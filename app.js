// Mask Wallet for Cypher (CYP)
// Password is optional and can be set later in Security.

import * as bip39 from 'https://cdn.jsdelivr.net/npm/@scure/bip39@2.4.0/+esm';
import { wordlist } from 'https://cdn.jsdelivr.net/npm/@scure/bip39@2.4.0/wordlists/english.js/+esm';

let currentMnemonic = null;
let walletPassword = null;
let addressIndex = 0;
let accountIndex = 0;
let wallets = JSON.parse(localStorage.getItem('mask_wallets') || '[]');
function saveWallets() { localStorage.setItem('mask_wallets', JSON.stringify(wallets)); }
function walletLabel(i) { return 'Wallet ' + String.fromCharCode(65 + i); }
let cypPrice = 0.25;
let isNewWallet = false;
let currentUA = '';

function generateUA(account = 0, index = 0) {
  const entropy = crypto.getRandomValues(new Uint8Array(32));
  const hex = Array.from(entropy).map(b => b.toString(16).padStart(2,'0')).join('');
  return `cph1q${hex.slice(0,20)}${account}${index}k92f`;
}

async function encryptSeed(seed, password) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);
  const key = await crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: enc.encode('mask-cyp-salt'), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(seed));
  return { iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) };
}

function show(id) {
  ['onboard','seed-screen','password-screen','wallet'].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add('hidden');
  });
  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');
  const nav = document.getElementById('bottom-nav');
  if (nav) nav.classList.toggle('hidden', id !== 'wallet');
}

function toast(msg) {
  if (window.toast) window.toast(msg);
  else alert(msg);
}

function renderSeed(mnemonic) {
  const words = mnemonic.split(' ');
  const el = document.getElementById('seed-words');
  if (!el) return;
  el.innerHTML = words.map((w, i) =>
    `<div class="seed-word rounded px-1.5 py-1 text-center"><span class="text-gray-500 text-[10px]">${i+1}</span><br>${w}</div>`
  ).join('');
}

document.getElementById('create-new').onclick = async () => {
  currentMnemonic = bip39.generateMnemonic(wordlist, 256);
  if (!bip39.validateMnemonic(currentMnemonic, wordlist)) return toast('Generation failed');
  isNewWallet = true;
  renderSeed(currentMnemonic);
  show('seed-screen');
};

document.getElementById('restore').onclick = () => {
  const phrase = prompt('Paste your 24-word seed phrase:');
  if (!phrase) return;
  const cleaned = phrase.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!bip39.validateMnemonic(cleaned, wordlist)) return toast('Invalid seed phrase');
  currentMnemonic = cleaned;
  isNewWallet = false;
  openWallet();
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
      else toast('Incorrect. Check your backup.');
    };
  });
}

// Skip mandatory password — open wallet directly. Password is optional in Security.
document.getElementById('finish-setup').onclick = () => openWallet();

const setPwBtn = document.getElementById('set-password');
if (setPwBtn) setPwBtn.onclick = async () => {
  const p1 = document.getElementById('pw1')?.value || '';
  const p2 = document.getElementById('pw2')?.value || '';
  if (p1.length < 8 || p1 !== p2) return toast('Passwords must match (min 8 chars)');
  walletPassword = p1;
  if (currentMnemonic) {
    const encrypted = await encryptSeed(currentMnemonic, p1);
    localStorage.setItem('mask_encrypted', JSON.stringify(encrypted));
  }
  toast('Password set');
  openWallet();
};

function openWallet() {
  if (!wallets[accountIndex]) {
    wallets[accountIndex] = { name: walletLabel(accountIndex), ua: '', bal: isNewWallet ? 1000 : 7240.12 };
  }
  if (currentMnemonic && currentMnemonic !== 'restored') wallets[accountIndex].seed = currentMnemonic;
  currentUA = generateUA(accountIndex, addressIndex);
  wallets[accountIndex].ua = currentUA;
  saveWallets();
  const sw = document.getElementById('wallet-switcher');
  if (sw) sw.textContent = walletLabel(accountIndex) + ' ▾';
  const uaEl = document.getElementById('ua');
  if (uaEl) uaEl.textContent = currentUA;
  const qr = document.getElementById('qr');
  if (qr && typeof QRCode !== 'undefined') {
    qr.innerHTML = '';
    new QRCode(qr, { text: currentUA, width: 160, height: 160, colorDark: '#05070d', colorLight: '#ffffff' });
  }
  show('wallet');

  if (isNewWallet && !wallets[accountIndex].bal) wallets[accountIndex].bal = 1000;
  const bal = (wallets[accountIndex].bal || 0).toFixed(2);
  saveWallets();
  if (window.setBalanceDisplay) window.setBalanceDisplay(bal);
  const asset = document.getElementById('asset-cyp');
  if (asset) asset.textContent = bal;
  const usd = document.getElementById('asset-cyp-usd');
  if (usd) usd.textContent = '$' + (parseFloat(bal) * cypPrice).toFixed(2);
  if (isNewWallet) {
    toast('Wallet created · 1,000 CYP');
    isNewWallet = false;
  }
  localStorage.setItem('mask_has_wallet', '1');
  localStorage.setItem('mask_account', accountIndex);
}

const copySeed = document.getElementById('copy-seed');
if (copySeed) copySeed.onclick = () => {
  if (!currentMnemonic) return toast('No seed to copy');
  navigator.clipboard.writeText(currentMnemonic).then(() => toast('Seed phrase copied'));
};

const copyBtn = document.getElementById('copy-addr');
if (copyBtn) copyBtn.onclick = () => {
  navigator.clipboard.writeText(document.getElementById('ua').textContent).then(() => toast('Copied'));
};

const newAddr = document.getElementById('new-addr');
if (newAddr) newAddr.onclick = () => {
  addressIndex++;
  openWallet();
  toast('New address');
};

const switchAcct = document.getElementById('switch-account');
if (switchAcct) switchAcct.onclick = () => {
  accountIndex = wallets.length;
  addressIndex = 0;
  isNewWallet = true;
  openWallet();
  toast('Added ' + walletLabel(accountIndex));
};

const exportSeed = document.getElementById('export-seed');
if (exportSeed) exportSeed.onclick = () => {
  if (currentMnemonic && currentMnemonic !== 'restored') {
    toast('Seed shown in next prompt');
    alert('PAPER BACKUP\n\n' + currentMnemonic.split(' ').map((w,i) => (i+1) + '. ' + w).join('\n'));
  } else toast('Restore from original seed to export');
};

const hw = document.getElementById('hw-wallet');
if (hw) hw.onclick = () => toast('Hardware: Keystone (QR) or Ledger — seed never leaves device');

const clear = document.getElementById('clear-wallet');
if (clear) clear.onclick = () => {
  if (confirm('Erase wallet from this device? Confirm you have the seed.')) {
    localStorage.clear();
    location.reload();
  }
};

// Auto-open if previously created (no password gate)
if (localStorage.getItem('mask_has_wallet')) {
  accountIndex = parseInt(localStorage.getItem('mask_account') || '0');
  currentMnemonic = 'restored';
  isNewWallet = false;
  openWallet();
}

// AI security scanner (open-source heuristics)
function scanUrl(url) {
  const flags = [];
  const u = (url || '').toLowerCase();
  const bad = ['phishing','metamask-login','wallet-connect-claim','airdrop-claim','seed-phrase','verify-wallet','kucoin-bonus','free-crypto','double-your'];
  bad.forEach(b => { if (u.includes(b)) flags.push(b); });
  if (u.includes('xn--') || (u.match(/-/g)||[]).length > 4) flags.push('suspicious-domain');
  if (!u.startsWith('https://')) flags.push('no-https');
  return { safe: flags.length === 0, flags };
}

function openInBrowser(url) {
  if (!url.startsWith('http')) url = 'https://' + url;
  const scan = scanUrl(url);
  const flag = document.getElementById('browser-flag');
  const frame = document.getElementById('browser-frame');
  const input = document.getElementById('browser-url');
  if (input) input.value = url;
  if (flag) {
    flag.classList.toggle('hidden', scan.safe);
    if (!scan.safe) flag.textContent = '⚠ AI security flagged: ' + scan.flags.join(', ');
  }
  if (frame) frame.src = url;
  if (window.showView) window.showView('browser');
  else document.querySelector('[data-action="dapp"]')?.click();
}

document.querySelectorAll('#view-dapp a[href]').forEach(a => {
  a.onclick = (e) => { e.preventDefault(); openInBrowser(a.href); };
});

const goBtn = document.getElementById('browser-go');
if (goBtn) goBtn.onclick = () => openInBrowser(document.getElementById('browser-url').value);

// Earn / Explore tabs
document.querySelectorAll('#view-dapp button').forEach(btn => {
  if (['Earn','Explore','DApps','Airdrops','Featured'].includes(btn.textContent.trim())) {
    btn.onclick = () => {
      document.querySelectorAll('#view-dapp button').forEach(b => {
        if (['Earn','Explore','DApps','Airdrops','Featured'].includes(b.textContent.trim())) {
          b.classList.remove('accent','border-b-2','border-[#f0762a]','font-medium');
          b.classList.add('text-gray-500');
        }
      });
      btn.classList.add('accent','border-b-2','border-[#f0762a]','font-medium');
      btn.classList.remove('text-gray-500');
      toast(btn.textContent.trim() + ' — content below');
    };
  }
});

window.showView = window.showView || function(n){};
window.openInBrowser = openInBrowser;
