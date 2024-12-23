import { authorizeJiraRequest } from "../middleware/authorization.js";
import {
  getJiraTickets,
  getTransitionIds,
  listenToJiraWebhook,
} from "../services/jiraService.js";

async function routes(fastify, options) {
  fastify.post("/", getJiraTickets);
  fastify.post("/transitions", getTransitionIds);
  fastify.post(
    "/webhook",
    {
      preHandler: authorizeJiraRequest,
    },
    listenToJiraWebhook
  );
}

export default routes;
