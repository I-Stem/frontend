// #region Global Imports
import dotenv from "dotenv";
import nock from "nock";
import { setConfig } from "next/config";
import "jest-styled-components";
import "@testing-library/jest-dom";
// #endregion Global Imports

dotenv.config({ path: ".env.test" });

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

setConfig({
  publicRuntimeConfig: {
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
  },
});
