import nodemailer, { Transporter } from 'nodemailer';
import { Alert } from '../models/Alert';
import dotenv from 'dotenv';
import { formatLocationString } from '../utils/locationUtils';
import { extractLocation } from '../utils/locationUtils';

dotenv.config();

interface EmailMessage {
  subject: string;
  text: string;
}

interface EmailConfig {
  from: string;
  to: string;
  subject: string;
  text: string;
}

//! I have an exmple working but didnt want to share sensitive info so this is just a POC
const getEmailConfig = (): {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string | undefined;
    pass: string | undefined;
  }
} => {
  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  };
};

const getSenderEmail = (): string => process.env.SMTP_FROM || 'weather-alerts@example.com';
const getFrontendUrl = (): string => process.env.FRONTEND_URL || 'http://localhost:3000';

//Create a transporter for sending emails
const createTransporter = (): Transporter => {
  const config = getEmailConfig();
  return nodemailer.createTransport(config);
};

// Setup email transporter (created once at module load)
const transporter = createTransporter();

const generateAlertMessage = (alert: Alert, currentValue: number): EmailMessage => {
  const location = extractLocation(alert);
  const locationString = formatLocationString({}, location);
  const conditionString = `${alert.parameter} ${alert.condition} ${alert.threshold}`;
  const frontendUrl = getFrontendUrl();
  
  return {
    subject: `Weather Alert: ${alert.name}`,
    text: `Alert "${alert.name}" has been triggered!
    
Location: ${locationString}
Condition: ${conditionString}
    
Current value: ${currentValue}
    
You can manage your alerts at: ${frontendUrl}/alerts`
  };
};


const createEmailConfig = (to: string, message: EmailMessage): EmailConfig => {
  return {
    from: getSenderEmail(),
    to,
    subject: message.subject,
    text: message.text
  };
};

const sendEmail = async (config: EmailConfig): Promise<void> => {
  try {
    await transporter.sendMail(config);
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
};

const validateAlertHasEmail = (alert: Alert): boolean => {
  if (alert.userEmail) return true;

  console.warn('No email address provided for alert:', alert.id);
  return false;
};

export const sendNotification = async (alert: Alert, currentValue: number): Promise<void> => {
  if (!validateAlertHasEmail(alert)) return;

  try {
    const message = generateAlertMessage(alert, currentValue);
    const emailConfig = createEmailConfig(alert.userEmail, message);
    await sendEmail(emailConfig);
    console.log(`Notification sent for alert ${alert.id}`);
  } catch (error) {
    console.error('Error in notification process:', error);
  }
}; 