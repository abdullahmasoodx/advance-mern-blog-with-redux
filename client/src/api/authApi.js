import API from "./axios";

export const login = (data) => API.post("/users/login", data);

export const register = (data) => API.post("/users/register", data);