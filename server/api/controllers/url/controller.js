import urlService from "../../services/url.service";
import l from "../../../common/logger";
import authenticationService from "../../services/authentication.service";

export class Controller {
  async addUrl(req, res) {
    try {
      const body = req.body;
      const user = req.user;
      const shortUrl = await urlService.addUrl(user, body);
      return res.status(200).json({ shortUrl });
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
      const id = req.query.id;
      const url = await urlService.getUrl(id);
      return res.status(200).json({ url });
    } catch (err) {
      l.error(err, "SHORT URL ERROR");
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async deleteUrl(req, res) {
    try {
      const user = req.user;
      const url = req.body;
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
      return res.status(200).json({ updatedUrl });
    } catch (err) {
      l.error(err, "SHORT URL ERROR");
      return res.status(500).json({ message: "Internal server error" });
    }
  }
  async redirectUrl(req, res) {
    try {
      const shortUrl = req.query.shorturl;
      const url = await urlService.redirectUrl(shortUrl);
      res.redriect(url);
    } catch (err) {
      l.error(err, "SHORT URL ERROR");
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
export default new Controller();
