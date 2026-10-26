import { RosterItem } from "../../roster";

export type AutoArrangeResult = {
  status: "OPTIMAL" | "FEASIBLE";
  items: RosterItem[];
};
