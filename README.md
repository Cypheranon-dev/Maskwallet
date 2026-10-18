# Mask Wallet

**Privacy-first self-custodial Zcash wallet for the browser.**

Inspired by [ZODL](https://zodl.com) (formerly Zashi) — shielded by default, your keys, your crypto, no tracking. Competes in UX with modern wallets like Trust Wallet while staying Zcash-native and browser-first.

## v1.2 — All 4 Next Points Completed

### Completed

1. **WebZjs integration structure** — Code paths, comments, and initialization ready for `@chainsafe/webzjs-wallet` WASM sync + lightwalletd. Demo sync progress bar included.
2. **Improved Zcash-style address derivation** — More realistic unified address format with account + diversifier indices.
3. **Hardware wallet path + Tor option** — Settings UI for Keystone/Ledger connection flow and Tor routing toggle.
4. **Polish** — Live ZEC price feed (CoinGecko), fade-in animations, multi-account support (switch accounts), better progress animation, refined UX.

### Core Features

- Real 24-word BIP39 (audited `@scure/bip39`)
- Multi-step backup verification quiz
- Local AES-GCM encryption
- Dashboard with balance + USD, QR, tabs (Send/Receive/History/Settings)
- New receiving addresses, copy, demo send
- Fully client-side, no tracking, GitHub Pages ready
- **PWA** — installable on Android & iOS home screens

### Status

- ✅ WebZjs structure ready for real shielded sync
- ✅ Hardware + Tor UI paths
- ✅ Price feed + multi-account + animations
- ✅ PWA + Capacitor-ready for native Android/iOS
- ⚠️ Full real Orchard sync & broadcast still needs WASM bundling of WebZjs (next engineering step)
- ⚠️ **Test version only** — do not use with real funds

## Quick Start

1. Open `index.html` or serve statically
2. Enable GitHub Pages (Settings → Pages → main / root) → live at `https://cypheranon-dev.github.io/Maskwallet/`

## Production & Mobile Publishing

See **[PRODUCTION.md](PRODUCTION.md)** for:
- Making it installable as a PWA
- Wrapping with Capacitor for real Android APK / iOS IPA
- Publishing to Google Play & App Store
- Alternative: forking the open-source ZODL native apps

## Principles

- Privacy by design
- Self-custody only
- Shielded by default (structure ready)
- Open source, auditable
- No analytics or third-party tracking

## License

MIT

---

Mask your Zcash. Private by default. Provable by choice.
