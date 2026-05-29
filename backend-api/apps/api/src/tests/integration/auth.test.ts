import { createApp } from "../../app";
import request from "supertest";

describe("Auth endpoints", () => {
  const app = createApp();

  const testUser = {
    email: "integration@example.com",
    password: "securepassword123",
    name: "Integration Test",
  };

  it("POST /api/auth/register should create a user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.tokens.accessToken).toBeDefined();
  });

  it("POST /api/auth/login should authenticate", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.status).toBe(200);
    expect(res.body.data.tokens.accessToken).toBeDefined();
  });

  it("POST /api/auth/login should reject bad credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });
});
