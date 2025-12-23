import { google } from 'googleapis';

const sendEmail = async (options) => {
    console.log("==========================================");
    console.log("🚀 SENDING VIA GOOGLE REST API (NO SMTP)");

    const oAuth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    try {
        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        // 1. Construct the Raw Email (MIME Format)
        // We use base64url encoding as required by Gmail API
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
        
        // 2. Encode to Base64URL
        const encodedMessage = Buffer.from(rawMessage)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        // 3. Send via HTTP Request (Port 443)
        const response = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        console.log("✅ EMAIL SENT VIA HTTP!");
        console.log("Response ID:", response.data.id);
        console.log("==========================================");
        return response.data;

    } catch (error) {
        console.error("❌ HTTP API ERROR:");
        console.error(error.message);
        if (error.response) console.error(error.response.data);
        throw error;
    }
};

export default sendEmail;