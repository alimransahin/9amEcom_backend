import { Router } from "express";



// /api
const routes = [
  { path: "/auth", route: authRouter },

];

const router = Router();

routes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;
