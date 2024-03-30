import { connectDB } from "@/dbConfig/dbConfig";
import User from '@/models/userModel'
import { NextRequest,NextResponse } from 'next/server'
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDB()

export async function GET(request: NextRequest){
    //extract data from token
    const userID = await getDataFromToken(request)

    const user = await User.findOne({_id: userID}).select("-password")

    //check if there is no user

    if(!user) {
        return NextResponse.json(
            {error : "Invalid User/Token"},
            {status: 400}
        )
    }

    return NextResponse.json({
        message: "User Found",
        data: user
    })
}