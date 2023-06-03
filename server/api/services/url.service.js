import axios from "axios";
import { ENVIROMENT_CONSTANTS } from "../../common/config";
import l from "../../common/logger";
import UserModel from "../../models/UserModel";
import authenticationService from "./authentication.service";
import validationService from "./validation.service";
import url from "url";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import UrlModel from "../../models/UrlModel";
import { Console } from "console";
class UrlService {
  async addUrl(user, body) {
    if (body?.shorturl) {
      const shortUrl = await UrlModel.find({ shorturl: body.shorturl });
      console.log(shortUrl);
      if (shortUrl && shortUrl.length > 0) {
        return { error: "Short URL already exists" };
      }
    }
    const shorturl = body.shorturl
      ? body.shorturl
      : await this.getShortUrl(body.url);

    const response = await UrlModel.create({
      name: body.name,
      description: body.description,
      url: body.url,
      shorturl: shorturl,
    });

    await UserModel.updateOne(
      { email: user.email },
      { $addToSet: { urls: response._id } },
      { upsert: true }
    );
    return response;
  }
  async getAllUrl(user) {
    const urls = await UserModel.findOne({ user: user._id }).populate("urls");
    return urls;
  }
  async deleteUrl(user, url) {
    const deletedUrl = await UrlModel.deleteOne({ _id: url._id });
    await UserModel.updateOne(
      { email: user.email },
      { $pull: { urls: url._id } },
      { upsert: true }
    );
    return deletedUrl;
  }
  async updateUrl(user, url) {
    await this.deleteUrl(user, url);
    await this.addUrl(user, url);
  }
  async getUrl(id) {
    const url = await UrlModel.findOne({ _id: id });
    return url;
  }
  async redirectUrl(shortUrl) {
    const url = await UrlModel.findOne({ shorturl: shortUrl });
    return url.url;
  }
  async getShortUrl(url) {
    while (true) {
      var id = crypto.randomBytes(4).toString("hex");
      const url = await UrlModel.findOne({ shorturl: id });
      if (!url) {
        return id;
      }
    }
  }
}

export default new UrlService();
