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

      if (emailType === "VERIFY") {
          await User.findByIdAndUpdate(userID, { 
            $set:{verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000} 
          })
      } else if (emailType === "RESET"){
          await User.findByIdAndUpdate(userID, {
            $set:{forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}
          })
      }

        const transporter = nodemailer.createTransport({
          host: "sandbox.smtp.mailtrap.io",
          port: 2525,
          auth: {
            user: process.env.MAILER_AUTH_USER,
            pass: process.env.MAILER_AUTH_PASS
          }
        });

          const mailOptions = {
            from: '"Rabi anando sarkar" <rabianandosarkar@gmail.com>',
            to: email, 
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset Your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`,
          }

          const mailResponse = await transporter.sendMail(mailOptions)
          return mailResponse
    } catch (error:any) {
        throw new Error(error.message)
    }
}