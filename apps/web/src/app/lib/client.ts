import createClient from "@neat/api-client";

export const apiClient = createClient(process.env.REACT_APP_API_URL || "http://localhost:4000/");
