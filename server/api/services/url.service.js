import crypto from "crypto";
import UrlModel from "../../models/UrlModel";
import LogModel from "../../models/LogModel";
class UrlService {
  async addUrl(user, body) {
    if (body?.shorturl) {
      const shortUrl = await UrlModel.find({ shorturl: body.shorturl });
      if (shortUrl && shortUrl.length > 0) {
        return { error: "Short URL already exists" };
      }
    }
    const name = body.name
      ? body.name
      : "Untitled " +
        ((await UrlModel.find({
          userId: user.id,
          name: { $regex: "Untitled" },
        }).countDocuments()) +
          1);

    const shorturl = body.shorturl
      ? body.shorturl
      : await this.getShortUrl(body.url);

    console.log(user);
    const response = await UrlModel.create({
      userId: user.id,
      name: name,
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
      _id: urlId,
      userId: userId,
    });
    return url;
  }
  async redirectUrl(shortUrl) {
    const url = await UrlModel.findOne({ shorturl: shortUrl });
    await this.logData(url._id);
    return url.url;
  }
  async logData(urlId) {
    await LogModel.create({
      urlId: urlId,
    });
  }
  async getAnalytics(urlId, userId, window) {
    const url = await UrlModel.findOne({ userId: userId, _id: urlId });
    if (!url) {
      return { error: "No URL found" };
    }
    const response = await LogModel.aggregate([
      {
        $match: {
          urlId: "647c39d87a0a86709f0c078e",
        },
      },
      {
        $bucket: {
          groupBy: "$timestamp",
          boundaries: [window.start, window.end],
          default: "Other",
          output: {
            output: {
              $push: { timestamp: "$timestamp" },
            },
          },
        },
      },
      { $unwind: { path: "$output" } },
      {
        $addFields: {
          date: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$output.timestamp",
            },
          },
          time: {
            $dateToString: {
              format: "%H",
              date: "$output.timestamp",
            },
          },
        },
      },
      {
        $group: {
          _id: { date: "$date", time: "$time" },
          count: { $sum: 1 },
        },
      },
    ]);
    const bins = {
      time: [],
      count: [],
    };
    response.forEach((element) => {
      console.log(element._id.date + " " + element._id.time);
      bins.time.push(
        new Date(element._id.date + " " + element._id.time + ":00:00")
      );
      bins.count.push(element.count);
    });
    return bins;
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
