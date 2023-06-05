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
      { userId: user.id, _id: url.id },
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
    await this.logData(url.id);
    return url.url;
  }
  async logData(urlId) {
    await LogModel.create({
      urlId: urlId,
    });
  }
  async getAnalytics(urlId, userId, window, interval) {
    const url = await UrlModel.findOne({ userId: userId, _id: urlId });
    if (!url) {
      return { error: "No URL found" };
    }
    const response = await LogModel.aggregate([
      {
        $match: {
          urlId: urlId,
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
          _id: {
            date: "$date",
            time:
              interval === "last24Hours" || interval === "allTime"
                ? "$time"
                : null,
          },
          count: { $sum: 1 },
        },
      },
    ]);
    const bins = [];
    if (interval === "last24Hours") {
      for (let i = 0; i < 24; i++) {
        bins.push({
          time: new Date(new Date().setHours(i, 0, 0, 0)),
          count: 0,
        });
      }
      response.forEach((element) => {
        bins[parseInt(element._id.time)].count = element.count;
      });
    } else if (interval === "last7Days") {
      for (let i = 7; i >= 0; i--) {
        bins.push({
          time: new Date(
            new Date().setDate(new Date().getDate() - i)
          ).getDate(),
          count: 0,
        });
      }
      response.forEach((element) => {
        bins.filter((bin) => {
          return bin.time === parseInt(element._id.date.split("-")[0]);
        })[0].count = element.count;
      });
    } else if (interval === "last30Days") {
      for (let i = 30; i >= 0; i--) {
        bins.push({
          time: new Date(
            new Date().setDate(new Date().getDate() - i)
          ).getDate(),
          count: 0,
        });
      }
      response.forEach((element) => {
        bins.filter((bin) => {
          return bin.time === parseInt(element._id.date.split("-")[0]);
        })[0].count = element.count;
      });
    } else {
      response.forEach((element) => {
        bins.push({
          time: new Date(element._id.date + " " + element._id.time + ":00:00"),
          count: element.count,
        });
      });
      bins.sort((a, b) => {
        return a.time - b.time;
      });
    }

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
