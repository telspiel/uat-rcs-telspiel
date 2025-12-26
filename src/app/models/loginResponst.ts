import { User } from "./user-model";

export interface LoginResponse {
    authJwtToken: string;
    success: boolean;
    message: string;
    user: User;
    result: string;
    data:any
}