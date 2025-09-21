import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
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

        {/* 폰트 최적화 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Shadows+Into+Light&display=swap" rel="stylesheet" />
        
        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />
        {/* 현재 저장소에는 favicon.ico만 존재 */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* 테마 색상 */}
        <meta name="theme-color" content="#2B5CE6" />
        <meta name="msapplication-TileColor" content="#2B5CE6" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
