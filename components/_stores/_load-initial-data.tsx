import { useIsGloballyMounted } from "components/_stores/is-globally-mounted-store";
import { useTooltipStore } from "components/_stores/tooltip-store";

import { Toast } from "components/toast";
import dynamic from "next/dynamic";
import { FC, PropsWithChildren, useEffect } from "react";
import ReactTooltipType from "react-tooltip";
//

const ReactTooltip = dynamic(() => import("react-tooltip").then((mod) => mod), {
  ssr: false,
}) as typeof ReactTooltipType;

export const LoadInitialData: FC<PropsWithChildren<any>> = ({ children }) => {
  const [tooltip] = useTooltipStore();
  const [isGloballyMounted, setIsGloballyMounted] = useIsGloballyMounted();
  // useInitShopifyData();

  useEffect(() => {
    setIsGloballyMounted(true);
  }, [setIsGloballyMounted]);

  return (
    <>
      {children}
      <Toast />
      {isGloballyMounted && tooltip
        ? <ReactTooltip
            place="bottom"
            effect="solid"
            wrapper="span"
            arrowColor="white"
            delayHide={500}
            clickable={true}
            multiline={true}
            // possibleCustomEventsOff="hide-global-tooltip"
            className="relative !border-none !border-transparent !p-0"
            getContent={(content) => {
              return (
                <span className="pointer-events-auto block h-[calc(100%+1px)] w-[calc(100%+1px)] max-w-[min(420px,calc(100vw-32px))] select-none whitespace-normal rounded-sm border-card bg-white px-5 py-2 text-left text-slate-700 opacity-100 shadow-xl">
                  {content}
                </span>
              );
            }}
          />
        : null}
    </>
  );
};
