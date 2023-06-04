import crypto from "crypto";
import UrlModel from "../../models/UrlModel";
class UrlService {
  async addUrl(user, body) {
    if (body?.shorturl) {
      const shortUrl = await UrlModel.find({ shorturl: body.shorturl });
      if (shortUrl && shortUrl.length > 0) {
        return { error: "Short URL already exists" };
      }
    }
    const shorturl = body.shorturl
      ? body.shorturl
      : await this.getShortUrl(body.url);

    console.log(user);
    const response = await UrlModel.create({
      userId: user.id,
      name: body.name,
      description: body.description,
      url: body.url,
      shorturl: shorturl,
    });
    return response;
  }
  async getAllUrl(user) {
    const urls = await UrlModel.find({ userId: user.id });
    return urls;
  }
  async deleteUrl(user, url) {
    console.log(user);
    const deletedUrl = await UrlModel.deleteOne({
      userId: user.id,
      _id: url,
    });
    return deletedUrl;
  }
  async updateUrl(user, url) {
    const updatedUrl = await UrlModel.updateOne(
      { userId: user.id, _id: url._id },
      url
    );
    return updatedUrl;
  }
  async getUrl(userId, urlId) {
    const url = await UrlModel.findOne({
      userId: userId,
      _id: urlId,
    });
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
