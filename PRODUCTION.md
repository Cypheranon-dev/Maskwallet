# Production Build & Publishing Guide

## 1. Progressive Web App (PWA) — Installable Now

The app is now a PWA. After deploying to GitHub Pages (HTTPS):

**Android (Chrome):**
- Open the live URL
- Menu → "Install app" or "Add to Home screen"

**iOS (Safari):**
- Open the live URL
- Share → "Add to Home Screen"

It launches in standalone mode with the Mask icon.

## 2. Native Android & iOS with Capacitor (Recommended for Stores)

Capacitor wraps the existing web app into real native projects.

### Setup
```bash
npm install
npx cap init MaskWallet com.maskwallet.app --web-dir .
npx cap add android
npx cap add ios
npx cap sync
```

### Build Android APK/AAB
```bash
npx cap open android
```
- In Android Studio: Build → Generate Signed Bundle / APK
- You need a Google Play Developer account ($25 one-time)

### Build iOS
```bash
npx cap open ios
```
- Requires a Mac + Xcode + Apple Developer account ($99/year)
- Archive and upload to App Store Connect

### Important for Production
- Replace placeholder icons in `manifest.json` with real 192/512 PNGs
- Full WebZjs WASM requires a proper bundler (Vite/Webpack) — the current static setup is demo-ready
- Add real lightwalletd endpoint and handle permissions (network, biometric if desired)
- Test on physical devices

## 3. Alternative: Fork ZODL (Full Native)

ZODL (ex-Zashi) is open source MIT:

- Android: https://github.com/zodl-inc/zodl-android
- iOS: https://github.com/zodl-inc/zodl-ios

Fork, rebrand to Mask, and build native. This gives true shielded performance but is a larger effort.

## 4. Publishing Checklist

- [ ] Real icons & splash
- [ ] Privacy policy & terms
- [ ] Test on real devices
- [ ] Security review (keys never leave device)
- [ ] Google Play / App Store accounts
- [ ] Signed builds
- [ ] Clear "test / do not use real funds" until WebZjs is fully integrated

## Next Engineering Steps for Full Production

1. Move to Vite + bundle `@chainsafe/webzjs-wallet` WASM
2. Connect to a gRPC-web lightwalletd proxy
3. Implement real balance sync and send
4. Add biometric unlock (Capacitor plugin)
5. Submit to stores

---

Current status: Installable PWA + Capacitor-ready native wrapper. Full real Zcash sync is the remaining engineering task.
