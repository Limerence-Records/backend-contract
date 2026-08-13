import { z } from "zod";

export const EmailAddressSchema = z.string().trim().email().max(320);

export type EmailAddress = z.infer<typeof EmailAddressSchema>;
