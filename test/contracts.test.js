const assert = require("node:assert/strict");
const test = require("node:test");

const {
  RealtimeNotificationEvent,
  SendEmailCommand,
  VerifyWorkspaceDomainCommand,
} = require("../dist");

test("parses a valid email command", () => {
  const result = SendEmailCommand.PayloadSchema.parse({
    id: "309",
    from: "team@limerencerecords.com",
    to: ["recipient@example.com"],
    cc: [],
    bcc: [],
    subject: "Release schedule",
    text: "Plain text body",
    recipientIds: ["901"],
  });

  assert.equal(result.id, "309");
});

test("rejects an email command without recipients", () => {
  const result = SendEmailCommand.PayloadSchema.safeParse({
    id: "309",
    from: "team@limerencerecords.com",
    to: [],
    cc: [],
    bcc: [],
    text: "Plain text body",
    recipientIds: [],
  });

  assert.equal(result.success, false);
});

test("parses a workspace-domain verification command", () => {
  const result = VerifyWorkspaceDomainCommand.PayloadSchema.parse({
    commandId: "17f220db-b8e6-49f6-8e4a-6297d5f5d507",
    requestedAt: "2026-03-09T11:40:00.000Z",
    workspaceId: "12",
    domainId: "7",
    source: "manual_verify",
  });

  assert.equal(result.source, "manual_verify");
});

test("parses a targeted realtime notification", () => {
  const result = RealtimeNotificationEvent.PayloadSchema.parse({
    userIds: [41],
    payload: {
      action: "new_email",
      payload: { id: "309" },
    },
  });

  assert.deepEqual(result.userIds, [41]);
});
