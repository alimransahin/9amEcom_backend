import { Router } from "express";
import { UserRoutes } from "../modules/users/user.routes";



// /api
const routes = [
  { path: "/users", route: UserRoutes },

];

const router = Router();

routes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;
