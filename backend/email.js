const nodemailer = require("nodemailer");

const sendEmail = async (res, email, subject, message, postmanmsg) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            }
        });

        await transporter.sendMail({
            from: process.env.SMTP_MAIL,
            to: email,
            subject,
            html: message
        });

        console.log("Mail sent successfully");

        res.status(201).json({
            status: "success",
            message: postmanmsg,
        });
    } catch (err) {
        console.error("Email sending error:", err);
        res.status(401).json({
            status: "Fail",
            message: "Can't send mail"
        });
    }
};

module.exports = sendEmail;