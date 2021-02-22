import { unpackRules } from "@casl/ability/extra";
import { axiosRequest } from "@Services/API/Http";
import { TOKEN_STORAGE_KEY } from "@Services/Permission/AuthToken";
import Cookies from "js-cookie";
import Error from "next/error";
import React, { useEffect } from "react";
import { useAppAbility } from "src/Hooks/useAppAbility";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { REGISTER_MAIN_ROUTE } from "@Definitions/Constants";
import ability, { Actions, Subjects } from "../../Services/UserAbility/Ability";

const withAccess = (subject: Subjects, action: Actions) => (Component: any) =>
  function WrappedComponent() {
    const token = Cookies.get(TOKEN_STORAGE_KEY);
    const router = useRouter();
    if (token) {
      ability.update(unpackRules(jwt.decode(token, { json: true })!.rules));
      axiosRequest.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      router.push(REGISTER_MAIN_ROUTE);
    }
    const { can } = useAppAbility();
    const isAllowed = can(action, subject);
    return isAllowed ? (
      <Component />
    ) : (
      <Error title="Page Not Found" statusCode={404} />
    );
  };

export default withAccess;
