import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// Enhanced with PWA support for native-like mobile experience.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        {/* Mobile viewport — prevent zoom on input focus (iOS), lock to device width */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />

        {/* PWA manifest */}
        <link rel="manifest" href="/tend-demo/manifest.json" />

        {/* Theme color — colors the status bar on Android Chrome & Safari */}
        <meta name="theme-color" content="#00B47C" />
        <meta name="msapplication-navbutton-color" content="#00B47C" />

        {/* Apple Web App — standalone mode, green status bar */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Tend" />
        <link rel="apple-touch-icon" href="/tend-demo/apple-touch-icon.png" />

        {/* Apple splash screens for common iPhone sizes */}
        <link
          rel="apple-touch-startup-image"
          href="/tend-demo/apple-touch-icon.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/tend-demo/apple-touch-icon.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/tend-demo/apple-touch-icon.png"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/tend-demo/apple-touch-icon.png"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/tend-demo/apple-touch-icon.png"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
        />

        {/* Microsoft tile */}
        <meta name="msapplication-TileColor" content="#00B47C" />
        <meta name="msapplication-TileImage" content="/tend-demo/icon-192.png" />

        {/* SEO & social */}
        <meta name="description" content="Tend — Caring companionship for seniors, a tap away. Find trusted helpers for daily living support." />
        <meta name="application-name" content="Tend" />

        {/* Disable phone number detection (iOS) */}
        <meta name="format-detection" content="telephone=no" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/tend-demo/icon-192.png" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: tendStyles }} />
      </head>
      <body>
        {/* Splash screen — visible while JS bundle loads, then fades out */}
        <div id="tend-splash">
          <div className="splash-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20c4 0 6-4 6-4s2 4 6 4a4.49 4.49 0 001.29-.3l1 2.3 1.89-.66C22.1 16.17 19.9 10 11 8"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="rgba(255,255,255,0.3)"
              />
              <path
                d="M12 2C9.24 2 7 4.24 7 7c0 2.85 2.92 5.97 4.58 7.59a.5.5 0 00.84 0C14.08 12.97 17 9.85 17 7c0-2.76-2.24-5-5-5z"
                fill="white"
                opacity="0.9"
              />
            </svg>
          </div>
          <div className="splash-title">Tend</div>
          <div className="splash-subtitle">Caring companionship, a tap away</div>
        </div>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Fade out splash once React hydrates
              function dismissSplash() {
                var s = document.getElementById('tend-splash');
                if (s) {
                  s.classList.add('fade-out');
                  setTimeout(function() { s.remove(); }, 500);
                }
              }
              // Dismiss after React mounts OR after 4s timeout (whichever first)
              if (document.readyState === 'complete') {
                setTimeout(dismissSplash, 300);
              } else {
                window.addEventListener('load', function() {
                  setTimeout(dismissSplash, 300);
                });
              }
              setTimeout(dismissSplash, 4000);
            `,
          }}
        />
      </body>
    </html>
  );
}

const tendStyles = `
/* ── Base ────────────────────────────────────────── */
body {
  background-color: #F8F9FA;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── PWA standalone: extend into status bar area ── */
@supports (padding-top: env(safe-area-inset-top)) {
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}

/* ── Prevent overscroll / pull-to-refresh in PWA ── */
html, body {
  overscroll-behavior: none;
  overflow: hidden;
  height: 100%;
  width: 100%;
  position: fixed;
}

#root {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

/* ── Smooth momentum scrolling ────────────────── */
* {
  -webkit-overflow-scrolling: touch;
}

/* ── Disable text selection on interactive elements ── */
button, [role="button"], a {
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* ── Prevent callout / long-press menus on mobile ── */
img, a {
  -webkit-touch-callout: none;
}

/* ── Remove iOS input zoom (font-size >= 16px) ── */
input, select, textarea {
  font-size: 16px !important;
}

/* ── Splash screen while JS loads ────────────── */
#tend-splash {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #009966 0%, #00D4A1 50%, #00B47C 100%);
  transition: opacity 0.4s ease-out;
}
#tend-splash.fade-out {
  opacity: 0;
  pointer-events: none;
}
#tend-splash .splash-icon {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  animation: pulse 2s ease-in-out infinite;
}
#tend-splash .splash-icon svg {
  width: 40px;
  height: 40px;
}
#tend-splash .splash-title {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}
#tend-splash .splash-subtitle {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 15px;
  color: rgba(255,255,255,0.85);
  font-weight: 500;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

/* ── Max width on desktop for phone-like feel ── */
@media (min-width: 480px) {
  #root {
    max-width: 430px;
    margin: 0 auto;
    box-shadow: 0 0 40px rgba(0,0,0,0.08);
    border-left: 1px solid #E2E8F0;
    border-right: 1px solid #E2E8F0;
    position: relative;
  }
  body {
    background-color: #E8ECEF;
  }
}
`;
