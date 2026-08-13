import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Monetag SDK — to'g'ri URL va data atributlari bilan */}
        <Script 
          src="https://libtl.com/sdk.js"
          strategy="afterInteractive"
          data-zone="11548562"
          data-sdk="show_11548562"
        />
        
        {/* Telegram WebApp Script — to'g'ri URL */}
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
        {/* AdsGram SDK Script */}
        <Script
          src="https://sad.adsgram.ai/js/sad.min.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-gray-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}