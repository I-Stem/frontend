import { createContextualCan, useAbility } from "@casl/react";
import { createContext } from "react";
import ability, { AppAbility } from "../Services/UserAbility/Ability";

export const AbilityContext = createContext<AppAbility>(ability);
export const useAppAbility = () => useAbility(AbilityContext);
export const Can = createContextualCan(AbilityContext.Consumer);
