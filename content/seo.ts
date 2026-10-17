// next.config.js supplies this from the shared site.config.js build setting.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
const sharingImage = {
  url: `${siteUrl}/images/sharing-image.jpg`,
  alt: "Aryan Vijaywargia - Senior Software Engineer",
  width: 1200,
  height: 630,
  type: "image/jpeg",
};

export const SEO = {
  title: "Aryan Vijaywargia - Senior Software Engineer · Go, C#, .NET, TypeScript, Python",
  url: siteUrl,
  description:
    "Senior Software Engineer at GEP Worldwide. I build agentic runtimes, search platforms, and durable execution engines. Creator of Continua.",
  siteName: "Aryan Vijaywargia",
  github: "https://github.com/aryanVijaywargia",
  avatar: "https://avatars.githubusercontent.com/aryanVijaywargia",
  author: "Aryan Vijaywargia",
  twitter: {
    handle: "@AryanVijaywargia",
    site: "@AryanVijaywargia",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    { name: "twitter:image", content: sharingImage.url },
    { name: "twitter:image:alt", content: sharingImage.alt },
  ],
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: siteUrl,
    site_name: "Aryan Vijaywargia",
    title: "Aryan Vijaywargia",
    description:
      "Senior Software Engineer · Go, C#, .NET, TypeScript, Python · Agentic runtimes, search platforms, durable execution.",
    images: [sharingImage],
  },
};

export const BLOG_SEO = {
  title: "Aryan Vijaywargia - Blog",
  description:
    "Writing about durable execution, agentic runtimes, search platforms, CDC, and the systems that make AI agents reliable.",
  openGraph: {
    title: "Aryan Vijaywargia - Blog",
    description:
      "Writing about durable execution, agentic runtimes, search platforms, CDC, and the systems that make AI agents reliable.",
  },
};
