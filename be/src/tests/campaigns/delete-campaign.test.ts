import { describe, it, expect, beforeAll, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../app";
import { runMigrations, truncateTables, seedUser, seedCampaign } from "../helpers/db";
import { makeAuthCookie } from "../helpers/auth";
import { getCampaignById } from "../../db/campaigns";

describe("DELETE /campaigns/:id", () => {
  beforeAll(async () => {
    await runMigrations();
  });

  beforeEach(async () => {
    await truncateTables();
  });

  it("returns 401 when no cookie is present", async () => {
    await request(app)
      .delete(`/campaigns/${crypto.randomUUID()}`)
      .expect(401)
      .expect({ message: "unauthorized" });
  });

  it("returns 401 when the JWT is invalid", async () => {
    await request(app)
      .delete(`/campaigns/${crypto.randomUUID()}`)
      .set("Cookie", "token=badtoken")
      .expect(401)
      .expect({ message: "unauthorized" });
  });

  it("returns 404 when the campaign does not exist", async () => {
    const user = await seedUser();
    await request(app)
      .delete(`/campaigns/${crypto.randomUUID()}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .expect(404)
      .expect({ message: "campaign not found" });
  });

  it("returns 409 when the campaign status is scheduled", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id, "scheduled");
    await request(app)
      .delete(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .expect(409)
      .expect({ message: "only draft campaigns can be updated" });
  });

  it("returns 409 when the campaign status is sent", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id, "sent");
    await request(app)
      .delete(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .expect(409)
      .expect({ message: "only draft campaigns can be updated" });
  });

  it("returns 204 and removes the campaign for a draft campaign", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id);
    await request(app)
      .delete(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .expect(204);
    const deleted = await getCampaignById(campaign.id);
    expect(deleted).toBeUndefined();
  });

  it("returns 404 on a second delete of the same campaign", async () => {
    const user = await seedUser();
    const campaign = await seedCampaign(user.id);
    await request(app)
      .delete(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .expect(204);
    await request(app)
      .delete(`/campaigns/${campaign.id}`)
      .set("Cookie", makeAuthCookie(user.id, user.email))
      .expect(404)
      .expect({ message: "campaign not found" });
  });
});
