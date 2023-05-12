import express from "express";
import { lineMiddleware } from "../services/line_connection.js";
import { handleEvent } from "../controllers/bot_controller.js";

const router = express.Router();

router.post("/bot", lineMiddleware, (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

export default router;
