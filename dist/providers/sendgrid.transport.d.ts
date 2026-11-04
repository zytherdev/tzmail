import { ISendGridConfig } from '../core/interfaces/email.interface';
import { ITransportMessage, ITransportSendInfo, IEmailTransport } from './provider.interface';
export declare class SendGridTransport implements IEmailTransport {
    private readonly config;
    private readonly apiUrl;
    private readonly fetchImpl;
    constructor(config: ISendGridConfig, fetchImpl?: typeof fetch);
    sendMail(message: ITransportMessage): Promise<ITransportSendInfo>;
}
//# sourceMappingURL=sendgrid.transport.d.ts.map