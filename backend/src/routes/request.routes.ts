import { Router } from "express";
import { AppDataSource } from "../data-source";
import { VacationRequest } from "../entity/VacationRequest";
import { User, UserRole } from "../entity/User";

const router = Router();

// Create request
router.post("/", async (req, res) => {
  const { userId, startDate, endDate, reason } = req.body;

  const userRepo = AppDataSource.getRepository(User);
  const requestRepo = AppDataSource.getRepository(VacationRequest);

  const user = await userRepo.findOneBy({ id: userId });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const request = requestRepo.create({
    user,
    startDate,
    endDate,
    reason,
  });

  await requestRepo.save(request);

  res.json(request);
});

// Get all requests
router.get("/", async (_req, res) => {
  const repo = AppDataSource.getRepository(VacationRequest);
  const requests = await repo.find();
  res.json(requests);
});

// Update status (approve/reject)
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status, comments } = req.body;

  const repo = AppDataSource.getRepository(VacationRequest);

  await repo.update(id, { status, comments });

  const updatedRequest = await repo.findOneBy({ id: Number(id) });

  if (!updatedRequest) {
    return res.status(404).json({ error: "Request not found" });
  }

  res.json(updatedRequest);
});

// Delete request
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const repo = AppDataSource.getRepository(VacationRequest);
    const request = await repo.findOneBy({ id: Number(id) });

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    await repo.remove(request);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete request" });
  }
});

router.post("/seed", async (_req, res) => {
  const repo = AppDataSource.getRepository(User);

const users = repo.create([
  { name: "Alice", role: UserRole.REQUESTER },
  { name: "Bob", role: UserRole.VALIDATOR },
]);

  await repo.save(users);

  res.json(users);
});

export default router;
