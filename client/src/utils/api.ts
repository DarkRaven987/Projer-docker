export const BASE_URL: string = process.env.NODE_ENV === "development"
? "http://localhost:3001"
: "http://localhost:8081/api"                               // THIS IS FULLY DOCKER-PRODUCTION URL
// : "https://projer-server.herokuapp.com";                 THIS IS FULLY PRODUCTION API URL

// AUTHENTIFICATION URLS
export const signin_url = `${BASE_URL}/auth/signin`;
export const signup_url = `${BASE_URL}/auth/signup`;
export const forgotPasswordRequestUrl = `${BASE_URL}/auth/forgot-send`;
export const forgotPasswordConfirmUrl = `${BASE_URL}/auth/forgot-confirm`;

//  PROJECTS DATA URLS
export const projectsUrl = `${BASE_URL}/projects`;

// TASKS DATA URLS
export const tasksUrl = `${BASE_URL}/tasks`;

// USERS DATA URLS
export const usersUrl = `${BASE_URL}/users`;
export const userRolesUrl = `${BASE_URL}/roles`;
