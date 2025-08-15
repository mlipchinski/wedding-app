export interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    from?: string;
};