import { Router } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const router = Router();

/** GET all users */
router.get("/", async (_req, res) => {
  try {
    const repo = AppDataSource.getRepository(User);

    const users = await repo.find();

    res.json(users);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch users",
    });
  }
});

/** CREATE user */
router.post("/", async (req, res) => {
  try {
    const repo = AppDataSource.getRepository(User);

    const user = repo.create(req.body);

    await repo.save(user);

    res.json(user);
  } catch (err) {
    res.status(500).json({
      error: "Failed to create user",
    });
  }
});

/** Delete user */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const repo = AppDataSource.getRepository(User);

    const user = await repo.findOneBy({ id: Number(id) });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await repo.remove(user);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete user",
    });
  }
});

export default router;
