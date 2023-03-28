import l from "../../common/logger";
import UserModel from "../../models/UserModel";
import authenticationService from "./authentication.service";

class UserService {
  async joinWaitlist(email) {
    try {
      const user = await UserModel.updateOne(
        { email },
        { $addToSet: { tags: "waitlist_user" } },
        { upsert: true }
      );

      return user;
    } catch (err) {
      l.error(err, "JOIN WAITLIST ERROR");
      throw err;
    }
  }
  async signup(email) {
    try {
      const user = await UserModel({
        email,
      });
      user.save();
      return user._id;
    } catch (err) {
      l.error(err, "SIGNUP ERROR");
    }
  }
  async getUser(filter) {
    try {
      const user = await UserModel.findOne(filter);
      if (!user) {
        return null;
      }
      return user;
    } catch (err) {
      l.error(err, "GET USER ERROR");
      throw err;
    }
  }
}

export default new UserService();
