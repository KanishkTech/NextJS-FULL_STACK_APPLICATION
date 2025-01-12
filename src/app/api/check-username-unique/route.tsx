import { z } from "zod";
import { usernameValidation } from "@/Schemas/signUpSchema";
import { User } from "@/models/User";
import dbConnect from "@/lib/dbConnect";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});
export async function GET(request: Request) {
  await dbConnect();
  try {
    
    const {searchParams} = new URL(request.url)
    const queryParam ={
        username:searchParams.get('username')
    }
    const result = UsernameQuerySchema.safeParse(queryParam)
    console.log(result)
    if (!result.success) {
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json({
            success:false,
            message:usernameErrors?.length>0?usernameErrors.join(","):"Invalid query parameters "
        },{
            status:400
        })
    }
    const {username} = result.data
    const user =  await User.findOne({username,isVerified:true})
    if(!user){
        return Response.json({
            success:false,
            message:"User not found"

        },
        {
            status:404
        }
    )
    }
  } catch (error:any) {
    
    console.error("error while username validation", error);
    return Response.json({
        error: "error while username validation",
        status: 500

    })
  }
}
