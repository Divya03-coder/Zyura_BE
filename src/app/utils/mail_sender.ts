import nodemailer from 'nodemailer';

import { configs } from '../configs';

type TMailContent = {
    to: string;
    subject: string;
    textBody: string;
    htmlBody: string;
    name?: string;
};

const transporter = nodemailer.createTransport({
    host: configs.mailgun.smtp_host as string,
    port: parseInt(configs.mailgun.smtp_port as string),
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: configs.mailgun.smtp_user,
        pass: configs.mailgun.smtp_pass,
    },
});


const sendMail = async (payload: TMailContent) => {
    try {
        const info = await transporter.sendMail({
            from: configs.mailgun.from,
            to: payload.to,
            subject: payload.subject,
            text: payload.textBody,
            html: payload.htmlBody,
        });

        return info;
    } catch (error) {
        console.error('Mail send failed:', error);
        throw error;
    }
};

export default sendMail;
