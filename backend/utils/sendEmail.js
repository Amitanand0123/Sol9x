import { google } from 'googleapis';

const sendEmail = async (options) => {

    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    try {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        const subject = `Subject: ${options.subject}`;
        const to = `To: ${options.email}`;
        const from = `From: "Sol9x Support" <${process.env.EMAIL_USER}>`;
        const contentType = 'Content-Type: text/html; charset=utf-8';
        const mime = 'MIME-Version: 1.0';
        
        const messageParts = [
            from,
            to,
            subject,
            mime,
            contentType,
            '',
            options.message
        ];
        
        const rawMessage = messageParts.join('\n');
        
        const encodedMessage = Buffer.from(rawMessage)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        return response.data;

    } catch (error) {
        console.error(error.message);
        if (error.response) console.error(error.response.data);
        throw error;
    }
};

export default sendEmail;