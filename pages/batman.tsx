import dynamic from "next/dynamic";
import { FC } from "react";

const BatmanHome = dynamic(
  () => import("components/batman/batman-home").then((mod) => mod.BatmanHome),
  { ssr: false }
);

const Batman: FC = () => <BatmanHome />;

export default Batman;
