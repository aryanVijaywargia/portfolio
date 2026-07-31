import { FC } from "react";

export const BlogBackground: FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,0.055)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:linear-gradient(to_bottom,#000_0%,transparent_62%)] d:bg-[linear-gradient(to_right,rgba(148,163,184,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.05)_1px,transparent_1px)]" />
      <div className="absolute -right-48 top-8 h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-[110px] d:bg-cyan-400/15" />
      <div className="absolute -left-48 top-[28rem] h-[28rem] w-[28rem] rounded-full bg-violet-400/10 blur-[120px] d:bg-violet-500/10" />
    </div>
  );
};
