import { sendVerificationEmail } from "@/helpers/sendVerifycationEmail";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";

await dbConnect();
export async function POST(req: Request) {
  try {
    //data coming from frontend
    const { username, email, password } = await req.json();
    const existing_user_verifed_by_username = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existing_user_verifed_by_username) {
      return Response.json(
        {
          success: false,
          message: "User already exists with the same username",
        },
        {
          status: 400,
        }
      );
    }
    const existing_user_by_email = await UserModel.findOne({
      email,
      isVerified: true,
    });

    const verifyCode = Math.floor(10000+Math.random()*900000).toString()

    if (existing_user_by_email) {
        if(existing_user_by_email.isVerified) {
            return Response.json({
                success: false,
                message: "User already exist with this email.",
            },{status: 400})
        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            existing_user_by_email.password = hashedPassword
            existing_user_by_email.verifyCode = verifyCode
            existing_user_by_email.verifyCodeExpiry = new Date(Date.now()+3600000)

            await existing_user_by_email.save()
        }   
    }else{
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1);
        const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry:expiryDate,
            isVerified: false,
            isAcceptingMassage:true,
            messages:[]

        })
        await newUser.save()
    }

    //send verifycation email
    const emailResponse = await sendVerificationEmail(email,username,verifyCode)
    if(!emailResponse.success){
        return Response.json({
            success: false,
            message: emailResponse.message,
        },{status: 200})
    }
    return Response.json({success: true, message:"user Registered successfully. please verify your email"},{status: 201})

  } catch (error) {
    console.error("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
