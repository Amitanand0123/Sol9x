import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    console.log("==========================================");
    console.log("📧 EMAIL PROCESS STARTED");

    // 1. Log Env Vars (Masked for security)
    console.log("DEBUG: Checking Env Vars...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Loaded" : "❌ MISSING");
    console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "✅ Loaded" : "❌ MISSING");
    console.log("GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "✅ Loaded" : "❌ MISSING");
    console.log("GOOGLE_REFRESH_TOKEN:", process.env.GOOGLE_REFRESH_TOKEN ? "✅ Loaded" : "❌ MISSING");

    // 2. Create Transporter with EXPLICIT Port 587
    // We do NOT use "service: 'gmail'" here to have full control over the port.
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,                 // <--- FORCE PORT 587 (Allowed on Render)
        secure: false,             // <--- Must be false for port 587
        requireTLS: true,          // <--- Force secure connection
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL_USER,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN
        },
        logger: true, // Log SMTP traffic to console
        debug: true   // Include debug info
    });

    const mailOptions = {
        from: `"Sol9x Support" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    console.log(`DEBUG: Sending to ${options.email}...`);

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ EMAIL SENT SUCCESSFULLY!");
        console.log("Message ID:", info.messageId);
        console.log("==========================================");
        return info;
    } catch (error) {
        console.error("❌ EMAIL SENDING FAILED:");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        if (error.response) console.error("SMTP Response:", error.response);
        console.log("==========================================");
        throw error;
    }
};

export default sendEmail;