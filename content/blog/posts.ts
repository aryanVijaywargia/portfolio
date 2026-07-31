export type BlogPost = {
  number: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  dateTime: string;
  readTime: string;
  label: string;
  topics: string[];
};

export const TEMP_BLOG_POST: BlogPost = {
  number: "01",
  slug: "the-work-between-the-demos",
  title: "The work between the demos",
  excerpt:
    "The flashy part of software gets the screenshot. The quiet systems underneath are what make it useful.",
  publishedAt: "July 26, 2026",
  dateTime: "2026-07-26",
  readTime: "4 min read",
  label: "Temporary field note",
  topics: ["Engineering", "Reliability", "Building"],
};

export const BLOG_POSTS: BlogPost[] = [TEMP_BLOG_POST];
