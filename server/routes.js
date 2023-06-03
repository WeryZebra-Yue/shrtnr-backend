import authRouter from "./api/controllers/auth/router";
import userRouter from "./api/controllers/user/router";
import urlRouter from "./api/controllers/url/router";

export default function routes(app) {
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/url", urlRouter);
}
