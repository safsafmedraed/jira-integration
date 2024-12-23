
import { getJiraTickets, updateJiraTicketStatus } from './jiraService.js';
import { sendToDynamics } from './dynamicsService.js';
import logger from '../logger/index.js';

export const processJiraTickets=async()=> {
  try {
    const tickets = await getJiraTickets();
    console.log(`Fetched ${tickets.length} tickets from Jira.`);

    for (const ticket of tickets) {
      const data = transformJiraData(ticket);
      await sendToDynamics(data);
      await updateJiraTicketStatus(ticket.id);
    }

    logger.info('All tickets processed successfully.');
  } catch (error) {
    logger.error('Error processing Jira tickets:', error);
    throw error;
  }
}

const transformJiraData=(ticket)=> {
  return {
    id: ticket.id,
    key: ticket.key,
    fields: {
      name: ticket.fields.customfield_12345, 
      address: ticket.fields.customfield_67890,
      
    },
  };
}