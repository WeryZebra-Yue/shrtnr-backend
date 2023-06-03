import userService from "../../services/user.service";
import l from "../../../common/logger";
import authenticationService from "../../services/authentication.service";

export class Controller {
  async joinWaitlist(req, res) {
    try {
      if (!req.body.email) {
        res.status(400).send("Email missing!");
      }

      await userService.joinWaitlist(req.body.email);

      res.status(200).send({
        message: "Thank you for joining the waitlist!",
      });
    } catch (err) {
      l.error(err, "JOIN WAITLIST CONTROLLER ERROR");
    }
  }
  async signup(req, res) {
    try {
      if (!req.body.email) {
        res.status(400).send("Email missing!");
      }

      if (await userService.userExist({ email: req.body.email })) {
        res.status(400).send("Email already exists!");
      } else {
        const userId = await userService.signup(req.body);
        const token = authenticationService.generateToken(userId);
        res.status(200).send(token);
      }
    } catch (err) {
      l.error(err, "SIGNUP CONTROLLER ERROR");
    }
  }
  async login(req, res) {
    try {
      if (!req.body.email) {
        res.status(400).send("Email missing!");
      }

      const userId = await userService.userExist({ email: req.body.email });
      if (!userId) {
        res.status(400).send("Email does not exist!");
      } else {
        const token = authenticationService.generateToken(userId);
        res.status(200).send(token);
      }
    } catch (err) {
      l.error(err, "LOGIN CONTROLLER ERROR");
    }
  }

  async googleLogin(req, res, next) {
    try {
      const code = req.body.code;
      const userData = await userService.fetchGoogleData(code);

      const existingUser = await userService.userExist({
        email: userData.email,
      });
      if (existingUser) {
        const token = authenticationService.generateToken(existingUser._id);
        return res.status(200).send(token);
      }

      const userId = await userService.signup(
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.avatar
      );
      const token = authenticationService.generateToken(userId);
      return res.status(200).send(token);
    } catch (err) {
      l.error(err, "GOOGLE LOGIN CONTROLLER ERROR");
      next(err);
    }
  }
}
export default new Controller();
