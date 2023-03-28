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

      if (await userService.getUser({ email: req.body.email })) {
        res.status(400).send("Email already exists!");
      } else {
        const user_id = await userService.signup(req.body.email);
        const token = authenticationService.generateToken(user_id);
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

      const user = await userService.getUser({ email: req.body.email });
      if (!user) {
        res.status(400).send("Email does not exist!");
      } else {
        const token = authenticationService.generateToken(user._id);
        res.status(200).send(token);
      }
    } catch (err) {
      l.error(err, "LOGIN CONTROLLER ERROR");
    }
  }
}
export default new Controller();
