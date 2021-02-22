// #region Global Imports
const nextRoutes = require("next-routes");
// #endregion Global Imports

const routes = (module.exports = nextRoutes());

// routes.add("home", "/");
routes.add("health", "/health");
routes.add("register", "/register");
routes.add("login", "/login");
routes.add("auth", "/auth");
routes.add("loader", "/");

export default routes;
