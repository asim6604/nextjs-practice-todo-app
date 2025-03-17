import  Note  from '@/models/noteModels';
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from  'jsonwebtoken'
import connectDB from '@/lib/connectdb';
export async function GET(req:Request) {
  connectDB()
   
    try {
     const cookieStore=await cookies();
     const token=cookieStore.get("token")?.value;
        if(!token){
            return NextResponse.json({
                message:"You are not logged in",
            },{
                status:401
            })
        }
       const decoded= jwt.verify(token,process.env.JWT_SECRET!)as {id:string};
       const notes=await Note.find({
        createdBy:decoded.id
       })
      
       return NextResponse.json({
        notes:notes
       },{
        status:200
       })

    } catch (error) {
        console.log("this is error",error);
        return NextResponse.json({
            message:"Something went wrong",
        },{
            status:500
        })
    }
}