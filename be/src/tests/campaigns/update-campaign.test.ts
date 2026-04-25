import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../app";
import { runMigrations, truncateTables, seedUser, seedCampaign } from "../helpers/db";
import { makeAuthCookie } from "../helpers/auth";
import { getCampaignById } from "../../db/campaigns";

describe("PATCH /campaigns/:id", () => {
  beforeAll(async () => {
    await runMigrations();
  });

  beforeEach(async () => {
    await truncateTables();
  });

  it("returns 401 when no cookie is present", async () => {
    await request(app)
      .patch(`/campaigns/${crypto.randomUUID()}`)
      .expect(401)
      .expect({ message: "unauthorized" });
  });

  it("returns 401 when the JWT is invalid", async () => {
    await request(app)
      .patch(`/campaigns/${crypto.randomUUID()}`)
      .set("Cookie", "token=badtoken")
      .expect(401)
      .expect({ message: "unauthorized" });
  });

  it("returns 400 when name is empty", async () => {
    const user = await seedUser();
    await request(app)
      .patch(`/campaigns/${crypto.randomUUID()}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ name: "" })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe("validation error");
      });
  });

  it("returns 400 when subject is empty", async () => {
    const user = await seedUser();
    await request(app)
      .patch(`/campaigns/${crypto.randomUUID()}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ subject: "" })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe("validation error");
      });
  });

  it("returns 400 when body is empty", async () => {
    const user = await seedUser();
    await request(app)
      .patch(`/campaigns/${crypto.randomUUID()}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ body: "" })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe("validation error");
      });
  });

  it("returns 400 when status is invalid", async () => {
    const user = await seedUser();
    await request(app)
      .patch(`/campaigns/${crypto.randomUUID()}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ status: "unknown" })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toBe("validation error");
      });
  });

  it("returns 404 when the campaign does not exist", async () => {
    const user = await seedUser();
    await request(app)
      .patch(`/campaigns/${crypto.randomUUID()}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ name: "New Name" })
      .expect(404)
      .expect({ message: "campaign not found" });
  });

  it("returns 409 when the campaign status is scheduled", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id, "scheduled");
    await request(app)
      .patch(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ name: "New Name" })
      .expect(409)
      .expect({ message: "only draft campaigns can be updated" });
  });

  it("returns 409 when the campaign status is sent", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id, "sent");
    await request(app)
      .patch(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ name: "New Name" })
      .expect(409)
      .expect({ message: "only draft campaigns can be updated" });
  });

  it("returns 200 and updates the name", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id);
    const res = await request(app)
      .patch(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ name: "Updated Name" })
      .expect(200);
    expect(res.body.name).toBe("Updated Name");
    const inDb = await getCampaignById(campaign.id);
    expect(inDb?.name).toBe("Updated Name");
  });

  it("returns 200 and updates the subject", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id);
    const res = await request(app)
      .patch(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ subject: "Updated Subject" })
      .expect(200);
    expect(res.body.subject).toBe("Updated Subject");
  });

  it("returns 200 and updates the body", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id);
    const res = await request(app)
      .patch(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ body: "Updated Body" })
      .expect(200);
    expect(res.body.body).toBe("Updated Body");
  });

  it("returns 200 and updates multiple fields at once", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id);
    const res = await request(app)
      .patch(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({ name: "New Name", subject: "New Subject", body: "New Body" })
      .expect(200);
    expect(res.body.name).toBe("New Name");
    expect(res.body.subject).toBe("New Subject");
    expect(res.body.body).toBe("New Body");
  });

  it("returns 200 with unchanged campaign for empty body", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id);
    const res = await request(app)
      .patch(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .send({})
      .expect(200);
    expect(res.body.name).toBe(campaign.name);
    expect(res.body.subject).toBe(campaign.subject);
    expect(res.body.body).toBe(campaign.body);
  });
});
