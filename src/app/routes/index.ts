import { Router } from "express";
import { UserRoutes } from "../modules/users/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";



// /api
const routes = [
  { path: "/users", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },

];

const router = Router();

routes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;
