import { Ability, AbilityClass, defineAbility } from "@casl/ability";

export type Actions = "VIEW";
export type Subjects =
  | "AI_SERVICES"
  | "PROGRAMS_AND_RESOURCES"
  | "ADMIN_PANEL"
  | "SETTINGS"
  | "ESCALATIONS"
  | "METRICS"
  | "STUDENTS";
export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

const ability = defineAbility<AppAbility>((can, cannot) => {
  can("VIEW", [
    "AI_SERVICES",
    "PROGRAMS_AND_RESOURCES",
    "ADMIN_PANEL",
    "SETTINGS",
    "ESCALATIONS",
    "METRICS",
    "STUDENTS",
  ]);
  cannot("VIEW", [
    "AI_SERVICES",
    "ADMIN_PANEL",
    "SETTINGS",
    "ESCALATIONS",
    "METRICS",
    "STUDENTS",
  ]);
});

ability.can = ability.can.bind(ability);
ability.cannot = ability.cannot.bind(ability);

export default ability;
