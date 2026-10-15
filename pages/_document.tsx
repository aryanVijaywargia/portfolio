// eslint-disable-next-line @next/next/no-document-import-in-page
import { Favicon } from "components/_document/favicon";
import { Font } from "components/_document/font";
import Document, { Head, Html, Main, NextScript } from "next/document";

class Root extends Document {
  render(): JSX.Element {
    // language=JavaScript
    return (
      <Html lang="en">
        <Head>
          {/* Pre-paint scroll restore: hide <html>, restore scroll, reveal.
              Avoids the landing-page flash on refresh. Must be the FIRST script
              in <Head> so it runs before any body content is painted. */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{if('scrollRestoration' in history){history.scrollRestoration='manual';}var k='scrollPos:'+location.pathname;var s=sessionStorage.getItem(k);var hasSaved=s!==null&&!isNaN(Number(s));var hasHash=!!location.hash;if(!hasSaved&&!hasHash){return;}var de=document.documentElement;de.style.visibility='hidden';var done=false;function restore(){if(done){return;}done=true;try{if(hasSaved){window.scrollTo(0,Number(s));}else if(hasHash){var el=document.querySelector(location.hash);if(el){el.scrollIntoView();}}}catch(e){}requestAnimationFrame(function(){de.style.visibility='';});}if(document.readyState!=='loading'){restore();}else{document.addEventListener('DOMContentLoaded',restore);}setTimeout(restore,1500);}catch(e){document.documentElement.style.visibility='';}})();`,
            }}
          />
          <Favicon />
          <Font />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="color-gray--slate bg-white [--line-color:theme(colors.gray.200/0.8)] d:bg-gray-900 d:bg-gradient-to-b d:from-black/40 d:to-black/40">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Root;
