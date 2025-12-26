import { TEMPLATE_COMPONENT } from "./templateModel"

export interface SendMessageHistory {
    content: MessageContent[],
    pageable: any,
    last: boolean,
    totalPages: number,
    totalElements: number,
    size: number,
    number: number,
    sort: sortArray,
    first: boolean,
    numberOfElements: number,
    empty: boolean
}

export interface MessageContent {
    namespace: string
    id: string,
    messageId: string,
    pricing: any,
    // components: TemplateComponent[],
    components: TEMPLATE_COMPONENT[],
    status: string,
    message: { recipient_id: string, media_id: string },
    timestamp: string,
    templateName: string,
    templateId: string,
    type: string,
    createdAt: string,
    updatedAt: string,
    readDate: string,
    deliverDate: string
}

export interface sortArray {
    "empty": boolean,
    "sorted": boolean,
    "unsorted": boolean
}

export interface TemplateComponent {
    "type": string,
    "text": string,
    "format": string,
    "example": string,
    "buttons": string,
    "parameters": ComponentParams[]
}

export interface ComponentParams {
    "id": string,
    "type": string,
    "text": string,
    "image"?: any,
    "order": number
}
