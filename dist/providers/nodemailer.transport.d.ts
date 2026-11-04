import { Transporter } from 'nodemailer';
import { IEmailTransport, ITransportMessage, ITransportSendInfo } from './provider.interface';
export declare class NodemailerTransport implements IEmailTransport {
    private readonly transporter;
    private readonly closeExtra?;
    constructor(transporter: Transporter, closeExtra?: (() => void) | undefined);
    sendMail(message: ITransportMessage): Promise<ITransportSendInfo>;
    verify(): Promise<true>;
    close(): void;
}
//# sourceMappingURL=nodemailer.transport.d.ts.map