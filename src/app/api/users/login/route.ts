import { connectDB } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest,NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

connectDB()

export async function POST(request: NextRequest){
    try {
        const reqBody = await request.json()
        const {email,password} = reqBody

        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json(
                {error : "No user registered with this email"},
                {status: 400}
            )
        }

        const validPassword = await bcryptjs.compare(password, user.password)

        if(!validPassword){
            return NextResponse.json(
                {error : "Credentials don't match"},
                {status: 400}
            )
        }

        const tokenPayload = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = await jwt.sign(tokenPayload, process.env.TOKEN_SECRET!, {expiresIn: '1d'})
        
        const response = NextResponse.json({
            message: "Logged in succesfully",
            success: true
        })

        response.cookies.set("token",token, {
            httpOnly: true
        })

        return response

    } catch (error:any) {
        return NextResponse.json(
            {error: error.message},
            {status: 500}
        )
    }
}