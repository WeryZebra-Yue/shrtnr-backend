import axios from "axios";
import url from "url";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";
import { ENVIROMENT_CONSTANTS } from "../../common/config";
import l from "../../common/logger";
import UserModel from "../../models/UserModel";
import validationService from "./validation.service";
import { OAuth2Client } from "google-auth-library";
import urlService from "./url.service";

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

  async signup(email, firstName, lastName, avatar, password) {
    let userDoc = await UserModel.findOne({ email });

    if (userDoc) {
      const samePassword = await bcrypt.compare(password, userDoc.password);
      if (samePassword) {
        return userDoc;
      }
      throw new Error("User already exist with this email");
    }

    password = await bcrypt.hash(password, 10);
    try {
      const user = await UserModel.create({
        email,
        firstName,
        lastName,
        avatar,
        password,
        signedUpWith: "email",
      });
      return user;
    } catch (err) {
      l.error(err, "SIGNUP SERVICE ERROR");
    }
  }

  async login(email, password) {
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid Username or Password");
      }

      return user;
    } catch (err) {
      l.error(err, "LOGIN SERVICE ERROR");
      throw err;
    }
  }

  async googleLogin(email, firstName, lastName, avatar) {
    try {
      let user = await UserModel.findOne({ email });
      if (!user) {
        user = await UserModel.create({
          email,
          firstName,
          lastName,
          avatar,
          signedUpWith: "google",
        });
      }
      return user;
    } catch (err) {
      l.error(err, "GOOGLE LOGIN SERVICE ERROR");
      throw err;
    }
  }

  async getuser(userId) {
    try {
      const user = await UserModel.findById(userId);
      const urls = await urlService.getAllUrl(user);
      user.urls = urls;
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

  async addopening(userId, opening) {
    try {
      opening.userId = userId;
      const response = await OpeningModel.create(opening);
      return response._id;
    } catch (err) {
      l.error(err, "ADD OPENING ERROR");
    }
  }
  async getopenings(userId) {
    try {
      const openings = await OpeningModel.find({ userId: userId });
      return openings;
    } catch (err) {
      l.error(err, "GET OPENINGS ERROR");
    }
  }
  async getopening(userId, openingId) {
    try {
      const opening = await OpeningModel.findOne({
        _id: openingId,
        userId: userId,
      });
      return opening;
    } catch (err) {
      l.error(err, "GET OPENING ERROR");
    }
  }

  async deleteopening(userId, openingId) {
    try {
      await OpeningModel.deleteOne({ _id: openingId, userId: userId });
    } catch (err) {
      l.error(err, "DELETE OPENING ERROR");
    }
  }
}

export default new UserService();
