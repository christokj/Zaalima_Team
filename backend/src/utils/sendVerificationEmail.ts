import nodemailer from 'nodemailer';

export const sendVerificationEmail = async (to: string, code: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,        // your Gmail
            pass: process.env.EMAIL_PASS,        // app password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: 'Verify your account',
        html: `<h3>Your verification code is:</h3><p><b>${code}</b></p>`,
    };

    await transporter.sendMail(mailOptions);
};
