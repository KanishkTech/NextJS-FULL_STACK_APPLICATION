import { Message } from "@/models/User";
export interface ApiREsponse{
    success: boolean;
    message: string;
    isAccetting?: boolean;
    messages?: Array<Message>;

}