import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendMail(email: string, code: string) {
        console.log(email);
        await this.mailerService.sendMail({
            to: email,
            subject: 'Код авторизации',
            template: '/signup',
            context: {
                code: code
            }
        })
    }
}