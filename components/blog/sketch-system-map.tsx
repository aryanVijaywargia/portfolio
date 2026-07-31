import { motion, useReducedMotion } from "framer-motion";
import { FC } from "react";

const inkPath = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

export const SketchSystemMap: FC = () => {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? "visible" : "hidden";
  const transition = (delay: number) => ({
    duration: reduceMotion ? 0 : 0.75,
    delay: reduceMotion ? 0 : delay,
    ease: "easeInOut",
  });

  return (
    <figure className="relative mx-auto w-full max-w-[42rem]" aria-labelledby="system-map-caption">
      <svg
        viewBox="0 0 640 430"
        role="img"
        aria-label="A hand-drawn diagram contrasting a simple software demo with the reliability systems behind it"
        className="h-auto w-full overflow-visible text-gray-800 d:text-gray-100"
      >
        <defs>
          <filter id="sketch-wobble" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence baseFrequency="0.015" numOctaves="2" seed="8" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.4" />
          </filter>
        </defs>

        <motion.path
          d="M32 23 C148 10 490 15 608 28 C624 119 619 325 603 408 C448 421 151 418 29 402 C17 297 18 115 32 23Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={inkPath}
          initial={initial}
          animate="visible"
          transition={transition(0.05)}
          opacity="0.8"
          filter="url(#sketch-wobble)"
        />
        <motion.path
          d="M37 19 C190 25 478 9 613 33"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinecap="round"
          variants={inkPath}
          initial={initial}
          animate="visible"
          transition={transition(0.15)}
          opacity="0.35"
        />

        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.2 }}
        >
          <text
            x="58"
            y="64"
            fill="currentColor"
            fontFamily="Caveat, Comic Sans MS, cursive"
            fontSize="23"
            fontWeight="600"
          >
            the part everyone sees
          </text>
          <text
            x="519"
            y="56"
            fill="#38bdf8"
            fontFamily="Caveat, Comic Sans MS, cursive"
            fontSize="20"
            transform="rotate(4 519 56)"
          >
            looks easy!
          </text>
        </motion.g>

        <motion.path
          d="M87 81 C204 74 439 77 551 86 C558 110 557 146 548 166 C430 176 196 174 89 164 C78 142 78 105 87 81Z"
          fill="rgb(56 189 248 / 0.12)"
          stroke="#38bdf8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={inkPath}
          initial={initial}
          animate="visible"
          transition={transition(0.35)}
          filter="url(#sketch-wobble)"
        />
        <motion.g
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.65 }}
          style={{ transformOrigin: "320px 126px" }}
        >
          <text
            x="126"
            y="134"
            fill="currentColor"
            fontFamily="Inter, sans-serif"
            fontSize="22"
            fontWeight="650"
          >
            request
          </text>
          <text
            x="273"
            y="135"
            fill="#38bdf8"
            fontFamily="Caveat, Comic Sans MS, cursive"
            fontSize="38"
          >
            →
          </text>
          <text
            x="353"
            y="134"
            fill="currentColor"
            fontFamily="Inter, sans-serif"
            fontSize="22"
            fontWeight="650"
          >
            answer ✦
          </text>
        </motion.g>

        <motion.path
          d="M322 179 C319 195 320 202 321 218 M314 208 L321 220 L329 208"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={inkPath}
          initial={initial}
          animate="visible"
          transition={transition(0.85)}
        />
        <motion.text
          x="347"
          y="210"
          fill="currentColor"
          fontFamily="Caveat, Comic Sans MS, cursive"
          fontSize="22"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 0.62 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, delay: reduceMotion ? 0 : 1.05 }}
        >
          the invisible bit
        </motion.text>

        {[
          { x: 55, label: "state", detail: "remember" },
          { x: 230, label: "retries", detail: "recover" },
          { x: 441, label: "humans", detail: "interrupt" },
        ].map((node, index) => (
          <motion.g
            key={node.label}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.4,
              delay: reduceMotion ? 0 : 1.15 + index * 0.12,
            }}
          >
            <path
              d={`M${node.x + 7} 240 C${node.x + 43} 233 ${node.x + 111} 236 ${node.x + 136} 243 C${
                node.x + 141
              } 267 ${node.x + 139} 302 ${node.x + 132} 319 C${node.x + 96} 325 ${
                node.x + 35
              } 324 ${node.x + 5} 316 C${node.x - 3} 290 ${node.x - 2} 260 ${node.x + 7} 240Z`}
              fill="rgb(148 163 184 / 0.06)"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#sketch-wobble)"
            />
            <text
              x={node.x + 70}
              y="275"
              textAnchor="middle"
              fill="currentColor"
              fontFamily="Inter, sans-serif"
              fontSize="18"
              fontWeight="650"
            >
              {node.label}
            </text>
            <text
              x={node.x + 70}
              y="300"
              textAnchor="middle"
              fill="currentColor"
              opacity="0.55"
              fontFamily="Caveat, Comic Sans MS, cursive"
              fontSize="19"
            >
              {node.detail}
            </text>
          </motion.g>
        ))}

        <motion.path
          d="M198 276 C210 271 218 273 227 277 M215 269 L228 277 L215 285 M373 276 C396 270 413 271 433 277 M421 268 L435 277 L421 286"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={inkPath}
          initial={initial}
          animate="visible"
          transition={transition(1.45)}
        />

        <motion.path
          d="M137 329 C188 348 432 345 504 329 M138 334 C231 357 420 356 505 333"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeDasharray="7 8"
          strokeLinecap="round"
          variants={inkPath}
          initial={initial}
          animate="visible"
          transition={transition(1.6)}
          opacity="0.55"
        />
        <motion.g
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 1.9 }}
        >
          <path
            d="M176 354 C250 347 386 349 461 356 C469 371 468 392 459 401 C378 408 254 407 177 399 C169 385 169 369 176 354Z"
            fill="rgb(56 189 248 / 0.1)"
            stroke="#38bdf8"
            strokeWidth="2"
            filter="url(#sketch-wobble)"
          />
          <text
            x="319"
            y="384"
            textAnchor="middle"
            fill="currentColor"
            fontFamily="Caveat, Comic Sans MS, cursive"
            fontSize="24"
            fontWeight="600"
          >
            history makes it trustworthy
          </text>
        </motion.g>
      </svg>
      <figcaption id="system-map-caption" className="sr-only">
        The polished request-to-answer demo depends on remembered state, retries, human
        interruptions, and durable history.
      </figcaption>
    </figure>
  );
};
