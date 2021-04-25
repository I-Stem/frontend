// #region Global Imports
import "isomorphic-unfetch";
import axios from "axios";

import getConfig from "next/config";
import { stringify } from "query-string";
// #endregion Global Imports

// #region Interface Imports
import { HttpModel } from "@Interfaces";
// #endregion Interface Imports

const {
  publicRuntimeConfig: { API_KEY, API_URL },
} = getConfig();

const baseURL = `${API_URL}/api`;
const axiosRequest = axios.create({
  baseURL,
  responseType: "json",
});

export { axiosRequest };

export const Http = {
  get: async <A>(
    url: string,
    params?: HttpModel.IRequestQueryPayload
  ): Promise<A> => {
    return new Promise((resolve, reject) => {
      const query = params
        ? `?${stringify({ ...params, api_key: API_KEY })}`
        : "";

      axiosRequest
        .get(`${url}${query}`)

        .then(async response => {
          if (response.status === 200) {
            return resolve({ ...response.data, error: false });
          }
          const promiseResponse = { ...response, error: true };
          return reject(promiseResponse);
        })
        .catch(e => {
          if (e.response) {
            const promiseResponse = { ...e.response?.data, error: true };
            return reject(promiseResponse);
          }
          return reject(e);
        });
    });
  },
  getFile: async (
    url: string,
    params?: HttpModel.IRequestQueryPayload
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const query = params
        ? `?${stringify({ ...params, api_key: API_KEY })}`
        : "";

      axiosRequest
        .get(`${url}${query}`, {
          responseType: "blob",
        })
        .then(response => {
          if (response.status === 200) {
            return resolve(response);
          }
          const promiseResponse = { ...response, error: true };
          return reject(promiseResponse);
        })
        .catch(e => {
          if (e.response) {
            const promiseResponse = { ...e.response?.data, error: true };
            return reject(promiseResponse);
          }
          return reject(e);
        });
    });
  },
  post: async <A>(
    url: string,
    params?: HttpModel.IRequestQueryPayload,
    payload?: HttpModel.IRequestPayload | HttpModel.IFormRequestPayload,
    config = {}
  ): Promise<A> => {
    return new Promise((resolve, reject) => {
      const query = params
        ? `?${stringify({ ...params, api_key: API_KEY })}`
        : "";
      axiosRequest
        .post(`${url}${query}`, payload, config)

        .then(async response => {
          if (response.status === 200) {
            return resolve({ ...response.data, error: false });
          }
          const promiseResponse = { ...response, error: true };
          return reject(promiseResponse);
        })
        .catch(e => {
          if (e.response) {
            const promiseResponse = { ...e.response?.data, error: true };
            return reject(promiseResponse);
          }
          return reject(e);
        });
    });
  },
  patch: async <A>(
    url: string,
    params?: HttpModel.IRequestQueryPayload,
    payload?: HttpModel.IRequestPayload | HttpModel.IFormRequestPayload,
    config = {}
  ): Promise<A> => {
    return new Promise((resolve, reject) => {
      const query = params
        ? `?${stringify({ ...params, api_key: API_KEY })}`
        : "";
      axiosRequest
        .patch(`${url}${query}`, payload, config)

        .then(async response => {
          if (response.status === 200) {
            return resolve({ ...response.data, error: false });
          }
          const promiseResponse = { ...response, error: true };
          return reject(promiseResponse);
        })
        .catch(e => {
          if (e.response) {
            const promiseResponse = { ...e.response?.data, error: true };
            return reject(promiseResponse);
          }
          return reject(e);
        });
    });
  },
};
