import * as Sentry from "@sentry/node"
import { Env } from "./env.config";

Sentry.init({
    dsn: Env.SENTRY_DNS,

    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
});