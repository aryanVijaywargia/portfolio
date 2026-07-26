import dynamic from "next/dynamic";
import Link from "next/link";
import { NextSeo } from "next-seo";
import { FC } from "react";

const BoringHome = dynamic(
  () => import("components/boring/boring-home").then((module) => module.BoringHome),
  {
    ssr: false,
    loading: () => (
      <section className="boring-route-loading" aria-live="polite" aria-busy="true">
        <div>
          <span>BHOPAL DISPATCH</span>
          <h1>BORING MODE</h1>
          <p>Loading the offline city map and game systems…</p>
          <div className="boring-loading-track">
            <i />
          </div>
          <p className="boring-loading-controls">
            WASD / arrows · E interact · P pause · touch ready
          </p>
          <Link href="/">
            <a>Exit to portfolio</a>
          </Link>
        </div>
      </section>
    ),
  }
);

const BoringPage: FC = () => (
  <>
    <NextSeo
      title="Boring Mode — A Bhopal Portfolio Adventure"
      description="Explore Aryan Vijaywargia's systems, search, and AI work in an original cel-shaded Bhopal portfolio game."
      canonical="https://aryanvijaywargia.com/boring"
      openGraph={{
        title: "Boring Mode — A Bhopal Portfolio Adventure",
        description:
          "An original, peaceful, angled open-world portfolio adventure through central Bhopal.",
        url: "https://aryanvijaywargia.com/boring",
      }}
    />
    <BoringHome />
  </>
);

export default BoringPage;
