import { Router } from "express";
import { UserRoutes } from "../modules/users/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BrandRoutes } from "../modules/brand/brand.route";
import { CategoryRoutes } from "../modules/category/category.route";



// /api
const routes = [
  { path: "/users", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/brand", route: BrandRoutes },
  { path: "/category", route: CategoryRoutes }

];

const router = Router();

routes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;
