import { GloballyMountedProvider } from "components/_stores/is-globally-mounted-store";
import { TooltipProvider } from "components/_stores/tooltip-store";
import { ThemeProvider } from "next-themes";
import { FC, PropsWithChildren } from "react";

export const ContextProviders: FC<PropsWithChildren<any>> = ({ children }) => {
  return (
    <GloballyMountedProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeProvider>
    </GloballyMountedProvider>
  );
};
