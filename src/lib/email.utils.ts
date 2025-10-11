import nodemailer from 'nodemailer'

export async function sendEmail({recipient, subject, text}: { recipient: string, subject: string, text: string }): Promise<void> {
    try{
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: recipient,
            subject: subject,
            text: text
        });
        console.log(`Email sent to ${recipient}: `, info.messageId);
    }catch(e){
        console.error("Error sending email: ", e);
    }
}