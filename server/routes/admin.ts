import express from "express";
const router = express.Router();

// Example route (update with actual logic)
router.get("/", (req, res) => {
  res.json({ message: "Admin route working" });
});

export default router;
