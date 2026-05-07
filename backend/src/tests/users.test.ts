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

  it("should delete the new user", async () => {
    const fetchUsers = await request(app).get("/users");
    const parseUsers = await JSON.parse(fetchUsers.text);
    const nathan = parseUsers.find((u: any) => u.name === "Nathan");
    expect(nathan).toBeTruthy();

    const res = await request(app).delete(`/users/${nathan.id}`);
    expect(res.status).toBe(200);
  });

  it("should create seeds", async () => {
    await request(app).post("/users/seed");
    const fetchUsers = await request(app).get("/users");
    const parseUsers = await JSON.parse(fetchUsers.text);
    const Alice = parseUsers.find((u: any) => u.name === "Alice");
    const Bob = parseUsers.find((u: any) => u.name === "Bob");
    expect(Alice).toBeTruthy();
    expect(Bob).toBeTruthy();

    await request(app).delete(`/users/${Alice.id}`);
    await request(app).delete(`/users/${Bob.id}`);
  });
});
