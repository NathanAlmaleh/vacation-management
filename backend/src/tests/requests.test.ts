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

describe("Requests API", () => {
  it("should get all requests", async () => {
    const res = await request(app).get("/requests");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
