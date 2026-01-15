import { FC } from "react";

type DogIconProps = {
  className?: string;
};

export const DogIcon: FC<DogIconProps> = ({ className = "h-5 w-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Dog face icon */}
    <path d="M18 4c-1 0-2 .5-2.5 1L12 8l-3.5-3C8 4.5 7 4 6 4c-2.2 0-4 1.8-4 4 0 1.1.5 2.1 1.2 2.8L3 11v7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1h6v1c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-7l-.2-.2c.7-.7 1.2-1.7 1.2-2.8 0-2.2-1.8-4-4-4zM8.5 13c-.8 0-1.5-.7-1.5-1.5S7.7 10 8.5 10s1.5.7 1.5 1.5S9.3 13 8.5 13zm7 0c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" />
  </svg>
);
