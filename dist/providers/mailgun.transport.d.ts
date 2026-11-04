import { IMailgunConfig } from '../core/interfaces/email.interface';
import { ITransportMessage, ITransportSendInfo, IEmailTransport } from './provider.interface';
export declare class MailgunTransport implements IEmailTransport {
    private readonly config;
    private readonly apiUrl;
    private readonly fetchImpl;
    constructor(config: IMailgunConfig, fetchImpl?: typeof fetch);
    sendMail(message: ITransportMessage): Promise<ITransportSendInfo>;
}
//# sourceMappingURL=mailgun.transport.d.ts.map