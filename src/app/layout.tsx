import './globals.css';
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="https://libtl.com/sdk.js"
          strategy="afterInteractive"
          data-zone="11548562"
          data-sdk="show_11548562"
        />
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
        <Script
          src="https://sad.adsgram.ai/js/sad.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-gray-900 text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
