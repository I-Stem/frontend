import getConfig from "next/config";

const {
  publicRuntimeConfig: { BASE_URL, VERIFICATION_URL },
} = getConfig();

export { BASE_URL, VERIFICATION_URL };
