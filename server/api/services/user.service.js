import axios from "axios";
import { ENVIROMENT_CONSTANTS } from "../../common/config";
import l from "../../common/logger";
import UserModel from "../../models/UserModel";
import authenticationService from "./authentication.service";
import validationService from "./validation.service";
import url from "url";
import { OAuth2Client } from "google-auth-library";

class UserService {
  constructor() {
    this.client = new OAuth2Client(ENVIROMENT_CONSTANTS.GOOGLE_CLIENT_ID);
  }

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

  async signup({ email, firstName, lastName, password }) {
    email = validationService.normalizeEmail(email);
    try {
      const user = await UserModel.create({
        email,
        firstName,
        lastName,
        password,
      });
      return user._id;
    } catch (err) {
      l.error(err, "SIGNUP ERROR");
    }
  }

  async userExist(filter) {
    validationService.normalizeEmail(filter.email);
    try {
      const user = await UserModel.findOne(filter);
      if (!user) {
        return false;
      }
      return user;
    } catch (err) {
      l.error(err, "GET USER ERROR");
      throw err;
    }
  }

  async getuser(userId) {
    try {
      const user = await UserModel.findById(userId);
      return user;
    } catch (err) {
      l.error(err, "GET USER ERROR");
      throw err;
    }
  }

  async fetchGoogleData(code) {
    try {
      const urlEncodedBody = new url.URLSearchParams({
        code,
        client_id: ENVIROMENT_CONSTANTS.GOOGLE_CLIENT_ID,
        redirect_uri: ENVIROMENT_CONSTANTS.GOOGLE_REDIRECT_URI,
        client_secret: ENVIROMENT_CONSTANTS.GOOGLE_CLIENT_SECRET,
        grant_type: "authorization_code",
      });

      const { data } = await axios.post(
        `https://www.googleapis.com/oauth2/v4/token`,
        urlEncodedBody,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const response = await this.client.verifyIdToken({
        idToken: data.id_token,
        audience: ENVIROMENT_CONSTANTS.GOOGLE_CLIENT_ID,
      });

      const { email_verified, email, given_name, family_name, picture } =
        response.payload;

      if (!email_verified) {
        throw new Error("Email not verified");
      }

      return {
        email,
        firstName: given_name,
        lastName: family_name,
        avatar: picture,
      };
    } catch (error) {
      l.error(error, "[FETCH GOOGLE DATA]");
      throw error;
    }
  }
}

export default new UserService();
