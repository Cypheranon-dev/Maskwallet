# Mask Wallet

**Privacy-first self-custodial Cypher wallet for the browser.**

Inspired by [ZODL](https://zodl.com) but built for the Cypher project. Self-custody, private by design, works together with [Mask Swap](https://github.com/Cypheranon-dev/Maskswap).

## Features

- Create / restore Cypher wallets (24-word BIP39)
- Local password encryption (AES-GCM)
- Dashboard showing **CYP** balances (+1000 CYP bonus on new wallets)
- Send / Receive Cypher tokens
- Direct link to Mask Swap for private swaps (ETH, BTC, SOL, ZEC ↔ Cypher)
- Black + orange Cypher theme
- PWA ready, GitHub Pages deployable
- Paper seed backup and hardware wallet options

## Live

Enable GitHub Pages (Settings → Pages → main / root):

- Wallet: `https://cypheranon-dev.github.io/Maskwallet/`
- Swap: `https://cypheranon-dev.github.io/Maskswap/`

## Security

See [SECURITY.md](SECURITY.md). All encryption is client-side. No secrets in the repository.

## Integration

From the wallet dashboard you can open Mask Swap. Both apps are standalone but share theme and privacy goals.

## Status

Test / demo version. Real Cypher protocol integration (zk-STARKs, private swaps) is the next engineering step.

## License

MIT

---

Mask your Cypher. Private by default.
