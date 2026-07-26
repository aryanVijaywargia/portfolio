export const CONTRA_MISSION_COMPLETE_KEY = "rick-rescue:contra-cleared:v1";

export const isContraMissionComplete = () =>
  typeof window !== "undefined" &&
  window.localStorage.getItem(CONTRA_MISSION_COMPLETE_KEY) === "true";
