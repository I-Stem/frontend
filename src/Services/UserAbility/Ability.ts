import { Ability, AbilityClass, defineAbility } from "@casl/ability";

type Actions = "VIEW";
type Subjects = "AI_SERVICES" | "PROGRAMS_AND_RESOURCES";
export type AppAbility = Ability<[Actions, Subjects]>;
export const AppAbility = Ability as AbilityClass<AppAbility>;

const ability = defineAbility<AppAbility>((can, cannot) => {
  can("VIEW", ["AI_SERVICES", "PROGRAMS_AND_RESOURCES"]);
  cannot("VIEW", "AI_SERVICES");
});

ability.can = ability.can.bind(ability);
ability.cannot = ability.cannot.bind(ability);

export default ability;
