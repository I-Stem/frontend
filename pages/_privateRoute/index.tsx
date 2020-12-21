/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { unpackRules } from "@casl/ability/extra";
import { REGISTER_MAIN_ROUTE } from "../../src/Definitions/Constants";
import { axiosRequest } from "../../src/Services/API/Http";
import { TOKEN_STORAGE_KEY } from "../../src/Services/Permission/AuthToken";
import ability from "../../src/Services/UserAbility/Ability";

export default function PrivateRoute(Component: any) {
  return () => {
    const router = useRouter();
    let isLoading = true;

    async function loadUserFromCookies() {
      const token = Cookies.get(TOKEN_STORAGE_KEY);
      if (token) {
        ability.update(unpackRules(jwt.decode(token, { json: true })!.rules));
        axiosRequest.defaults.headers.Authorization = `Bearer ${token}`;
      } else {
        router.push(REGISTER_MAIN_ROUTE);
      }
      isLoading = false;
    }
    loadUserFromCookies();
    // eslint-disable-next-line prefer-rest-params
    return !isLoading && <Component />;
  };
}
