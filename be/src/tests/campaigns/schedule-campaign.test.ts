import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../app";
import {
  runMigrations,
  truncateTables,
  seedUser,
  seedCampaign,
} from "../helpers/db";
import { makeAuthCookie } from "../helpers/auth";

describe("POST /campaigns/:id/schedule", () => {
  beforeAll(async () => {
    await runMigrations();
  });

  beforeEach(async () => {
    await truncateTables();
  });

  const futureDate = () => new Date(Date.now() + 60_000).toISOString();

  it("returns 401 when no cookie is present", async () => {
    await request(app)
      .post(`/campaigns/${crypto.randomUUID()}/schedule`)
      .expect(401)
      .expect({ message: "unauthorized" });
  });

  it("returns 401 when the JWT is invalid", async () => {
    await request(app)
      .post(`/campaigns/${crypto.randomUUID()}/schedule`)
      .set("Cookie", "token=badtoken")
      .expect(401)
      .expect({ message: "unauthorized" });
  });

  it("returns 400 when scheduledAt is missing", async () => {
    const user = await seedUser();
    await request(app)
      .post(`/campaigns/${crypto.randomUUID()}/schedule`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({})
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe("validation error");
      });
  });

  it("returns 400 when scheduledAt is not a valid ISO datetime", async () => {
    const user = await seedUser();
    await request(app)
      .post(`/campaigns/${crypto.randomUUID()}/schedule`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ scheduledAt: "not-a-date" })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe("validation error");
      });
  });

  it("returns 400 when scheduledAt is in the past", async () => {
    const user = await seedUser();
    await request(app)
      .post(`/campaigns/${crypto.randomUUID()}/schedule`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ scheduledAt: new Date(Date.now() - 60_000).toISOString() })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe("validation error");
      });
  });

  it("returns 404 when the campaign does not exist", async () => {
    const user = await seedUser();
    await request(app)
      .post(`/campaigns/${crypto.randomUUID()}/schedule`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ scheduledAt: futureDate() })
      .expect(404)
      .expect({ message: "campaign not found" });
  });

  it("returns 409 when the campaign status is scheduled", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id, "scheduled");
    await request(app)
      .post(`/campaigns/${campaign.id}/schedule`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ scheduledAt: futureDate() })
      .expect(409)
      .expect({ message: "only draft campaigns can be updated" });
  });

  it("returns 409 when the campaign status is sent", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id, "sent");
    await request(app)
      .post(`/campaigns/${campaign.id}/schedule`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ scheduledAt: futureDate() })
      .expect(409)
      .expect({ message: "only draft campaigns can be updated" });
  });

  it("returns 200 and schedules the campaign", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id);
    const scheduledAt = futureDate();
    const res = await request(app)
      .post(`/campaigns/${campaign.id}/schedule`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ scheduledAt })
      .expect(200);
    expect(res.body.status).toBe("scheduled");
    expect(res.body.scheduledAt).toBeTruthy();
  });
});
