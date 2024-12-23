import axios from "axios";
import logger from "../logger/index.js";
import ErrorHandler from "../middleware/errorHandler.js";

const jql = `status = "${process.env.JIRA_STATUS}" AND issuetype = "${process.env.JIRA_TASK}"`;
const fields= 'summary,status,assignee,created,updated,priority,issuetype,description';

export const getJiraTickets = async () => {
  try {
    const response = await axios.get(
      `${process.env.JIRA_BASE_URL}/rest/api/3/search`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
          ).toString("base64")}`,
        },
        params: {
          jql,
          fields,
          maxResults: 50,
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error("Error fetching Jira tickets:", error);
    return new ErrorHandler(error, reply);
  }
};

export const updateJiraTicketStatus = async (ticketId, reply) => {
  try {
    await axios.post(
      `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${ticketId}/transitions`,
      {
        transition: {
          id: 31
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
             `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
          ).toString("base64")}`,
        },
      }
    );

    logger.info(`Ticket ${ticketId} updated successfully.`);
    return reply.status(200).send(`Ticket ${ticketId} updated successfully.`);
  } catch (error) {
    logger.error("Error updating Jira ticket:",    error.response.data);
    return new ErrorHandler(error, reply);
  }
};

export const listenToJiraWebhook = async (request, reply) => {
  try {
    const { body } = request;

    if (body.webhookEvent === "jira:issue_updated") {
      const { issue } = body;
      logger.info("Jira issue updated:", issue.key);
      
      if (issue.fields.status.name === "In Progress") {
        return  await updateJiraTicketStatus(issue.key,reply);
      }
    }

  } catch (error) {
    logger.error("Error processing Jira webhook:", error);
    return new ErrorHandler(error, reply);
  }
}
export const getTransitionIds = async (request,reply) => {
  try {
    const {ticketId}=request.body;
    const response = await axios.get(
      `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${ticketId}/transitions`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
          ).toString("base64")}`,
        },
      }
    );

    const transitions = response.data.transitions.map((transition) => ({
      id: transition.id,
      name: transition.name,
    }));

    return transitions;
  } catch (error) {
    logger.error("Error fetching transitions:", error);
    return new ErrorHandler(error, reply);
  }
};