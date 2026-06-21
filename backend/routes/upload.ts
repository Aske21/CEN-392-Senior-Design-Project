import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import { adminMiddleware } from "../middleware/admin-middleware";

const router = express.Router();

// POST /admin/uploads/url - attach an external image URL (no storage)
router.post("/url", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      res.status(400).json({ error: "url is required" });
      return;
    }

    try {
      // Basic validation
      // eslint-disable-next-line no-new
      new URL(url);
    } catch (_e) {
      res.status(400).json({ error: "Invalid URL" });
      return;
    }

    // For now, just return the provided URL. Frontend will store it on product.
    res.json({ url });
  } catch (error: any) {
    console.error("Error handling URL upload:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

export default router;
