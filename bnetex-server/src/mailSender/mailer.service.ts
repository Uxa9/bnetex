import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendMail(email: string, code: string, subject: string) {
        await this.mailerService.sendMail({
            to: email,
            subject: subject,
            template: '/signup',
            context: {
                code: code
            }
        })
    }
}