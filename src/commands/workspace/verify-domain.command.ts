import { z } from "zod";
import { RABBITMQ } from "../../constants";

export const WorkspaceDomainVerifySource = {
  DOMAIN_CREATED: "domain_created",
  MANUAL_VERIFY: "manual_verify",
  SCHEDULED_VERIFY: "scheduled_verify",
} as const;

export type WorkspaceDomainVerifySource =
  (typeof WorkspaceDomainVerifySource)[keyof typeof WorkspaceDomainVerifySource];

export namespace VerifyWorkspaceDomainCommand {
  export const exchange = RABBITMQ.workspaceDomain.exchange;
  export const queue = RABBITMQ.workspaceDomain.queue;
  export const routingKey = RABBITMQ.workspaceDomain.routingKey;

  export const PayloadSchema = z.object({
    commandId: z.string().uuid(),
    requestedAt: z.string().datetime({ offset: true }),
    workspaceId: z.string().min(1),
    domainId: z.string().min(1),
    source: z.enum([
      WorkspaceDomainVerifySource.DOMAIN_CREATED,
      WorkspaceDomainVerifySource.MANUAL_VERIFY,
      WorkspaceDomainVerifySource.SCHEDULED_VERIFY,
    ]),
  });

  export type Payload = z.infer<typeof PayloadSchema>;
}
