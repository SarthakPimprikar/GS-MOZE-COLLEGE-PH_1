import { Outfit, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SessionProvider } from "@/context/SessionContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "G.S. Moze College ERP",
  description: "A premium college portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FPV47HNZ50"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FPV47HNZ50');
          `}
        </Script>
      </head>

      <body className={`${outfit.variable} ${playfair.variable} font-sans antialiased text-gray-800`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
