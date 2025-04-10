import nodemailer from 'nodemailer';
import { Alert } from '../models/Alert';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

export const sendNotification = async (alert: Alert) => {
  if (!alert.userEmail) {
    console.warn('No email address provided for alert:', alert.id);
    return;
  }

  const message = {
    from: process.env.SMTP_FROM || 'weather-alerts@example.com',
    to: alert.userEmail,
    subject: `Weather Alert: ${alert.name}`,
    text: `Alert "${alert.name}" has been triggered!
    
Location: ${alert.location.city || `${alert.location.coordinates?.lat}, ${alert.location.coordinates?.lon}`}
Condition: ${alert.parameter} ${alert.condition} ${alert.threshold}
    
// Current value: //add dollar here{alert.lastValue}
    
You can manage your alerts at: ${process.env.FRONTEND_URL}/alerts`
  };

  try {
    await transporter.sendMail(message);
    console.log(`Notification sent for alert ${alert.id}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}; 