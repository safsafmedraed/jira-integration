import axios from 'axios';
import logger from '../logger/index.js';


export const getDynamicsToken=async()=> {
  try {
    const response = await axios.post(`${process.env.DYNAMICS_BASE_URL}/token`, {
      client_id: process.env.DYNAMICS_CLIENT_ID,
      client_secret: process.env.DYNAMICS_CLIENT_SECRET,
      grant_type: 'client_credentials',
    });
    return response.data.access_token;
  } catch (error) {
    logger.error('Error fetching Dynamics token:', error);
    throw error;
  }
}

export const sendToDynamics=async(data)=> {
  try {
    const token = await getDynamicsToken();
    const response = await axios.post(`${process.env.DYNAMICS_BASE_URL}/api/data/v9.1/EntitySet`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    logger.info('Data successfully sent to Dynamics:', response.data);
  } catch (error) {
    logger.error('Error sending data to Dynamics:', error);
    throw error;
  }
}
