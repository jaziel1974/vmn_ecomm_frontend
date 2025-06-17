import { CartContextProvider } from "@/components/CartContext";
import { createGlobalStyle } from "styled-components";
import { AuthProvider } from "./api/auth/auth";
import GlobalPushNotifications from "@/components/GlobalPushNotifications";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";


const GlobalStyles = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Laila:wght@300;400;500;600;700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

* {
  box-sizing: border-box;
}

html, body {
  background-color: #c5f0c2;
  padding: 0;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  height: 100%;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Mobile touch targets */
button, a, input {
  min-height: 44px;
  min-width: 44px;
}

/* Prevent zoom on input focus (iOS) */
input, select, textarea {
  font-size: 16px;
}

.fontFamily {
  font-family: Laila, sans-serif;
}

/* PWA specific styles */
@media (display-mode: standalone) {
  body {
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
}

/* Safe area adjustments for notched devices */
.safe-area-top {
  padding-top: env(safe-area-inset-top);
}

.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
`;

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <AuthProvider>
      <GlobalStyles />
      <GlobalPushNotifications />
      <CartContextProvider>
        <Component {...pageProps} />
        <PWAInstallPrompt />
      </CartContextProvider>
    </AuthProvider>
  )
}
