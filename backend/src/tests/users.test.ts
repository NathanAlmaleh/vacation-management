import request from "supertest";
import app from "../app";
import { AppDataSource } from "../data-source";

beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

describe("Users API", () => {
  it("should create a new user", async () => {
    const res = await request(app).post("/users").send({
      name: "Nathan",
      role: "requester",
    });

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Nathan");
  });
});
