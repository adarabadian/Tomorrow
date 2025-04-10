import cron from 'node-cron';
import { getAlerts } from '../models/Alert';
import { evaluateAlert } from './alertService';
// import { sendNotification } from './notificationService';

export const startAlertEvaluationService = () => {
  // Run every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {
      const alerts = await getAlerts();
      for (const alert of alerts) {
        const isTriggered = await evaluateAlert(alert);
        if (isTriggered) {
          // await sendNotification(alert);
        }
      }
    } catch (error) {
      console.error('Error in scheduled alert evaluation:', error);
    }
  });
}; 