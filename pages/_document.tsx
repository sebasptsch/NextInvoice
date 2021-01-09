import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content="Juli's Invoicing Site" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta
            name="apple-mobile-web-app-title"
            content="Juli's Invoicing Site"
          />
          <meta
            name="description"
            content="An invoicing system made for Juli by Sebastian"
          />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#000000" />

          <link
            rel="apple-touch-icon"
            sizes="512x512"
            href="/public/icons/apple-icon"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/public/icons/icon-192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="384x384"
            href="/public/icons/icon-384.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="512x512"
            href="/public/icons/icon-512.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link rel="shortcut icon" href="/icons/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
