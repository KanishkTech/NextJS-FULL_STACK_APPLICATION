import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verifycationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,

): Promise<ApiREsponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verifycation Email',
            react: VerificationEmail({ username,otp: verifyCode}),
          });
        return {success: true, message:"Verification email sent successfully"}
        
    } catch (emailerror) {
        console.error("Error sending verification email", emailerror);
        return {success: false, message:"Failed to send verifycation email"}
    }

}