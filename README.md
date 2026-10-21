# Mask Wallet

**Foundational self-custodial wallet for the Cypher protocol.**

Zodl-inspired Cypher wallet with Zcash integrated. Built as the user-facing layer of the Cypher CIP vision: privacy by default, post-quantum ready, and solving the memory and performance problems of current shielded systems (including Equihash 48,5 constraints).

## Vision alignment

- Client-side seed generation and AES-GCM encryption (no trusted setup)
- Path to zk-STARK ring signatures for memory-efficient shielded transactions
- Zcash compatibility while upgrading the underlying proof system
- Foundation for GPU-first decentralized mining and finite emission models
- Direct integration with Mask Swap for private asset movement

## Features

- Create / restore Cypher wallets (24-word BIP39)
- Local password encryption (AES-GCM)
- Dashboard showing **CYP** balances (+1000 CYP bonus on new wallets)
- Send / Receive Cypher tokens
- Zcash (ZEC) support integrated
- Direct link to Mask Swap for private swaps (ETH, BTC, SOL, ZEC ↔ Cypher)
- Black + orange Cypher theme
- PWA ready, GitHub Pages deployable
- Paper seed backup and hardware wallet options

## Live

- Wallet: `https://cypheranon-dev.github.io/Maskwallet/`
- Swap: `https://cypheranon-dev.github.io/Maskswap/`

## Security

See [SECURITY.md](SECURITY.md). All encryption is client-side. No secrets in the repository.

## Status

Active development toward full Cypher protocol integration (zk-STARKs, optimized Equihash, private swaps). This wallet is the reference client path.

## License

MIT

---

Mask your Cypher. Private by default. Provable by choice.
