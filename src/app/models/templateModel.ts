import { TemplateBuilderTypes } from "../enums/template-builder-types";
import { TemplateFooterBtns } from "../enums/template-footer-btns";
import { TemplateHeaderTypes } from "../enums/template-header-types";

export interface TemplateModel {
    templateName?: string;
    category?: string;
    type?: TemplateBuilderTypes;
    message?: TemplateMessage
}

export interface TemplateMessage {
    header: HeaderModel;
    body: string;
    footer: string;
    buttons?: BtnModel;
}

export interface HeaderModel {
    type: TemplateHeaderTypes;
    value: string;
}

export interface BtnModel {
    type: TemplateFooterBtns;
    // value: CTA_BtnModel[] | string[];
    value: any;
}

export interface CTA_BtnModel {
    type: TemplateFooterBtns;
    value: string;
}

export interface TEMPLATES {
    template_name: string;
    template_id: string;
    id: string;
}

export interface TEMPLATE_MODEL_RESPONSE {
    content: TEMPLATE_RESPONSE[]
    empty: string;
    first: string;
    last: boolean;
    number: number;
    numberOfElements: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface TEMPLATE_RESPONSE {
    "id": string;
    "templateId": string;
    "namespace": number;
    "name": string;
    "category": string;
    "template_type": string;
    "rejectedReason": string;
    "components": TEMPLATE_COMPONENT[];
    "language": string;
    "templateStatus": number;
    "created_at": string;
    "modified_at": string;
    "status": string;
    "rejected_reason": string;
    "modifyDate": string;
    "allow_category_change": boolean;
    "builderType": TemplateBuilderTypes
}

export interface TEMPLATE_COMPONENT {
    "type": string;
    "text": string;
    "format": TemplateHeaderTypes;
    "example"?: string;
    "buttons"?: BTN_COMPONENT[];
}

export interface BTN_COMPONENT {
    "id": number;
    "type": string;
    "text": string;
    "phone_number": string;
    "url": string;
    "example": string[];
    "phoneNumber": string;
}
export interface SEND_TEMPLATE_MODEL {
    name: string;
    from?: string;
    to?: string[];
    id: string;
    type: string;
    components?: SENT_TEMPLATE_COMPONENT[];
    parameters?: { type: string, text: string }[];
    language: { policy: string, code: string }
}

export interface SENT_TEMPLATE_COMPONENT { type: string, text?: string, parameters?: COMPONENT_PARAMETERS[] }
export interface COMPONENT_PARAMETERS { text?: string, type: string, order?: number, image: any }