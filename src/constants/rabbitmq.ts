export const RABBITMQ = {
  email: {
    exchange: "email_exchange",
    queue: "email_queue",
    routingKey: "email_send",
  },
  workspaceDomain: {
    exchange: "workspace_domain_exchange",
    queue: "workspace_domain_verify_queue",
    routingKey: "workspace_domain.verify",
  },
  realtime: {
    exchange: "realtime_exchange",
    routingKey: "notification",
  },
} as const;
