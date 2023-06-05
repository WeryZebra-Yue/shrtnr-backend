import urlService from "../../services/url.service";
import l from "../../../common/logger";
import authenticationService from "../../services/authentication.service";

export class Controller {
  async addUrl(req, res) {
    try {
      const body = req.body;
      const user = req.user;
      const shortUrl = await urlService.addUrl(user, body);
      return res.status(200).json(shortUrl);
    } catch (err) {
      l.error(err, "SHORT URL ERROR");
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async getAllUrl(req, res) {
    try {
      const user = req.user;
      const urls = await urlService.getAllUrl(user);
      return res.status(200).json({ urls });
    } catch (err) {
      l.error(err, "SHORT URL ERROR");
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async getUrl(req, res) {
    try {
      const urlId = req.query.id;
      const userId = req.user.id;
      const url = await urlService.getUrl(userId, urlId);
      return res.status(200).json(url);
    } catch (err) {
      l.error(err, "SHORT URL ERROR");
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteUrl(req, res) {
    try {
      const user = req.user;
      const url = req.body.id;
      const deletedUrl = await urlService.deleteUrl(user, url);
      return res.status(200).json({ deletedUrl });
    } catch (err) {
      l.error(err, "SHORT URL ERROR");
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async updateUrl(req, res) {
    try {
      const user = req.user;
      const url = req.body;
      const updatedUrl = await urlService.updateUrl(user, url);
      return res.status(200).json(updatedUrl);
    } catch (err) {
      l.error(err, "SHORT URL ERROR");
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async redirectUrl(req, res) {
    try {
      const shortUrl = req.params.shorturl;
      const ip = req?.socket.remoteAddress || req?.connection.remoteAddres;
      const url = await urlService.redirectUrl(shortUrl);
      res.redirect(url);
    } catch (err) {
      l.error(err, "SHORT URL ERROR");
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async getAnalytics(req, res) {
    try {
      const urlId = req.query.id;
      const start = req.query.start;
      const end = req.query.end;
      const interval = req.query.interval;
      const user = req.user.id;
      const analytics = await urlService.getAnalytics(
        urlId,
        user,
        {
          start,
          end,
        },
        interval
      );
      return res.status(200).json(analytics);
    } catch (err) {
      l.error(err, "SHORT URL ERROR");
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
export default new Controller();
