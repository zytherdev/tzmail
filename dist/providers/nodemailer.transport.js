"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerTransport = void 0;
class NodemailerTransport {
    transporter;
    closeExtra;
    constructor(transporter, closeExtra) {
        this.transporter = transporter;
        this.closeExtra = closeExtra;
    }
    async sendMail(message) {
        const info = await this.transporter.sendMail(message);
        return info;
    }
    verify() {
        return this.transporter.verify();
    }
    close() {
        this.transporter.close();
        this.closeExtra?.();
    }
}
exports.NodemailerTransport = NodemailerTransport;
