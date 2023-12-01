
const lunatag =  "../../assets/Tellmann.jpg"

export interface Project {
    name: string;
    type: string[];
    tech: TECH[];
    url: string;
    repository: string;
    description: string;
    content: string;
    featuredImage: string;
    year: string;
  }
  
  export enum TECH {
    typescript = "TypeScript",
    vercel = "Vercel",
    nextjs = "Next.js",
    reactjs = "React.js",
    tailwindcss = "Tailwind CSS",
    prisma = "Prisma",
    planetscale = "PlanetScale",
    trpc = "TRPC",
    jsdom = "JSDOM",
  }

  export enum PORTFOLIO {
    pre= "Projects",
    heading= "Some Things I’ve Built",
  };
  
  
  export const PROJECTS: Project[] = [
    {
      name: "Lunatag",
      type: ["Shopify Apps"],
      tech: [
        TECH.typescript,
        TECH.vercel,
        TECH.nextjs,
        TECH.reactjs,
        TECH.tailwindcss,
        TECH.prisma,
        TECH.planetscale,
        TECH.trpc,
        TECH.jsdom,
      ],
      url: "https://apps.shopify.com/lunatag",
      repository: "",
      description: `I've created a Shopify App that allows users to add Tags to any image on their Shopify site to upsell products. The app is available on the Shopify App store and works for all Shopify themes.`,
      content: `
        <p>
          I build LunaTag together with @LizT as a solution to create shoppable images anywhere on a
          Shopify hosted site. The apps interface fully integrates into a Shopify backend.
        </p>
        <p>
          The project had several core challenges: Iframe Proxying, Image tagging stacking context,
          reverse dom selectors, serverless Shopify app authentication.
        </p>
      `,
      featuredImage: lunatag, // Replace with the path to the featured image
      year: "2022",
    },
    {
        name: "ClickUpload",
        type: ["Shopify Apps"],
        tech: [
          TECH.typescript,
          TECH.vercel,
          TECH.nextjs,
          TECH.reactjs,
          TECH.tailwindcss,
          TECH.prisma,
          TECH.planetscale,
          TECH.trpc,
        //   TECH.aws,
        //   TECH.turborepo,
        ],
        url: "https://apps.shopify.com/click-upload",
        repository: "",
        description: `ClickUpload enables Shopify store owners to let customers upload files to their orders. The Shopify App supports all file types and sizes. All files are linked to the order and can be downloaded easily.`,
        content: `
          
            <p>
              I build ClickUpload together with @LizT in order to allow merchants add file Upload
              capabilities to their Shopify site. The apps interface fully integrates into a Shopify
              backend.
            </p>
          
        `,
        featuredImage: lunatag,
        year: "2021",
      },
      {
        name: "Kids Living",
        type: ["Ecommerce Sites", "Integrations"],
        tech: [ TECH.typescript,
            TECH.vercel,
            TECH.nextjs,
            TECH.reactjs,],
        url: "https://kidsliving.co.za",
        repository: "",
        description: `Large scale Ecommerce website for a South African based client with 3 brick & mortar locations and over 3000 products.`,
        content:   `
          
            <p>
              I have worked with Kids Living since 2017 as their Ecommerce success partner covering
              everything from web development, inventory management, and marketing to custom API
              integrations.
            </p>
          
        `,
        featuredImage: lunatag,
        year: "2017",
      },
      {
        name: "Lunalemon",
        type: ["Marketing Sites"],
        tech: [
          TECH.typescript,
          TECH.trpc,
          TECH.tailwindcss,
          TECH.nextjs,
          TECH.vercel,
          TECH.planetscale,
        ],
        description:
          "Headless Web agency site utilizing Shopify's theme editor as a custom CMS. The site showcases my client oriented projects and promotes web development services.",
        featuredImage: lunatag,
        year: "2022",
        url: "https://kidsliving.co.za",
        repository: "https://github.com/FelixTellmann/lunalemon.dev",
        content:   `
          
        <p>
          I have worked with Kids Living since 2017 as their Ecommerce success partner covering
          everything from web development, inventory management, and marketing to custom API
          integrations.
        </p>
      
    `,
      },
      {
        name: "shopify-ftp-access",
        type: ["Devtools"],
        tech: [
            TECH.typescript,
            TECH.trpc,
            TECH.tailwindcss,
            TECH.nextjs,
            TECH.vercel,
            TECH.planetscale,
          ],
        year: "2017",
        repository: "https://github.com/FelixTellmann/shopify-ftp-access",
        description:
          "Shopify-ftp-access is an Open Source utility which acts as a proxy that allows you to use any FTP program while running the CLI to connect upload/download any shopify Theme files",
        featuredImage: lunatag,
        content:   `
          
        <p>
          I have worked with Kids Living since 2017 as their Ecommerce success partner covering
          everything from web development, inventory management, and marketing to custom API
          integrations.
        </p>   
    `,
    url: "https://kidsliving.co.za",
      },
      {
        name: "Erply Egypt eInvoicing API",
        type: ["Integrations"],
        tech: [TECH.nextjs],
        year: "2022",
        description:
          "This custom App runs on 5 min Cron Job to process any incoming sales data for a retail chain in Egypt, processing each invoice on the eInvoicing portal. The app includes an internal dashboard for any manual processing required.",
        featuredImage: lunatag,
        content:   `
          
        <p>
          I have worked with Kids Living since 2017 as their Ecommerce success partner covering
          everything from web development, inventory management, and marketing to custom API
          integrations.
        </p>   
    `,
    url: "https://kidsliving.co.za",
    repository: "https://github.com/FelixTellmann/shopify-ftp-access",
      },
      {
        name: "Zoom Printing",
        type: ["Ecommerce Sites"],
        tech: [TECH.typescript, TECH.tailwindcss],
        year: "2021",
        url: "https://www.zoomprinting.ca/",
        description:
          "I've built the Shopify site based on the Warehouse theme, with lots of custom integrations to enable up to 1000 product variants and add-on sales. I've migrated the client from a old legacy self-hosted server, building my own web-scrapers along the way.",
        featuredImage: lunatag,
        repository: "https://github.com/FelixTellmann/shopify-ftp-access",
        content:   `
          
        <p>
          I have worked with Kids Living since 2017 as their Ecommerce success partner covering
          everything from web development, inventory management, and marketing to custom API
          integrations.
        </p>   
    `,
      },
    //   {
    //     name: "Vend Takealot API",
    //     type: ["Integrations"],
    //     tech: [TECH.nextjs, TECH.aws_lambda, TECH.axios, TECH.vend],
    //     year: "2021",
    //     description:
    //       "Similar to the Erply Takealot integration, this app runs a scheduled script to ensure that sales & inventory levels are synchronized between two sales channels.",
    //     featuredImage: VendTakealot,
    //   },
    //   {
    //     name: "Aiko",
    //     type: ["Ecommerce Sites"],
    //     tech: [TECH.figma, TECH.shopify, TECH.tailwindcss, TECH.typescript],
    //     year: "2022",
    //     url: "https://aikoplanet.com/",
    //     description:
    //       "I built a fully custom designed Shopify site, utilizing shopify-cms in a non-headless way, to ensure type safety throughout the project using Shopify Liquid templates.",
    //     featuredImage: Aiko,
    //   },
     
     
    // Add more project objects as needed
  ];