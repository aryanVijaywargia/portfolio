import { ArrowUpRightIcon } from "@heroicons/react/24/solid";
import { BlogBackground } from "components/blog/blog-background";
import { ReadingProgress } from "components/blog/reading-progress";
import { Link } from "components/link";
import { BLOG_POSTS } from "content/blog/posts";
import { BLOG_SEO } from "content/seo";
import { motion, useReducedMotion } from "framer-motion";
import { NextSeo } from "next-seo";
import { FC } from "react";

const BlogIndex: FC = () => {
  const reduceMotion = useReducedMotion();
  const enter = (delay = 0) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduceMotion ? 0 : 0.65, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <>
      <NextSeo
        title={BLOG_SEO.title}
        description={BLOG_SEO.description}
        openGraph={BLOG_SEO.openGraph}
      />
      <ReadingProgress />
      <div className="relative overflow-hidden pt-20 text-gray-900 d:text-white">
        <BlogBackground />

        <section className="mx-auto min-h-[calc(100svh-5rem)] max-w-6xl px-4 pb-20 pt-12 md:px-8 md:pb-24 md:pt-16">
          <div className="grid gap-8 border-b border-gray-300 pb-9 lg:grid-cols-[1fr_19rem] lg:items-end d:border-gray-700/80">
            <div>
              <motion.p
                {...enter(0.05)}
                className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600 d:text-sky-400"
              >
                Field notes · Vol. 01
              </motion.p>
              <motion.h1
                {...enter(0.12)}
                className="max-w-4xl text-[clamp(4rem,8.5vw,7.5rem)] font-bold leading-[0.8] tracking-[-0.075em]"
              >
                Writing<span className="text-sky-500">.</span>
              </motion.h1>
            </div>

            <motion.div {...enter(0.24)} className="max-w-xs pb-1 lg:justify-self-end">
              <p className="text-base leading-relaxed text-gray-500 d:text-gray-400">
                Notes on software, reliable systems, and the parts of building that are worth
                remembering.
              </p>
            </motion.div>
          </div>

          <motion.div {...enter(0.3)} className="mt-9 md:mt-11">
            <div className="mb-4 flex items-baseline justify-between gap-4">
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 d:text-gray-400">
                Latest notes
              </h2>
              <span className="font-mono text-[11px] text-gray-400">
                {BLOG_POSTS.length.toString().padStart(2, "0")} published
              </span>
            </div>

            <div className="border-t border-gray-300 d:border-gray-700">
              {BLOG_POSTS.map((post, index) => (
                <motion.div
                  key={post.slug}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, delay: 0.36 + index * 0.08 }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid gap-4 border-b border-gray-300 py-6 transition-colors hfa:border-sky-400 md:grid-cols-[3rem_1fr_10rem_2rem] md:items-center md:gap-8 md:py-8 d:border-gray-700 d:hfa:border-sky-500"
                  >
                    <span className="font-mono text-xs text-gray-400">{post.number}</span>
                    <span>
                      <span className="mb-1.5 block text-2xl font-semibold tracking-[-0.035em] transition-transform duration-300 group-hfa:translate-x-1 md:text-3xl">
                        {post.title}
                      </span>
                      <span className="block max-w-2xl text-sm leading-relaxed text-gray-500 d:text-gray-400 md:text-base">
                        {post.excerpt}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-gray-400">
                      {post.publishedAt}
                      <br />
                      {post.readTime}
                    </span>
                    <ArrowUpRightIcon className="h-5 w-5 text-gray-400 transition-all duration-300 group-hfa:-translate-y-1 group-hfa:translate-x-1 group-hfa:text-sky-500" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="border-t border-gray-200 d:border-gray-800">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-[1fr_auto] md:items-center md:px-8 md:py-20">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-sky-600 d:text-sky-400">
                Continue the conversation
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                Found an idea worth arguing with?
              </h2>
            </div>
            <Link
              href="mailto:aryanvijaywargia@gmail.com"
              className="inline-flex min-h-[44px] w-fit items-center gap-2 border-b border-gray-900 text-sm font-semibold transition-colors hfa:border-sky-500 hfa:text-sky-600 d:border-white d:hfa:text-sky-400"
            >
              Send me a note <ArrowUpRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default BlogIndex;
