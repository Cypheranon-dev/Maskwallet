# Mask Wallet

**Privacy-first self-custodial Zcash wallet for the browser.**

Inspired by [ZODL](https://zodl.com) (formerly Zashi) — shielded by default, your keys, your crypto, no tracking. Competes in UX with modern wallets like Trust Wallet while staying Zcash-native and browser-first.

## v1.1 — Interactive Complex Production Test

This version delivers a full interactive experience:

- **Create** new wallet with real 24-word BIP39 (via audited @scure/bip39)
- **Secure** with multi-step backup verification + local AES-GCM password encryption
- **Restore** from seed
- **Use** with dashboard, balance (sync simulation), unified address + QR, Send / Receive / History / Settings tabs
- Generate new receiving addresses, copy, demo send flow
- Fully client-side, no tracking, GitHub Pages ready

### Status

- ✅ Real BIP39 generation & validation
- ✅ Backup verification quiz
- ✅ Local encryption (PBKDF2 + AES-GCM)
- ✅ Polished multi-view UX competing with mobile wallets
- ✅ QR codes, tabs, settings
- ⚠️ Full Orchard shielded sync & real transactions require [WebZjs](https://github.com/ChainSafe/WebZjs) integration (v1.2)
- ⚠️ **Test version only** — do not use with real funds

## Quick Start

1. Open `index.html` or serve statically
2. Enable GitHub Pages (Settings → Pages → main / root) for live demo at `https://cypheranon-dev.github.io/Maskwallet/`

## Principles

- Privacy by design
- Self-custody only
- Shielded by default (coming)
- Open source, auditable
- No analytics or third-party tracking

## License

MIT

---

Mask your Zcash. Private by default. Provable by choice.
