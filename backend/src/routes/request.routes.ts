import { Router } from "express";
import { AppDataSource } from "../data-source";
import { VacationRequest } from "../entity/VacationRequest";

const router = Router();
const repo = AppDataSource.getRepository(VacationRequest);

// Create request
router.post("/", async (req, res) => {
  try {
    const request = repo.create(req.body);
    await repo.save(request);
    res.json(request);
  } catch (err) {
    res.status(500).json({ error: "Failed to create request" });
  }
});

// Get all requests
router.get("/", async (_req, res) => {
  const requests = await repo.find();
  res.json(requests);
});

// Update status (approve/reject)
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  await repo.update(id, { status });
  res.json({ success: true });
});

export default router;