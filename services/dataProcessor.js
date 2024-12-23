
import { getJiraTickets, updateJiraTicketStatus } from './jiraService.js';
import { sendToDynamics } from './dynamicsService.js';

export const processJiraTickets=async()=> {
  try {
    const tickets = await getJiraTickets();
    console.log(`Fetched ${tickets.length} tickets from Jira.`);

    for (const ticket of tickets) {
      const data = transformJiraData(ticket);
      await sendToDynamics(data);
      await updateJiraTicketStatus(ticket.id);
    }

    console.log('All tickets processed successfully.');
  } catch (error) {
    console.error('Error processing Jira tickets:', error);
    throw error;
  }
}

const transformJiraData=(ticket)=> {
  return {
    id: ticket.id,
    key: ticket.key,
    fields: {
      name: ticket.fields.customfield_12345, // Replace with actual field IDs
      address: ticket.fields.customfield_67890,
      // Add other fields as required
    },
  };
}