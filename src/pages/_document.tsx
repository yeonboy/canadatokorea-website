import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TM8V7PBN');
            `,
          }}
        />

        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                page_path: window.location.pathname,
                anonymize_ip: true,
                custom_map: {
                  custom_parameter_1: 'canada_user'
                }
              });
            `,
          }}
        />

        {/* Google AdSense (전역) */}
        {process.env.NODE_ENV === 'production' && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9341182872129892"
            crossOrigin="anonymous"
          />
        )}

        {/* 폰트 최적화 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap" rel="stylesheet" />
        
        {/* 파비콘 */}
        {/* 파비콘: 브라우저가 정확한 해상도를 선택할 수 있도록 16/32 명시 */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2" />
        <link rel="icon" type="image/png" href="/favicon.png?v=2" />
        <link rel="icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" href="/favicon.png?v=2" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 테마 색상 */}
        <meta name="theme-color" content="#2B5CE6" />
        <meta name="msapplication-TileColor" content="#2B5CE6" />

        {/* 기본 Open Graph / Twitter 메타 (페이지별로 덮어쓰기 가능) */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Canada to Korea" />
        <meta property="og:title" content="Real Korea Insights for Canadians" />
        <meta property="og:description" content="한국 로컬 인사이트를 캐나다 사용자에게. 문화·언어·여행·핫플 정보." />
        <meta property="og:url" content="https://canadatokorea.com/" />
        <meta property="og:image" content="https://canadatokorea.com/og-default.jpg?v=2" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://canadatokorea.com/og-default.jpg?v=2" />
      </Head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TM8V7PBN"
            height="0" 
            width="0" 
            style={{display: 'none', visibility: 'hidden'}}
          />
        </noscript>
        
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
