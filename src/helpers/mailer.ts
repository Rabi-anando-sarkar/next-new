// we can set folder name as helpers or utils

import nodemailer from 'nodemailer'
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({
    email,
    emailType,
    userID
}:any) => {
    try {
        const hashedToken = await bcryptjs.hash(userID.toString(), 10)
        let verifyEmailHTML = ''
        let resetEmailHTML = ''


        if (emailType === "VERIFY") {
          verifyEmailHTML = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email" : "Reset your password"} or copy and paste the link below in your browser.<br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}'</p>`
          await User.findByIdAndUpdate(userID,
            {
              verifyToken: hashedToken,
              verifyTokenExpiry: Date.now() + 3600000
            })
        } else if(emailType === "RESET") {
          resetEmailHTML = `<p>Click <a href="${process.env.DOMAIN}/resetemail?token=${hashedToken}">here</a> to ${emailType === "RESET" ? "Reset your password" : "Verify your email"} or copy and paste the link below in your browser.<br> ${process.env.DOMAIN}/resetemail?token=${hashedToken}'</p>`
          await User.findByIdAndUpdate(userID,
            {
              forgotPasswordToken: hashedToken,
              forgotPasswordTokenExpiry: Date.now() + 900000
            })
        }

        const transporter = nodemailer.createTransport({
          host: "live.smtp.mailtrap.io",
          port: 587,
          auth: {
            user: process.env.MAILER_AUTH_USER,
            pass: process.env.MAILER_AUTH_PASS
          }
        });

          const mailOptions = {
            from: '"Rabi anando sarkar" <rabianandosarkar@gmail.com>',
            to: email, 
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset Your password",
            html: emailType === 'VERIFY' ? verifyEmailHTML : resetEmailHTML,
          }

          const mailResponse = await transporter.sendMail(mailOptions)
          return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}