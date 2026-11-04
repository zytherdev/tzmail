import { Transporter } from 'nodemailer';
import { IEmailTransport, ITransportMessage, ITransportSendInfo } from './provider.interface';

export class NodemailerTransport implements IEmailTransport {
  constructor(private readonly transporter: Transporter, private readonly closeExtra?: () => void) {}

  async sendMail(message: ITransportMessage): Promise<ITransportSendInfo> {
    const info = await this.transporter.sendMail(message as never);
    return info as ITransportSendInfo;
  }

  verify(): Promise<true> {
    return this.transporter.verify();
  }

  close(): void {
    this.transporter.close();
    this.closeExtra?.();
  }
}
