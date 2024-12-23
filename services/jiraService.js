import axios from "axios";

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
    console.error("Error fetching Jira tickets:", error);
    throw error.response ? error.response.data : error.message;
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

    console.log(`Ticket ${ticketId} updated successfully.`);
    return reply.status(200).send(`Ticket ${ticketId} updated successfully.`);
  } catch (error) {
    console.error("Error updating Jira ticket:",    error.response.data);

    if (error.response) {
      // If there is a response, use it to send more specific information
      return reply.status(error.response.status).send({
        status: error.response.status,
        message: error.response.data,
      });
    } else {
      return reply.status(500).send({
        status: 500,
        message: error.message,
      });
    }
  }
};

export const listenToJiraWebhook = async (request, reply) => {
  try {
    const { body } = request;

    if (body.webhookEvent === "jira:issue_updated") {
      const { issue } = body;
      console.log("Jira issue updated:", issue.key);
      console.log("Jira issue updated:", issue.fields.status.name);
      
      if (issue.fields.status.name === "In Progress") {
        return  await updateJiraTicketStatus(issue.key,reply);
      }
    }

  } catch (error) {
    console.error("Error processing Jira webhook:", error);
    reply.status(500).send("Error processing Jira webhook.");
  }
}
export const getTransitionIds = async (ticketId) => {
  try {
    const response = await axios.get(
      `${process.env.JIRA_BASE_URL}/rest/api/3/issue/10006/transitions`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`
          ).toString("base64")}`,
        },
      }
    );

    // Map the transitions
    const transitions = response.data.transitions.map((transition) => ({
      id: transition.id,
      name: transition.name,
    }));

    return transitions;
  } catch (error) {
    console.error("Error fetching transitions:", error);
    throw new Error('Unable to fetch transition IDs');
  }
};