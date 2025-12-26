import { MessageContent } from "./send-message-hook"

export interface DashboardStats {
    "id": string,
    "statusName": string,
    "statusFrom": string,
    "count": number,
    "createdAt": string,
    "updatedAt": string,
    "address": string,
}

export interface MessageHistory {
    // Parameter: any
    id: string,
    messageId: string,
    recipient: string,
    status: string,
    templateName?: string,
    messageBody: string,
    createdAt: string,
    updatedAt: string,
    readDate: string,
    deliverDate: string,
    rawData: MessageContent
}

