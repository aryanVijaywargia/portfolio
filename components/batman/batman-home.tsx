import { FC } from "react";
import { BatHero } from "./bat-hero";
import { BatDossier } from "./bat-dossier";
import { BatCasefile } from "./bat-casefile";
import { BatArchive } from "./bat-archive";
import { BatContact } from "./bat-contact";

export const BatmanHome: FC = () => {
  return (
    <div className="batman-home">
      <BatHero />
      <BatDossier />
      <BatCasefile />
      <BatArchive />
      <BatContact />
    </div>
  );
};
