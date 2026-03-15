import { FC, useEffect, useRef } from "react";

const contactData = {
  name: "Aryan Vijaywargia",
  role: "Machine Learning Engineer",
  location: "India",
  email: "aryanvijaywargia@gmail.com",
  website: "aryancodes.com",
};

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/AryanVijaywargia",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/aryan-vijaywargia",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "DagsHub",
    url: "https://dagshub.com/aryanVijaywargia",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
];

const backgroundShapes = [
  {
    type: "circle",
    size: 300,
    color: "rgba(34, 211, 238, 0.03)",
    blur: 40,
    duration: 40,
    position: { top: "20%", left: "15%" },
  },
  {
    type: "hexagon",
    size: 200,
    color: "rgba(139, 92, 246, 0.03)",
    blur: 30,
    duration: 35,
    position: { top: "60%", right: "20%" },
  },
];

const FloatingShape: FC<{ shape: typeof backgroundShapes[0]; index: number }> = ({
  shape,
  index,
}) => {
  const ShapeComponent = () => {
    if (shape.type === "circle") {
      return (
        <div
          style={{
            width: shape.size,
            height: shape.size,
            borderRadius: "50%",
            background: shape.color,
            filter: `blur(${shape.blur}px)`,
          }}
        />
      );
    }
    return (
      <div
        style={{
          width: shape.size,
          height: shape.size,
          background: shape.color,
          filter: `blur(${shape.blur}px)`,
          clipPath: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
        }}
      />
    );
  };

  return (
    <div
      className="floating-shape"
      style={{
        position: "absolute",
        ...shape.position,
        animationDuration: `${shape.duration}s`,
      }}
    >
      <ShapeComponent />
    </div>
  );
};

export const Contact: FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        sectionRef.current.style.setProperty("--mouse-x", `${x}%`);
        sectionRef.current.style.setProperty("--mouse-y", `${y}%`);
      }
    };

    // Typewriter effect function
    const typeWriter = (element: HTMLElement, text: string, delay = 0, speed = 150) => {
      return new Promise<void>((resolve) => {
        setTimeout(
          () => {
            let i = 0;
            element.textContent = "";
            const typing = setInterval(
              () => {
                if (i < text.length) {
                  element.textContent += text.charAt(i);
                  i++;
                } else {
                  clearInterval(typing);
                  resolve();
                }
              },
              speed
            );
          },
          delay
        );
      });
    };

    // Desktop notification animation with random directions
    const animateDesktopNotifications = () => {
      const notifications = document.querySelectorAll(".notification");
      const directions = [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
        "left-side",
        "right-side",
      ];

      notifications.forEach((notification, index) => {
        const element = notification as HTMLElement;
        const direction = directions[Math.floor(Math.random() * directions.length)];

        // Position notifications fully visible on screen, avoiding the center card area (30-70% both X and Y)
        let startX, startY, endX, endY;

        switch (direction) {
          case "top-left":
            startX = -50; // Start from outside left
            startY = -30; // Start from above
            endX = 2; // 2% from left edge (always visible)
            endY = 5 + Math.random() * 20; // 5% to 25% from top
            element.style.transform = "translate(-100%, -100%)";
            break;
          case "top-right":
            startX = 150; // Start from outside right
            startY = -30; // Start from above
            endX = 72; // 72% from left (350px notification width = ~25% of 1400px screen, so 72% + 25% = 97%)
            endY = 5 + Math.random() * 20; // 5% to 25% from top
            element.style.transform = "translate(100%, -100%)";
            break;
          case "bottom-left":
            startX = -50; // Start from outside left
            startY = 130; // Start from below
            endX = 2; // 2% from left edge
            endY = 70 + Math.random() * 25; // 70% to 95% from top
            element.style.transform = "translate(-100%, 100%)";
            break;
          case "bottom-right":
            startX = 150; // Start from outside right
            startY = 130; // Start from below
            endX = 72; // 72% from left
            endY = 70 + Math.random() * 25; // 70% to 95% from top
            element.style.transform = "translate(100%, 100%)";
            break;
          case "left-side":
            startX = -50; // Start from outside left
            startY = 30 + Math.random() * 40; // Start from mid-area
            endX = 2; // 2% from left edge
            endY = 30 + Math.random() * 10; // 30% to 40% from top (above center card)
            element.style.transform = "translate(-100%, 0)";
            break;
          case "right-side":
            startX = 150; // Start from outside right
            startY = 30 + Math.random() * 40; // Start from mid-area
            endX = 72; // 72% from left
            endY = 30 + Math.random() * 10; // 30% to 40% from top (above center card)
            element.style.transform = "translate(100%, 0)";
            break;
        }

        element.style.left = `${startX}%`;
        element.style.top = `${startY}%`;
        element.style.zIndex = "50"; // Lower z-index than contact card

        // Slide in animation with much longer spacing (6 seconds between notifications)
        setTimeout(
          () => {
            element.style.left = `${endX}%`;
            element.style.top = `${endY}%`;
            element.style.transform = "translate(0, 0)";
            element.style.opacity = "1";

            // Auto-close after longer delay (8-10 seconds visible)
            setTimeout(
              () => {
                element.style.opacity = "0";
                element.style.transform = "scale(0.8)";
              },
              8000 + Math.random() * 2000
            );
          },
          index * 6000 + Math.random() * 1000
        ); // 6 seconds between notifications
      });
    };

    // Contact info typewriter
    const animateContactInfo = () => {
      const typewriterElements = document.querySelectorAll(".typewriter");
      typewriterElements.forEach((el, index) => {
        const element = el as HTMLElement;
        const text = element.getAttribute("data-text") || "";
        typeWriter(element, text, index * 800, 120); // Slower speed
      });
    };

    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(
              () => {
                animateDesktopNotifications();
              },
              500
            );
            setTimeout(
              () => {
                animateContactInfo();
              },
              1000
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    const section = sectionRef.current;
    if (section) {
      section.addEventListener("mousemove", handleMouseMove);
      observer.observe(section);
      return () => {
        section.removeEventListener("mousemove", handleMouseMove);
        observer.unobserve(section);
      };
    }
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactData.email);
      console.log("Email copied to clipboard");
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const handleEmailHover = (isHovering: boolean) => {
    const avatar = document.querySelector(".avatar-icon");
    const blushLeft = document.querySelector(".blush-left");
    const blushRight = document.querySelector(".blush-right");
    const happyEyesLeft = document.querySelector(".happy-eyes-left");
    const happyEyesRight = document.querySelector(".happy-eyes-right");
    const normalSmile = document.querySelector(".normal-smile");
    const happySmile = document.querySelector(".happy-smile");

    if (
      avatar &&
      blushLeft &&
      blushRight &&
      happyEyesLeft &&
      happyEyesRight &&
      normalSmile &&
      happySmile
    ) {
      if (isHovering) {
        avatar.classList.add("happy");
        (blushLeft as HTMLElement).style.opacity = "1";
        (blushRight as HTMLElement).style.opacity = "1";
        (happyEyesLeft as HTMLElement).style.opacity = "1";
        (happyEyesRight as HTMLElement).style.opacity = "1";
        (normalSmile as HTMLElement).style.opacity = "0";
        (happySmile as HTMLElement).style.opacity = "1";
      } else {
        avatar.classList.remove("happy");
        (blushLeft as HTMLElement).style.opacity = "0";
        (blushRight as HTMLElement).style.opacity = "0";
        (happyEyesLeft as HTMLElement).style.opacity = "0";
        (happyEyesRight as HTMLElement).style.opacity = "0";
        (normalSmile as HTMLElement).style.opacity = "1";
        (happySmile as HTMLElement).style.opacity = "0";
      }
    }
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contactData.name}
TITLE:${contactData.role}
EMAIL:${contactData.email}
URL:https://${contactData.website}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${contactData.name.replace(" ", "_")}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <section
      ref={sectionRef}
      className="contact-section"
      id="contact"
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Background Shapes */}
      <div className="background-shapes">
        {backgroundShapes.map((shape, index) => (
          <FloatingShape key={index} shape={shape} index={index} />
        ))}
      </div>

      {/* Section Header */}
      <header className="mx-auto mb-16 grid w-full max-w-6xl px-4 md:px-8">
        <div className="heading-pre">Contact Card</div>
        <h1 className="heading-2xl -ml-1">Ready to collaborate?</h1>
      </header>

      {/* Desktop Notifications */}
      <div className="desktop-notifications">
        <div className="notification notification-1">
          <div className="notification-content">
            <div className="notification-avatar">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="20" fill="#1DA1F2" />
                <path
                  d="M20 8C13.4 8 8 13.4 8 20C8 26.6 13.4 32 20 32C26.6 32 32 26.6 32 20C32 13.4 26.6 8 20 8ZM25.2 17.2L18.8 23.6C18.4 24 17.8 24 17.4 23.6L14.8 21C14.4 20.6 14.4 20 14.8 19.6C15.2 19.2 15.8 19.2 16.2 19.6L18.1 21.5L23.8 15.8C24.2 15.4 24.8 15.4 25.2 15.8C25.6 16.2 25.6 16.8 25.2 17.2Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="notification-text">
              <div className="notification-username">@portfolio_bot</div>
              <div className="notification-message">
                Thank you for scrolling till the bottom! 🎉
              </div>
              <div className="notification-time">just now</div>
            </div>
          </div>
        </div>
        <div className="notification notification-2">
          <div className="notification-content">
            <div className="notification-avatar">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="20" fill="#00C896" />
                <path
                  d="M20 12C16.7 12 14 14.7 14 18V22C14 25.3 16.7 28 20 28C23.3 28 26 25.3 26 22V18C26 14.7 23.3 12 20 12ZM22 18V22C22 23.1 21.1 24 20 24C18.9 24 18 23.1 18 22V18C18 16.9 18.9 16 20 16C21.1 16 22 16.9 22 18Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="notification-text">
              <div className="notification-username">@dev_insights</div>
              <div className="notification-message">
                Hope you found this portfolio interesting 💻
              </div>
              <div className="notification-time">2m ago</div>
            </div>
          </div>
        </div>
        <div className="notification notification-3">
          <div className="notification-content">
            <div className="notification-avatar">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="20" fill="#FF6B6B" />
                <path
                  d="M20 8C13.4 8 8 13.4 8 20C8 26.6 13.4 32 20 32C26.6 32 32 26.6 32 20C32 13.4 26.6 8 20 8ZM24 21H21V24C21 24.6 20.6 25 20 25C19.4 25 19 24.6 19 24V21H16C15.4 21 15 20.6 15 20C15 19.4 15.4 19 16 19H19V16C19 15.4 19.4 15 20 15C20.6 15 21 15.4 21 16V19H24C24.6 19 25 19.4 25 20C25 20.6 24.6 21 24 21Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="notification-text">
              <div className="notification-username">@collaboration_hub</div>
              <div className="notification-message">Let's build something amazing together 🚀</div>
              <div className="notification-time">5m ago</div>
            </div>
          </div>
        </div>
        <div className="notification notification-4">
          <div className="notification-content">
            <div className="notification-avatar">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect width="40" height="40" rx="20" fill="#9B59B6" />
                <path
                  d="M12 14H28C28.6 14 29 14.4 29 15V25C29 25.6 28.6 26 28 26H12C11.4 26 11 25.6 11 25V15C11 14.4 11.4 14 12 14ZM13 16V24H27V16H13ZM15 18H17V20H15V18ZM19 18H21V20H19V18ZM23 18H25V20H23V18Z"
                  fill="white"
                />
              </svg>
            </div>
            <div className="notification-text">
              <div className="notification-username">@terminal_session</div>
              <div className="notification-message">Connection closed. Goodbye! 👋</div>
              <div className="notification-time">8m ago</div>
            </div>
          </div>
        </div>
      </div>

      {/* Retro Terminal Contact Card */}
      <div className="contact-card">
        {/* Terminal Header */}
        <div className="card-header">
          <div className="header-title">Contact Me</div>
          <div className="header-controls">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Terminal Content */}
        <div className="card-content">
          {/* Avatar and Info Section */}
          <div className="info-section">
            <div className="avatar-container">
              <svg className="avatar-icon" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="faceGradient">
                    <stop offset="0%" style={{ stopColor: "#d4a373", stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: "#c4936d", stopOpacity: 1 }} />
                  </radialGradient>
                  <radialGradient id="blushGradient">
                    <stop offset="0%" style={{ stopColor: "#ff8a9b", stopOpacity: 0.6 }} />
                    <stop offset="100%" style={{ stopColor: "#ff8a9b", stopOpacity: 0 }} />
                  </radialGradient>
                </defs>

                {/* Background circle */}
                <circle cx="100" cy="100" r="90" fill="#1a1b26" />

                {/* Face base */}
                <ellipse cx="100" cy="105" rx="55" ry="65" fill="url(#faceGradient)" />

                {/* Blush (hidden by default) */}
                <circle
                  className="blush-left"
                  cx="65"
                  cy="115"
                  r="12"
                  fill="url(#blushGradient)"
                  opacity="0"
                  style={{ transition: "opacity 0.3s ease" }}
                />
                <circle
                  className="blush-right"
                  cx="135"
                  cy="115"
                  r="12"
                  fill="url(#blushGradient)"
                  opacity="0"
                  style={{ transition: "opacity 0.3s ease" }}
                />

                {/* Hair */}
                <path
                  d="M 45 60 Q 50 30, 80 25 T 120 28 T 150 35 Q 155 50, 150 65 Q 145 55, 135 50 T 110 48 T 85 50 Q 65 55, 55 65 Q 50 55, 45 60"
                  fill="#1a1a1a"
                />

                {/* Curly hair details */}
                <circle cx="60" cy="45" r="8" fill="#1a1a1a" />
                <circle cx="75" cy="35" r="10" fill="#1a1a1a" />
                <circle cx="95" cy="30" r="9" fill="#1a1a1a" />
                <circle cx="115" cy="32" r="10" fill="#1a1a1a" />
                <circle cx="130" cy="38" r="9" fill="#1a1a1a" />
                <circle cx="140" cy="48" r="8" fill="#1a1a1a" />

                {/* Additional curls */}
                <path
                  d="M 55 50 Q 60 45, 65 48 T 70 55"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <path
                  d="M 130 45 Q 135 40, 140 43 T 145 50"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Glasses */}
                <g id="glasses">
                  {/* Left lens */}
                  <rect
                    x="55"
                    y="80"
                    width="35"
                    height="30"
                    rx="5"
                    fill="none"
                    stroke="#2a2a2a"
                    strokeWidth="3"
                  />
                  <rect x="57" y="82" width="31" height="26" rx="4" fill="rgba(255,255,255,0.1)" />

                  {/* Right lens */}
                  <rect
                    x="110"
                    y="80"
                    width="35"
                    height="30"
                    rx="5"
                    fill="none"
                    stroke="#2a2a2a"
                    strokeWidth="3"
                  />
                  <rect x="112" y="82" width="31" height="26" rx="4" fill="rgba(255,255,255,0.1)" />

                  {/* Bridge */}
                  <path d="M 90 90 L 110 90" stroke="#2a2a2a" strokeWidth="3" />

                  {/* Temples */}
                  <path d="M 55 95 L 45 93" stroke="#2a2a2a" strokeWidth="3" />
                  <path d="M 145 95 L 155 93" stroke="#2a2a2a" strokeWidth="3" />
                </g>

                {/* Eyes */}
                <circle cx="72" cy="95" r="4" fill="#1a1a1a" />
                <circle cx="128" cy="95" r="4" fill="#1a1a1a" />

                {/* Happy eyes (hidden by default) */}
                <path
                  className="happy-eyes-left"
                  d="M 65 90 Q 72 85, 79 90"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0"
                  style={{ transition: "opacity 0.3s ease" }}
                />
                <path
                  className="happy-eyes-right"
                  d="M 121 90 Q 128 85, 135 90"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0"
                  style={{ transition: "opacity 0.3s ease" }}
                />

                {/* Eyebrows */}
                <path
                  d="M 60 75 Q 72 70, 84 75"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path
                  d="M 116 75 Q 128 70, 140 75"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Nose */}
                <path d="M 100 100 L 95 115 Q 100 118, 105 115 L 100 100" fill="#c4936d" />

                {/* Normal smile */}
                <path
                  className="normal-smile"
                  d="M 75 125 Q 100 140, 125 125"
                  fill="none"
                  stroke="#8b5a3c"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ transition: "opacity 0.3s ease" }}
                />

                {/* Happy smile (hidden by default) */}
                <path
                  className="happy-smile"
                  d="M 70 125 Q 100 150, 130 125 Q 100 145, 70 125"
                  fill="#8b5a3c"
                  opacity="0"
                  style={{ transition: "opacity 0.3s ease" }}
                />
              </svg>
            </div>

            {/* Contact Data Fields */}
            <div className="contact-data">
              <div className="data-row">
                <span className="data-field">name:</span>
                <span className="data-value typewriter" data-text={contactData.name}></span>
              </div>
              <div className="data-row">
                <span className="data-field">pseudonym:</span>
                <span className="data-value typewriter" data-text="@AryanVijaywargia"></span>
              </div>
              <div className="data-row">
                <span className="data-field">location:</span>
                <span className="data-value typewriter" data-text={contactData.location}></span>
              </div>
              <div className="data-row">
                <span className="data-field">profession:</span>
                <span className="data-value typewriter" data-text={contactData.role}></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Email Me Button */}
      <button
        className="email-button"
        onClick={copyEmail}
        onMouseEnter={() => handleEmailHover(true)}
        onMouseLeave={() => handleEmailHover(false)}
        onFocus={() => handleEmailHover(true)}
        onBlur={() => handleEmailHover(false)}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        Email Me
      </button>

      {/* Tech Element */}
      <div className="tech-element">
        <span className="terminal-prompt">$</span>
        <span className="terminal-command">curl -O aryancodes.com/contact.vcf</span>
      </div>

      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Gloria+Hallelujah&display=swap");

        :root {
          --cyan-primary: #22d3ee;
          --cyan-light: #67e8f9;
          --text-primary: #f3f4f6;
          --text-secondary: #9ca3af;
        }

        .contact-section {
          min-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          background: transparent;
          padding: 4rem 2rem;
          overflow: hidden;
        }

        :global(.dark) .contact-section {
          background: transparent;
        }

        .background-shapes {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.5;
        }

        .floating-shape {
          animation: float infinite ease-in-out;
        }

        .contact-card {
          width: 650px;
          max-width: 90%;
          background: #1a1a2e;
          border: 2px solid #0f4c75;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(15, 76, 117, 0.5), 0 10px 40px rgba(0, 0, 0, 0.3);
          font-family: "Courier New", "JetBrains Mono", monospace;
          position: relative;
          z-index: 100;
          animation: cardEntry 0.6s ease-out;
          transition: all 0.3s ease;
        }

        .contact-card:hover {
          box-shadow: 0 0 30px rgba(15, 76, 117, 0.8), 0 15px 50px rgba(0, 0, 0, 0.4);
          transform: translateY(-5px);
        }

        .card-header {
          background: #16213e;
          border-bottom: 2px solid #0f4c75;
          padding: 12px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-title {
          color: #bbe1fa;
          font-size: 1.1rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .header-controls {
          display: flex;
          gap: 10px;
        }

        .social-icon {
          color: #3282b8;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .social-icon:hover {
          color: #bbe1fa;
          transform: rotate(360deg);
        }

        .card-content {
          padding: 30px;
        }

        .info-section {
          display: flex;
          gap: 40px;
          margin-bottom: 35px;
          align-items: center;
        }

        .avatar-container {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-icon {
          width: 140px;
          height: 140px;
          border: 3px solid #3282b8;
          border-radius: 16px;
          background: rgba(50, 130, 184, 0.1);
          padding: 10px;
          transition: all 0.3s ease;
        }

        .avatar-icon.happy {
          transform: scale(1.05);
          border-color: #bbe1fa;
          box-shadow: 0 0 20px rgba(187, 225, 250, 0.4);
        }

        .contact-data {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .data-row {
          display: flex;
          align-items: baseline;
          gap: 15px;
        }

        .data-field {
          color: #3282b8;
          text-transform: uppercase;
          font-size: 1rem;
          min-width: 110px;
          font-weight: bold;
        }

        .data-value {
          color: #bbe1fa;
          font-weight: bold;
          font-size: 1.1rem;
        }

        .email-button {
          margin-top: 1.5rem;
          background: #16213e;
          border: 2px solid #0f4c75;
          color: #3282b8;
          padding: 10px 16px;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 100;
          font-family: "Courier New", "JetBrains Mono", monospace;
          text-transform: uppercase;
        }

        .email-button:hover {
          background: #0f4c75;
          color: #bbe1fa;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(15, 76, 117, 0.4);
        }

        .email-button:focus {
          outline: 2px solid #3282b8;
          outline-offset: 2px;
        }

        .tech-element {
          display: none;
        }

        .desktop-notifications {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 50;
        }

        .notification {
          position: absolute;
          width: 350px;
          background: linear-gradient(145deg, #1a1a2e, #16213e);
          border: 2px solid #0f4c75;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6), 0 0 10px rgba(15, 76, 117, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: translateX(100%);
          opacity: 0;
          transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          font-family: "JetBrains Mono", monospace;
          overflow: hidden;
          pointer-events: all;
          backdrop-filter: blur(10px);
        }

        .notification:hover {
          transform: translateX(0) scale(1.02);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.7), 0 0 15px rgba(15, 76, 117, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }

        .notification-content {
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .notification-avatar {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #3282b8;
          background: rgba(50, 130, 184, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .notification-avatar::after {
          content: "";
          position: absolute;
          inset: -2px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3282b8, #bbe1fa);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .notification:hover .notification-avatar::after {
          opacity: 0.3;
        }

        .notification-text {
          flex: 1;
          min-width: 0;
        }

        .notification-username {
          color: #3282b8;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 4px;
          text-shadow: 0 0 5px rgba(50, 130, 184, 0.5);
        }

        .notification-message {
          color: #bbe1fa;
          font-size: 0.85rem;
          line-height: 1.4;
          margin-bottom: 6px;
          word-wrap: break-word;
        }

        .notification-time {
          color: #0f4c75;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .notification-1 .notification-username {
          color: #1da1f2;
          text-shadow: 0 0 5px rgba(29, 161, 242, 0.5);
        }

        .notification-2 .notification-username {
          color: #00c896;
          text-shadow: 0 0 5px rgba(0, 200, 150, 0.5);
        }

        .notification-3 .notification-username {
          color: #ff6b6b;
          text-shadow: 0 0 5px rgba(255, 107, 107, 0.5);
        }

        .notification-4 .notification-username {
          color: #9b59b6;
          text-shadow: 0 0 5px rgba(155, 89, 182, 0.5);
        }

        .typewriter {
          position: relative;
        }

        .typewriter::after {
          content: "|";
          animation: blink 1s infinite;
          color: #3b82f6;
        }

        @keyframes blink {
          0%,
          50% {
            opacity: 1;
          }
          51%,
          100% {
            opacity: 0;
          }
        }

        @keyframes cardEntry {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -20px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 30px) scale(0.95);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .floating-shape,
          .business-card::before,
          .avatar-glow {
            animation: none;
          }
          .business-card:hover,
          .social-link:hover,
          .download-vcard:hover {
            transform: none;
          }
        }

        @media (max-width: 768px) {
          .contact-card {
            width: 95%;
            max-width: 500px;
          }

          .info-section {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .avatar-icon {
            width: 110px;
            height: 110px;
          }

          .data-field {
            min-width: 80px;
            font-size: 0.8rem;
          }

          .data-value {
            font-size: 0.9rem;
          }

          .notification {
            width: 280px;
          }

          .card-content {
            padding: 20px;
          }

          .action-link {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 640px) {
          .contact-section {
            padding: 2rem 1rem;
          }

          .contact-card {
            width: 100%;
            margin: 0 1rem;
          }

          .avatar-icon {
            width: 100px;
            height: 100px;
          }

          .card-content {
            padding: 15px;
          }

          .notification {
            width: 95%;
            max-width: 300px;
          }

          .data-field {
            min-width: 70px;
            font-size: 0.75rem;
          }

          .data-value {
            font-size: 0.8rem;
          }

          .header-title {
            font-size: 1rem;
          }

          .action-link {
            font-size: 0.8rem;
            padding: 6px 10px;
          }

          .data-row {
            gap: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-card {
            animation: none;
          }

          .social-icon:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
};
