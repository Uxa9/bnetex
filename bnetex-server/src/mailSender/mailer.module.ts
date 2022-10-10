import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        MailerModule.forRoot({
            transport: {
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                secure: Boolean(process.env.SMTP_SECURE),
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS
                }
            },
            defaults: {
                from: '"No Reply" <bnetex.com>'
            },
            template: {
                dir: `${process.cwd()}/src/mailSender/mailTemplates`,
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true
                }
            }
        })
    ]
})
export class MailSenderModule { }
