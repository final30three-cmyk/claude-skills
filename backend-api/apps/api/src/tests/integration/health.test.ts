import { createApp } from "../../app";
import request from "supertest";

describe("GET /health", () => {
  const app = createApp();

  it("should return 200 with status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.uptime).toBeGreaterThan(0);
  });
});
