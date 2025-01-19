import UserModel  from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request){
    await dbConnect();
    try {
        const {username,code} = await  request.json();
        const decodeUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username:decodeUsername});
        if(!user) {
            return Response.json({
                status:404,
                message:"User not found"
            },{status:400})
        }
        const isValidCode = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if(isValidCode && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success:true,
                message:"Verification successful"
            },{
                status:200
            });
        }else if(!isCodeNotExpired) {
            return Response.json({
                success:false,
                message:"Verification code has expired ,please signup again to get new verification code"
            },
        {
            status:400
        });
        } else{
            return Response.json({
                success:false,
                message:"Incorrect verification code"
            },{
                status:400
            })
        }
        
    } catch (error:any) {
    
        console.error("error while verifyCode validation", error);
        return Response.json({
            error: "error while verify code validation",
            status: 500
    
        })
      }
}