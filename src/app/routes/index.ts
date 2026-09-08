import { Router } from "express";
import { UserRoutes } from "../modules/users/user.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { BrandRoutes } from "../modules/brand/brand.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ProductRoutes } from "../modules/product/product.routes";
import { SizeChartRoutes } from "../modules/size/size.route";
import { CartRoutes } from "../modules/cart/cart.route";
import { OrderRoutes } from "../modules/orders/order.route";
import { ShopRoutes } from "../modules/shop/shop.route";
import { PurchaseRoutes } from "../modules/purchase/purchase.route";



// /api
const routes = [
  { path: "/users", route: UserRoutes },
  { path: "/auth", route: AuthRoutes },
  { path: "/brands", route: BrandRoutes },
  { path: "/categories", route: CategoryRoutes },
  { path: "/products", route: ProductRoutes },
  { path: "/size-charts", route: SizeChartRoutes },
  { path: "/cart", route: CartRoutes },
  { path: "/orders", route: OrderRoutes },
  { path: "/shop", route: ShopRoutes },
  { path: "/purchases", route: PurchaseRoutes },




];

const router = Router();

routes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;
