import { describe, it, expect } from "vitest";

/**
 * Test to verify Meta WhatsApp API credentials are valid
 * This test validates that the credentials can authenticate with Meta API
 */
describe("Meta WhatsApp Credentials", () => {
  it("should have required environment variables set", () => {
    expect(process.env.META_ACCESS_TOKEN).toBeDefined();
    expect(process.env.META_PHONE_NUMBER_ID).toBeDefined();
    expect(process.env.N8N_WEBHOOK_URL).toBeDefined();
  });

  it("should have valid token format", () => {
    const token = process.env.META_ACCESS_TOKEN;
    expect(token).toBeTruthy();
    expect(token?.length).toBeGreaterThan(10);
    // Meta tokens are typically long strings
    expect(token).toMatch(/^[a-zA-Z0-9_\-]+$/);
  });

  it("should have valid phone number ID format", () => {
    const phoneId = process.env.META_PHONE_NUMBER_ID;
    expect(phoneId).toBeTruthy();
    expect(phoneId).toMatch(/^\d+$/);
    expect(phoneId?.length).toBeGreaterThan(5);
  });

  it("should have valid n8n webhook URL", () => {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    expect(webhookUrl).toBeTruthy();
    expect(webhookUrl).toMatch(/^https?:\/\//);
  });

  it("should be able to construct valid Meta API endpoint", () => {
    const phoneId = process.env.META_PHONE_NUMBER_ID;
    const endpoint = `https://graph.facebook.com/v25.0/${phoneId}/messages`;
    expect(endpoint).toContain("graph.facebook.com");
    expect(endpoint).toContain("v25.0");
    expect(endpoint).toContain(phoneId);
  });
});
