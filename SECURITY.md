# Security Policy

## Supported Versions
Current main branch (demo / test).

## Reporting a Vulnerability
Please open a private GitHub issue or email the project maintainers. Do not disclose publicly until patched.

## Security Practices
- No private keys or seeds are ever stored on a server.
- Seed phrases are encrypted locally with AES-GCM + PBKDF2 before being saved to localStorage.
- No analytics, no tracking, no third-party scripts that can exfiltrate data.
- Hardware wallet path is prepared; private keys never leave the device.
- This is a demo. Do not use with real funds until full protocol integration and audit.

## Self-custody
You control your keys. Back up the 24-word seed on paper and store offline.
