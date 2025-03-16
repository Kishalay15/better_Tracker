export const BASE_URL = import.meta.env.VITE_API_URL;

export const API_PATHS = {
  AUTH: {
    LOGIN: "api/v1/auth/login/",
    REGISTER: "api/v1/auth/register/",
    GET_USER_INFO: "api/v1/auth/user/",
  },
  INCOME: {
    GET_ALL: "api/v1/income/get/",
    ADD: "api/v1/income/add/",
    DELETE: (id: string) => `api/v1/income/${id}/`,
  },
  EXPENSE: {
    GET_ALL: "api/v1/expense/get/",
    ADD: "api/v1/expense/add/",
    DELETE: (id: string) => `api/v1/expense/${id}/`,
  },
  DASHBOARD: {
    GET: "api/v1/dashboard/",
  },
};

export const getFullUrl = (path: string) => `${BASE_URL}/${path}`;
