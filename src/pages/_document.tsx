import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme Color */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />

        {/* Description */}
        <meta
          name="description"
          content="QED - A multi-agent study coach powered by Claude that helps you think through hard problems using the Socratic method."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="QED - Multi-Agent Study Coach" />
        <meta
          property="og:description"
          content="Train your mind, don't just get answers. A multi-agent study coach that helps you think through hard problems."
        />
        <meta property="og:image" content="/qed-logo.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="QED - Multi-Agent Study Coach" />
        <meta
          name="twitter:description"
          content="Train your mind, don't just get answers. A multi-agent study coach that helps you think through hard problems."
        />
        <meta name="twitter:image" content="/qed-logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
