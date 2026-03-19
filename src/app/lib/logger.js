import { connectToDatabase } from './mongodb'; // Your existing DB connection
import logSchema from '../models/logSchema';

export async function logUserAction({ userId, action, entity, entityId, details, ipAddress }) {
  try {
    await connectToDatabase();
    const log = new logSchema({
      userId,
      action,
      entity,
      entityId,
      details,
      ipAddress,
    });
    await log.save();
    console.log('Action logged successfully');
  } catch (error) {
    console.error('Error logging action:', error);
    // Optionally, throw or handle error without blocking the main action
  }
}