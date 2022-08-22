import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailsController } from './mail.controller';
import { MailService } from './mail.service';


// @Module({
//   imports: [
//     MailerModule.forRoot({
//       transport: {
//         host: "smtp.office365.com",
//         port: 587,
//         secure: false,
//         auth: {
//           user: "e2e.portal@e2eresearch.com",
//           pass: "WorlD#$123987%",
//         },
//         tls: {
//           rejectUnauthorized: false
//         }
//       },
//       defaults: {
//         from: "e2e.portal@e2eresearch.com",
//       },
//       template: {
//         dir: join(__dirname, '..', '/templates'),
//         adapter: new HandlebarsAdapter(),
//         options: {
//           strict: true,
//         },
//       },
//     }),
//   ],
//   providers: [MailService],
//   controllers: [MailsController],
//   exports: [MailService],
// })


@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: "smtp.office365.com",
          service: "office365",
          secure: false,
          auth: {
            user: "e2e.portal@e2eresearch.com",
            pass: "WorlD#$123987%",
          },
          tls: {
            rejectUnauthorized: false
          }
        },
        defaults: {
          from: 'e2e.portal@e2eresearch.com',
        },
        template: {
          dir: join(__dirname, '..', '/templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [MailService],
  controllers: [MailsController],
  exports: [MailService],
})


export class MailModule {}
