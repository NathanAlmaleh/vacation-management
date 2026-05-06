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

  res.json({ success: true });
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
