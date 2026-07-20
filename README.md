# 36 Chambers OS

A functional iOS-inspired progressive web app built with plain HTML, CSS and JavaScript.

## Included
- Lock screen and four-digit demo passcode (`3636`)
- iPhone-style home screen, dock, app windows and control center
- 12 simulated apps
- Working local notes saved in `localStorage`
- Browser shell that opens real sites in Safari, with an optional iframe preview
- Camera permission demo
- Offline service worker and installable PWA manifest
- Four wallpapers
- “Weed” mode: slowed animations, purple haze, blur, saturation and haptic/audio feedback

## Run it
Service workers and camera permissions require HTTPS or localhost.

### Easiest desktop method
```bash
cd 36chambers_os
python3 -m http.server 8080
```
Then open `http://localhost:8080`.

### iPhone install
1. Host the folder on any HTTPS static host (GitHub Pages, Netlify, Cloudflare Pages, etc.).
2. Open the URL in Safari.
3. Tap Share → Add to Home Screen.

## Important limitation
This is a web OS/PWA, not a replacement iOS firmware. HTML/CSS/JS cannot execute App Store IPA binaries or reproduce Apple’s private UIKit, SpringBoard, entitlements, code signing, sandbox, Secure Enclave, telephony stack, or iOS kernel. A true iOS-compatible OS would require a legally and technically different multi-year operating-system project.

## Browser limitation
Many websites send `X-Frame-Options` or CSP headers that prevent iframe embedding. The **GO** button therefore opens the real website in Safari; **PREVIEW** is optional and only works for sites that permit embedding. A true in-app browser requires a native `WKWebView` wrapper.
