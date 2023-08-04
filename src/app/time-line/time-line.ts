// import { IconType } from 'react-icons'; // You need to find the Angular equivalent of the React icons you are using

export interface TimelineEvent {
  date: string;
  heading: string;
  description: string;
  Icon: null; // Replace 'IconType' with the Angular equivalent of the React icons you are using
}

export interface TimelineObject {
  [year: string]: TimelineEvent[];
}

export const TIMELINEOBJECT: TimelineObject = {
  "2019": [
    {
      date: "1986-01-08",
      heading: "Born",
      description: "In Viersen Germany, a few days early.",
      Icon: null, // Replace with the Angular equivalent icon component for FaBaby
    },
    {
        date: "1997-06-01",
        heading: "First line of code",
        description:
          "My stepdad Franz taught me programming ⌨, building a calculator 🧮 and a racing game 👾 🏎 with Delphi and Pascal",
        Icon: null, // Replace with the Angular equivalent icon component for CodeBracketIcon
      },
      {
        date: "1997-06-01",
        heading: "First line of code",
        description:
          "My stepdad Franz taught me programming ⌨, building a calculator 🧮 and a racing game 👾 🏎 with Delphi and Pascal",
        Icon: null, // Replace with the Angular equivalent icon component for CodeBracketIcon
      },
      {
        date: "1997-06-01",
        heading: "First line of code",
        description:
          "My stepdad Franz taught me programming ⌨, building a calculator 🧮 and a racing game 👾 🏎 with Delphi and Pascal",
        Icon: null, // Replace with the Angular equivalent icon component for CodeBracketIcon
      },
  ],
  "2020": [
    {
      date: "1996-06-01",
      heading: "Online",
      description:
        "I was fortunate to explore the internet at the age of 10 using a 28.9KBit modem. I was absolutely mind-blown 🤯",
      Icon: null, // Replace with the Angular equivalent icon component for WifiIcon
    },
    {
        date: "1997-06-01",
        heading: "First line of code",
        description:
          "My stepdad Franz taught me programming ⌨, building a calculator 🧮 and a racing game 👾 🏎 with Delphi and Pascal",
        Icon: null, // Replace with the Angular equivalent icon component for CodeBracketIcon
      },
      {
        date: "1997-06-01",
        heading: "First line of code",
        description:
          "My stepdad Franz taught me programming ⌨, building a calculator 🧮 and a racing game 👾 🏎 with Delphi and Pascal",
        Icon: null, // Replace with the Angular equivalent icon component for CodeBracketIcon
      },
      {
        date: "1997-06-01",
        heading: "First line of code",
        description:
          "My stepdad Franz taught me programming ⌨, building a calculator 🧮 and a racing game 👾 🏎 with Delphi and Pascal",
        Icon: null, // Replace with the Angular equivalent icon component for CodeBracketIcon
      },
  ],
  "2021": [
    {
      date: "1997-01-01",
      heading: "First Computer",
      description:
        "My brother and I were building our first computer from scratch, using my stepdad's old hardware and buying some new components. 133Mhz Pentium with 8mb RAM 😂",
      Icon: null, // Replace with the Angular equivalent icon component for ComputerDesktopIcon
    },
    {
      date: "1997-06-01",
      heading: "First line of code",
      description:
        "My stepdad Franz taught me programming ⌨, building a calculator 🧮 and a racing game 👾 🏎 with Delphi and Pascal",
      Icon: null, // Replace with the Angular equivalent icon component for CodeBracketIcon
    },
    {
        date: "1997-01-01",
        heading: "First Computer",
        description:
          "My brother and I were building our first computer from scratch, using my stepdad's old hardware and buying some new components. 133Mhz Pentium with 8mb RAM 😂",
        Icon: null, // Replace with the Angular equivalent icon component for ComputerDesktopIcon
      },
      {
        date: "1997-06-01",
        heading: "First line of code",
        description:
          "My stepdad Franz taught me programming ⌨, building a calculator 🧮 and a racing game 👾 🏎 with Delphi and Pascal",
        Icon: null, // Replace with the Angular equivalent icon component for CodeBracketIcon
      }
  ],
  "2022": [
    {
      date: "1998-01-01",
      heading: "First Computer",
      description:
        "My brother and I were building our first computer from scratch, using my stepdad's old hardware and buying some new components. 133Mhz Pentium with 8mb RAM 😂",
      Icon: null, // Replace with the Angular equivalent icon component for ComputerDesktopIcon
    },
    {
      date: "1998-06-01",
      heading: "First line of code",
      description:
        "My stepdad Franz taught me programming ⌨, building a calculator 🧮 and a racing game 👾 🏎 with Delphi and Pascal",
      Icon: null, // Replace with the Angular equivalent icon component for CodeBracketIcon
    },
    {
        date: "1998-01-01",
        heading: "First Computer",
        description:
          "My brother and I were building our first computer from scratch, using my stepdad's old hardware and buying some new components. 133Mhz Pentium with 8mb RAM 😂",
        Icon: null, // Replace with the Angular equivalent icon component for ComputerDesktopIcon
      },
      {
        date: "1998-06-01",
        heading: "First line of code",
        description:
          "My stepdad Franz taught me programming ⌨, building a calculator 🧮 and a racing game 👾 🏎 with Delphi and Pascal",
        Icon: null, // Replace with the Angular equivalent icon component for CodeBracketIcon
      }
  ],
  
};
