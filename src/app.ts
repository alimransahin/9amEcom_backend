import cors from "cors";
import express, { Application, Request, Response } from "express";

import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import path from "path";

const allowedOrigins = [
    "http://localhost:5173",
    "https://yourdomain.com",
];
const app: Application = express();

app.use(express.json());
app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(cookieParser());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello Developer ! App is Running");
});
app.use(globalErrorHandler);
app.use(notFound);

export default app;
