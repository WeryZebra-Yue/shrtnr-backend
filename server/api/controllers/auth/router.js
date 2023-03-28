import * as express from "express";
import controller from "./controller";

export default express
  .Router()
  .post("/join-waitlist", controller.joinWaitlist)
  .post("/signup", controller.signup)
  .post("/login", controller.login);
