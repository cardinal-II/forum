"use strict";
import axios from "axios";
import pkg from "agentkeepalive";
const Agent = pkg;
const HttpsAgent = pkg.HttpsAgent;
//import 'dotenv/config';
import { get_env_vars } from "@/plugins/utilities";

let api_address;
console.log("api, NODE_ENV, 10"); //, import.meta.env, process.env.NODE_ENV);
const env_vars = get_env_vars();
console.log("api, NODE_ENV, 20", env_vars.VITE_ENV);
const staging = `${env_vars.VITE_STAGING_BACKEND_PROTOCOL}${env_vars.VITE_STAGING_BACKEND_IP}/` //${env_vars.VITE_STAGING_BACKEND_PORT}/${env_vars.VITE_STAGING_BACKEND_DIRECTORY}/`;
const production = `${env_vars.VITE_PRODUCTION_BACKEND_PROTOCOL}${env_vars.VITE_PRODUCTION_BACKEND_IP}/`;
if (env_vars.VITE_ENV === "test_prod") {
  api_address = production
  console.log("api, address, 100", api_address);
} else if (env_vars.VITE_ENV === "development") {
  api_address = staging
  console.log("api, address, 200", api_address, env_vars.VITE_ENV);
} else if (env_vars.VITE_ENV === "test") {
  api_address = staging
  console.log("api, address, 200", api_address, env_vars.VITE_ENV);
} else {
  api_address = production
  console.log("api, address, 300", api_address);
}

const baseURL = api_address;

console.log("api, address, 400", env_vars.VITE_ENV, api_address, baseURL);

const keepAliveAgent = new Agent({
  maxSockets: 160,
  maxFreeSockets: 160,
  timeout: 15000,
  freeSocketTimeout: 5000,
  keepAliveMsecs: 10000,
});

const httpsKeepAliveAgent = new HttpsAgent({
  maxSockets: 160,
  maxFreeSockets: 160,
  timeout: 15000,
  freeSocketTimeout: 5000,
  keepAliveMsecs: 10000,
});

// Default config for the axios instance
const axiosParams = {
  // Set different base URL based on the environment
  baseURL: baseURL,
  // Alternative if you have more environments
  // baseURL: import.meta.env.VITE_API_BASE_URL
  /*transformRequest: [(data, headers) => {
    delete headers.common['X-Requested-With'];
    return data 
 }]*/
  headers: { "X-Requested-With": "XMLHttpRequest" },
  //timeout: 6000,
  httpAgent: keepAliveAgent,
  httpsAgent: httpsKeepAliveAgent,
};
// Create axios instance with default params
const axiosInstance = axios.create(axiosParams);
// Main api function
const api = (axios) => {
  //console.log('api, 10')
  // Wrapper functions around axios
  return {
    get: async (url, config) => await axios.get(url, config),
    post: async (url, body, config) => await axios.post(url, body, config),
    patch: async (url, body, config) => await axios.patch(url, body, config),
    delete: async (url, config) => await axios.delete(url, config),
  };
};

// Initialize the api function and pass axiosInstance to it
export default api(axiosInstance);
