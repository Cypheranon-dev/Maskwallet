# Mask Wallet

**Privacy-first self-custodial Zcash wallet for the browser.**

Inspired by [ZODL](https://zodl.com) (formerly Zashi) — shielded by default, your keys, your crypto, no tracking.

## v1 — Public Production Test

This is the first public test version of Mask Wallet. It demonstrates the core flow:

1. **Create** a new wallet (BIP39 seed generated entirely in your browser)
2. **Secure** it (backup seed phrase + optional local password encryption)
3. **Use** it (view address, receive, prepare for shielded transactions)

### Current Status (v1)

- ✅ Client-side seed generation (Web Crypto + BIP39-compatible)
- ✅ Local storage with optional password encryption
- ✅ Clean, modern, privacy-focused UI
- ✅ GitHub Pages ready
- ⚠️ Full shielded sync & send requires integrating [WebZjs](https://github.com/ChainSafe/WebZjs) (planned for v1.1)
- ⚠️ **Do not use with real funds yet** — this is a test version

## Quick Start

1. Open `index.html` in a modern browser, or
2. Serve locally: `python -m http.server` or any static server
3. Deploy to GitHub Pages (Settings → Pages → main branch)

## Design Principles (from ZODL)

- **Privacy by design** — nothing leaves your device
- **Self-custody** — only you hold the keys
- **Shielded by default** (coming)
- **Consent & clarity** — no dark patterns
- **Open source** — audit everything

## Roadmap

- [ ] Integrate `@chainsafe/webzjs-wallet` for real Orchard sync
- [ ] Unified Address display + QR
- [ ] Send shielded ZEC
- [ ] Hardware wallet support path
- [ ] Tor / privacy routing options

## License

MIT

---

Built for financial sovereignty. Mask your Zcash.
