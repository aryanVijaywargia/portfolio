import { ArrowDownTrayIcon, EnvelopeIcon } from "@heroicons/react/24/solid";
import { SiGithub } from "@react-icons/all-files/si/SiGithub";
import { SiLinkedin } from "@react-icons/all-files/si/SiLinkedin";
import { SiTwitter } from "@react-icons/all-files/si/SiTwitter";
import { Link } from "components/link";

import clsx from "clsx";
import { HoverEffect } from "components/layout/header.desktop-nav.hover-effect";
import { ResumeFooter } from "components/resume/resume-mobile-footer";
import { ResumeSection } from "components/resume/resume-section";
import { ResumeSectionDateSidebar } from "components/resume/resume-section-data-sidebar";
import { ResumeSectionDateEvents } from "components/resume/resume-section-date-events";
import { useResumeSectionInView } from "components/resume/use-resume-section-in-view";
import { CV } from "content/cv";
import { FC, useEffect, useState } from "react";
import { capitalize } from "utils/capitalize";
import { scrollToY } from "utils/scroll-to";

const RESUME_PDF_PATH = "/resume/aryan-vijaywargia-resume.pdf";
const RESUME_PDF_FILENAME = "Aryan-Vijaywargia-Resume.pdf";

export const Resume: FC = (props) => {
  const { sections, filter, showSection, selectFilter } = useResumeSectionInView();
  const [inView, setInView] = useState("intro");
  const [hasResumePdf, setHasResumePdf] = useState(false);

  useEffect(() => {
    for (const key in sections) {
      const val = sections[key];
      if (!val.showing) continue;

      if (val.centerVisible && val.fullyVisible) {
        setInView(key);
        break;
      }

      if (val.fullyVisible) {
        setInView(key);
        break;
      }

      if (val.centerVisible) {
        setInView(key);
        break;
      }
      setInView("");
    }
  }, [sections]);

  useEffect(() => {
    let active = true;

    fetch(RESUME_PDF_PATH, { method: "HEAD" })
      .then((response) => {
        if (active) {
          setHasResumePdf(response.ok);
        }
      })
      .catch(() => {
        if (active) {
          setHasResumePdf(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <table className="margin-0 padding-0 relative block min-h-screen appearance-none border-none text-gray-900 print:!table [&_td]:p-0">
      <thead className=" hidden w-full print:!table-header-group">
        <tr>
          <th className="flex w-[1024px] pb-4 text-left font-normal">
            <header className="">
              <h1 className="text-4xl font-extrabold tracking-tight">{CV.name}</h1>
              <h2 className="flex gap-1 ">
                <span className="font-semibold tracking-tight text-gray-500">{CV.title} - </span>
                {CV.primary_stack.map(({ name, Icon }) => (
                  <span key={name} className="mx-1 flex items-center gap-1 text-gray-500">
                    <Icon className="h-4 w-4" />
                    {name}
                  </span>
                ))}
              </h2>
            </header>
            <div className="ml-auto mt-1 mt-auto flex-1 items-end justify-end text-right text-[15px] text-gray-500 spacing-0">
              <div>
                <Link href={`tel:${CV.mobile.href}`}>{CV.mobile.number}</Link>
                <span> - </span>
                <Link href={`mailto:${CV.email}`}>{CV.email}</Link>
              </div>
              <div>
                <Link href={CV.website}>{CV.website.replace("https://", "")}</Link>
                <span> - </span>
                <Link href="https://github.com/AryanVijaywargia">github.com/AryanVijaywargia</Link>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tfoot className="fixed inset-x-0 bottom-0 hidden w-full text-center print:!table-footer-group">
        <tr>
          <th>
            <small className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-1 pt-3 text-[13px] font-medium tracking-tight text-gray-400">
              View full resume at <Link href="https://aryancodes.com">www.aryancodes.com</Link>
            </small>
          </th>
        </tr>
      </tfoot>
      <tbody className="block print:table-row-group print:!h-screen print:!min-h-screen">
        <tr className="block print:!table-row">
          <td className="block print:!table-cell">
            <article className="relative mx-auto mb-16 grid max-w-6xl gap-12 px-4 py-16 print:!flex print:!py-0 print:!pl-24 md:px-8 lg:grid-cols-[1fr_200px] print:[&_*]:![-webkit-print-color-adjust:exact] print:[&_*]:![color-adjust:exact] print:[&_*]:![print-color-adjust:exact]">
              {hasResumePdf
                ? <div className="flex justify-center print:!hidden lg:col-span-2 lg:justify-end">
                    <a
                      href={RESUME_PDF_PATH}
                      download={RESUME_PDF_FILENAME}
                      className="button-border inline-flex w-full items-center justify-center gap-2 whitespace-nowrap bg-white/90 px-4 py-2 text-sm font-medium tracking-tight text-gray-600 transition-all hfa:border-gray-900/70 hfa:bg-white hfa:text-gray-900 d:border-gray-700/80 d:bg-gray-900/40 d:text-gray-300 d:hfa:border-gray-200/30 d:hfa:bg-gray-900/80 d:hfa:text-gray-50 sm:w-auto"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      Download PDF
                    </a>
                  </div>
                : null}
              <main className="snap-y snap-normal spacing-10">
                <ResumeSection title="Intro" className="break-inside-avoid print:!max-w-3xl">
                  <p className="text-[15px] leading-relaxed text-gray-500 d:text-gray-300 d:text-gray-300 print:!-ml-24 print:!max-w-3xl print:!text-base">
                    {CV.intro}
                  </p>
                </ResumeSection>
                <ResumeSection
                  title="Experience"
                  className={clsx(
                    !CV.experience.filter(({ type }) => type.includes(filter) || filter === "all")
                      .length && "!hidden"
                  )}
                >
                  <div className="spacing-8">
                    {CV.experience
                      .sort((a, b) => {
                        if (new Date(a.dateFrom) < new Date(b.dateFrom)) return 1;
                        if (new Date(a.dateFrom) > new Date(b.dateFrom)) return -1;
                        return 0;
                      })
                      .filter(({ type }) => type.includes(filter) || filter === "all")
                      .map(
                        (
                          {
                            dateFrom,
                            dateTo,
                            city,
                            country,
                            title,
                            responsibilities,
                            company,
                            description,
                            type,
                          },
                          index,
                          arr
                        ) => {
                          return (
                            <section
                              className="relative mb-auto break-inside-avoid-page"
                              key={index}
                            >
                              <div className="relative flex">
                                <ResumeSectionDateSidebar
                                  dateFrom={dateFrom}
                                  dateTo={dateTo}
                                  showDateRange
                                  isLast={index === arr.length - 1}
                                />

                                <ResumeSectionDateEvents
                                  name={title}
                                  organization={company}
                                  city={city}
                                  country={country}
                                  dateFrom={dateFrom}
                                  dateTo={dateTo}
                                  showDateRange
                                  description={description}
                                  responsibilities={responsibilities}
                                />
                              </div>
                            </section>
                          );
                        }
                      )}
                  </div>
                </ResumeSection>
                <ResumeSection
                  className={clsx(
                    "break-inside-avoid",
                    !CV.eduction.filter(({ type }) => type.includes(filter) || filter === "all")
                      .length && "!hidden"
                  )}
                  title="Education"
                >
                  <div className="spacing-8">
                    {CV.eduction
                      .sort((a, b) => {
                        if (new Date(a.dateFrom) < new Date(b.dateFrom)) return 1;
                        if (new Date(a.dateFrom) > new Date(b.dateFrom)) return -1;
                        return 0;
                      })
                      .filter(({ type }) => type.includes(filter) || filter === "all")
                      .map(
                        (
                          { dateFrom, dateTo, city, country, institution, certificate, level },
                          index,
                          arr
                        ) => {
                          return (
                            <section className="relative flex" key={index}>
                              <ResumeSectionDateSidebar
                                dateFrom={dateFrom}
                                dateTo={dateTo}
                                showDateRange={false}
                                isLast={index === arr.length - 1}
                              />

                              <ResumeSectionDateEvents
                                name={certificate}
                                organization={institution}
                                city={city}
                                country={country}
                                dateFrom={dateFrom}
                                dateTo={dateTo}
                                showDateRange={false}
                                description=""
                                responsibilities={[]}
                              />
                            </section>
                          );
                        }
                      )}
                  </div>
                </ResumeSection>
                <ResumeSection className="break-inside-avoid" title="Capabilities">
                  <div className="spacing-8 print:!-ml-24 print:!spacing-3">
                    <section className="relative max-w-prose spacing-1 print:!grid print:!max-w-3xl print:!grid-cols-[140px_1fr]">
                      <h3 className="items-baseline text-sm tracking-tight spacing-1 ">
                        <strong className="text-[17px] font-bold text-gray-900 d:text-gray-100 print:!text-sm print:!font-semibold ">
                          Languages
                        </strong>
                      </h3>
                      <p className="text-sm text-gray-500 marker:text-gray-400 d:text-gray-300/80 d:marker:text-gray-600 print:!mt-0">
                        {CV.capabilities.languages
                          .map((language, index) => language.name)
                          .join(", ")}
                      </p>
                    </section>
                    <section className="relative max-w-prose spacing-1 print:!grid print:!max-w-3xl print:!grid-cols-[140px_1fr]">
                      <h3 className="items-baseline text-sm tracking-tight spacing-1 ">
                        <strong className="text-[17px] font-bold text-gray-900 d:text-gray-100 print:!text-sm print:!font-semibold ">
                          Programming Languages
                        </strong>
                      </h3>
                      <p className="text-sm text-gray-500 marker:text-gray-400 d:text-gray-300/80 d:marker:text-gray-600 print:!mt-0">
                        {CV.capabilities.programmingLanguages
                          .map((language, index) => language.name)
                          .join(", ")}
                      </p>
                    </section>
                    <section className="relative max-w-prose spacing-1 print:!grid print:!max-w-3xl print:!grid-cols-[140px_1fr]">
                      <h3 className="items-baseline text-sm tracking-tight spacing-1 ">
                        <strong className="text-[17px] font-bold text-gray-900 d:text-gray-100 print:!text-sm print:!font-semibold ">
                          Libraries & Frameworks
                        </strong>
                      </h3>
                      <p className="text-sm text-gray-500 marker:text-gray-400 d:text-gray-300/80 d:marker:text-gray-600 print:!mt-0">
                        {CV.capabilities.librariesFrameworks
                          .map((language, index) => language.name)
                          .join(", ")}
                      </p>
                    </section>
                    <section className="relative max-w-prose spacing-1 print:!grid print:!max-w-3xl print:!grid-cols-[140px_1fr]">
                      <h3 className="items-baseline text-sm tracking-tight spacing-1 ">
                        <strong className="text-[17px] font-bold text-gray-900 d:text-gray-100 print:!text-sm print:!font-semibold ">
                          Service Providers
                        </strong>{" "}
                      </h3>
                      <p className="text-sm text-gray-500 marker:text-gray-400 d:text-gray-300/80 d:marker:text-gray-600 print:!mt-0">
                        {CV.capabilities.serviceProviders
                          .map((language, index) => language.name)
                          .join(", ")}
                      </p>
                    </section>
                    <section className="relative max-w-prose spacing-1 print:!grid print:!max-w-3xl print:!grid-cols-[140px_1fr]">
                      <h3 className="items-baseline text-sm tracking-tight spacing-1 ">
                        <strong className="text-[17px] font-bold text-gray-900 d:text-gray-100 print:!text-sm print:!font-semibold ">
                          Content Platforms
                        </strong>{" "}
                      </h3>
                      <p className="text-sm text-gray-500 marker:text-gray-400 d:text-gray-300/80 d:marker:text-gray-600 print:!mt-0">
                        {CV.capabilities.dataProviders
                          .map((language, index) => language.name)
                          .join(", ")}
                      </p>
                    </section>
                    <section className="relative max-w-prose spacing-1 print:!grid print:!max-w-3xl print:!grid-cols-[140px_1fr]">
                      <h3 className="items-baseline text-sm tracking-tight spacing-1 ">
                        <strong className="text-[17px] font-bold text-gray-900 d:text-gray-100 print:!text-sm print:!font-semibold ">
                          Tools
                        </strong>{" "}
                      </h3>
                      <p className="text-sm text-gray-500 marker:text-gray-400 d:text-gray-300/80 d:marker:text-gray-600 print:!mt-0">
                        {CV.capabilities.tools.map((language, index) => language.name).join(", ")}
                      </p>
                    </section>
                  </div>
                </ResumeSection>
                <ResumeSection
                  className={clsx(
                    "break-inside-avoid",
                    !CV.certifications.filter(
                      ({ type }) => type.includes(filter) || filter === "all"
                    ).length && "!hidden"
                  )}
                  title="Certifications"
                >
                  <div className="spacing-6 print:!-ml-24">
                    <section>
                      <ul className="text-sm text-gray-500 marker:text-gray-400 d:text-gray-300/80 d:marker:text-gray-600">
                        {CV.certifications
                          .sort((a, b) => {
                            if (new Date(a.date) < new Date(b.date)) return 1;
                            if (new Date(a.date) > new Date(b.date)) return -1;
                            return 0;
                          })
                          .filter(({ type }) => type.includes(filter) || filter === "all")
                          .map(({ date, name, type }, index, arr) => (
                            <li className="" key={index}>
                              <span className="inline-flex items-baseline gap-2">
                                <span className="text-xs font-medium leading-[16px] text-gray-400 d:text-gray-500 print:!text-sm">
                                  {date}
                                </span>
                                <span className="select-none text-sm text-gray-300 print:!text-gray-500">
                                  -
                                </span>
                                <span className="print:!text-base">{name}</span>
                              </span>
                            </li>
                          ))}
                      </ul>
                    </section>

                    {["all", "restaurant"].includes(filter)
                      ? <section className="relative max-w-prose spacing-1">
                          <h3 className="items-baseline text-sm tracking-tight spacing-1 ">
                            <strong className="text-[17px] font-bold text-gray-900 d:text-gray-100">
                              Other
                            </strong>{" "}
                          </h3>
                          <ul className="list-outside list-disc pl-4 text-sm text-gray-500 marker:text-gray-400 d:text-gray-300/80 d:marker:text-gray-600">
                            {CV.other.map(({ name }, index) => (
                              <li className="pl-3" key={index}>
                                {name}
                              </li>
                            ))}
                          </ul>
                        </section>
                      : null}
                  </div>
                </ResumeSection>

                <ResumeSection className="break-inside-avoid print:!hidden" title="References">
                  <div className="spacing-10">
                    {CV.references.map(({ author, company, title, reference }) => (
                      <figure key={author} className="max-w-prose spacing-2">
                        <blockquote className="text-[15px] leading-relaxed text-gray-500 d:text-gray-300/90">
                          {reference}
                        </blockquote>
                        <figcaption className="">
                          <div className="font-semibold">{author}</div>
                          <div className="text-sm text-gray-400">
                            {title} at {company}
                          </div>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </ResumeSection>
                <ResumeSection title="Interests" className="break-inside-avoid">
                  <p className="text-[15px] leading-relaxed text-gray-500 d:text-gray-300 d:text-gray-300 print:!-ml-24 print:!text-base">
                    {CV.personal}
                  </p>
                  <div className="h-24"></div>
                </ResumeSection>
              </main>
              <aside className="top-[144px] mb-auto hidden max-h-min print:!hidden lg:sticky lg:spacing-8">
                <section className="spacing-6 print:!hidden">
                  <nav className="relative whitespace-nowrap text-[15px] font-medium text-gray-300 spacing-0">
                    <HoverEffect className="border-none border-transparent bg-gray-100" />
                    {Object.keys(sections).map((key) => (
                      <Link
                        key={key}
                        className={clsx(
                          "-ml-2 w-min rounded-md px-2 py-1 outline-none transition-all duration-75 hfa:outline-none",
                          inView === key ? "text-sky-500 hf:text-sky-600" : "hf:text-gray-700"
                        )}
                        onClick={() => showSection(key)}
                        href={`#${key}`}
                      >
                        {capitalize(key)}
                      </Link>
                    ))}
                  </nav>
                </section>
                <section className="spacing-2 print:!hidden">
                  <div className="text-[13px] font-medium text-gray-700 d:text-gray-300">
                    Filter view:
                  </div>
                  <nav className="flex flex-wrap gap-1.5">
                    {(
                      [
                        "all",
                        "relevant",
                        "web / tech dev",
                        "management",
                        // "tech support",
                        "entrepreneurial",
                        "restaurant",
                      ] as const
                    ).map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={clsx(
                          "rounded border  px-1.5 py-0.5 text-xs font-medium outline-none hfa:outline-none ",
                          filter.includes(type)
                            ? "border-sky-300 bg-sky-100 text-gray-700 hf:border-sky-400 hf:bg-sky-300/40 hf:text-gray-800 d:border-sky-700 d:bg-sky-900/60 d:text-gray-200 d:hf:bg-sky-700/50 d:hf:text-gray-100"
                            : "border-gray-200 bg-gray-100 text-gray-400 hf:border-gray-300 hf:bg-gray-200 hf:text-gray-700 d:border-gray-700 d:bg-gray-800 d:text-gray-300 d:hf:border-gray-600 d:hf:bg-gray-700 d:hf:text-gray-100"
                        )}
                        onClick={() => {
                          selectFilter(type);
                          scrollToY(150, 0);
                        }}
                      >
                        {type}
                      </button>
                    ))}
                  </nav>
                </section>
                <section className="mt-2 spacing-1 print:!hidden">
                  {/*<h4 className="text-[13px] font-medium text-gray-700">Contact:</h4>*/}
                  <nav className="flex flex-wrap gap-2">
                    <Link
                      href="mailto:aryanvijaywargia@gmail.com"
                      target="_blank"
                      className="rounded p-1 text-gray-400 transition-all duration-75 hf:bg-gray-100 hf:text-gray-700 d:text-gray-300 d:hf:bg-gray-800/80 d:hf:text-gray-200"
                      data-tip="aryanvijaywargia@gmail.com"
                    >
                      <span className="sr-only">Email me</span>
                      <EnvelopeIcon className="h-4 w-4" />
                    </Link>
                    <Link
                      href="https://github.com/AryanVijaywargia"
                      target="_blank"
                      data-tip="Github"
                      className="rounded p-1 text-gray-400 transition-all duration-75 hf:bg-gray-100 hf:text-gray-700 d:text-gray-300 d:hf:bg-gray-800/80 d:hf:text-gray-200"
                    >
                      <span className="sr-only">Github</span>
                      <SiGithub className="h-4 w-4" />
                    </Link>
                    <Link
                      href="https://twitter.com/AryanVijaywargia"
                      target="_blank"
                      data-tip="Twitter"
                      className="rounded p-1 text-gray-400 transition-all duration-75 hf:bg-gray-100 hf:text-gray-700 d:text-gray-300 d:hf:bg-gray-800/80 d:hf:text-gray-200"
                    >
                      <span className="sr-only">Twitter</span>
                      <SiTwitter className="h-4 w-4" />
                    </Link>
                    <Link
                      href="https://www.linkedin.com/in/aryan-vijaywargia"
                      target="_blank"
                      data-tip="LinkedIn"
                      className="rounded p-1 text-gray-400 transition-all duration-75 hf:bg-gray-100 hf:text-gray-700 d:text-gray-300 d:hf:bg-gray-800/80 d:hf:text-gray-200"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <SiLinkedin className="h-4 w-4" />
                    </Link>
                  </nav>
                  <h5 className="ml-1 text-[13px] text-gray-500 d:text-gray-400">India</h5>
                </section>
              </aside>
              <ResumeFooter />
            </article>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Resume;
