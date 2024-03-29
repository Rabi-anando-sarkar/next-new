import { connectDB } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest,NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";

connectDB()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const { username,email,password } = reqBody
        // validations
        console.log(reqBody);

        // check if user already exists
        const user = await User.findOne({email})

        if(user) {
            return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            )
        }

        // hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()

        console.log(savedUser);
        
        // send verification mail

        await sendEmail({
            email,
            emailType: "VERIFY",
            userID: savedUser._id
        })

        return NextResponse.json({
            message: "User Registered succesfully",
            success: true,
            savedUser
        })

    } catch (error:any) {
        return NextResponse.json(
            {error: error.message},
            {status: 500}
        )
    }
}