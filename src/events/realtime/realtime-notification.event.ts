import { z } from "zod";
import { RABBITMQ } from "../../constants";

export const RealtimeNotificationAction = {
  PING: "ping",
  NEW_EMAIL: "new_email",
  DOMAIN_CHECK: "domain_check",
} as const;

export type RealtimeNotificationAction =
  (typeof RealtimeNotificationAction)[keyof typeof RealtimeNotificationAction];

export namespace RealtimeNotificationEvent {
  export const exchange = RABBITMQ.realtime.exchange;
  export const routingKey = RABBITMQ.realtime.routingKey;

  export const NotificationSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    action: z.enum([
      RealtimeNotificationAction.PING,
      RealtimeNotificationAction.NEW_EMAIL,
      RealtimeNotificationAction.DOMAIN_CHECK,
    ]),
    from: z.record(z.string(), z.unknown()).optional(),
    payload: z.unknown().optional(),
  });

  export const PayloadSchema = z.object({
    userIds: z.array(z.number().int().positive()).min(1).optional(),
    payload: NotificationSchema,
  });

  export type Notification = z.infer<typeof NotificationSchema>;
  export type Payload = z.infer<typeof PayloadSchema>;
}
