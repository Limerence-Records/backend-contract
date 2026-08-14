import { z } from "zod";
import { RABBITMQ } from "../../constants";
import { EmailAddressSchema } from "../../models";

export namespace SendEmailCommand {
  export const exchange = RABBITMQ.email.exchange;
  export const queue = RABBITMQ.email.queue;
  export const routingKey = RABBITMQ.email.routingKey;

  export const PayloadSchema = z
    .object({
      id: z.string().min(1),
      from: EmailAddressSchema,
      fromName: z.string().trim().min(1).max(255).optional(),
      to: z.array(EmailAddressSchema),
      cc: z.array(EmailAddressSchema),
      bcc: z.array(EmailAddressSchema),
      subject: z.string().max(998).optional(),
      text: z.string().optional(),
      html: z.string().optional(),
      inReplyTo: z.string().max(512).optional(),
      references: z.string().optional(),
      headers: z.record(z.string(), z.string()).optional(),
      recipientIds: z.array(z.string().min(1)),
      requestId: z.string().uuid().optional(),
      tags: z.array(z.string()).optional(),
    })
    .superRefine((payload, context) => {
      if (payload.to.length + payload.cc.length + payload.bcc.length === 0) {
        context.addIssue({
          code: "custom",
          message: "At least one recipient is required in to, cc, or bcc",
          path: ["to"],
        });
      }

      if (!payload.text?.trim() && !payload.html?.trim()) {
        context.addIssue({
          code: "custom",
          message: "At least one message body is required in text or html",
          path: ["text"],
        });
      }
    });

  export type Payload = z.infer<typeof PayloadSchema>;
}
