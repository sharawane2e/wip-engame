import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, CACHE_MANAGER, Inject } from '@nestjs/common';

@Injectable()
export class MailService {
    
    constructor(private readonly mailService: MailerService) {}

    async sendMail(templatePath: string, recipient: string, subject: string, context?: object) {
        try {
            await this.mailService.sendMail({
                to: recipient,
                subject,
                template: templatePath,
                context,
            });

            return true;
        } 
        catch (error) {
            return error;
        }
    }

    async mailGenerator(recipientMail: string, subject: string, templatePath: string, templateContext: object) {
        try {
            await this.mailService.sendMail({
                to: recipientMail,
                subject: subject,
                template: templatePath,
                context: templateContext,
            });
            return true;
        } 
        catch (error) {
            return false;
        }
    }

    async customMail(context:any){
        // const response = await this.sendMail(
        //     './activation-successful',
        //     "gaurav.sekhri@e2eresearch.com",
        //     "mailMessages.ACTIVATION_SUCCESS_MAIL_SUBJECT",
        //     {
        //       name: "updatedUser.firstName",
        //       loginLink: "envConfig.uiUrl.uiBaseUrl}login",
        //     },
        // );
        const response = await this.mailService.sendMail({
            to: "gaurav.sekhri@e2eresearch.com",
            from: "e2e.portal@e2eresearch.com",
            subject: 'Welcome to Engame 2.0 !',
            text: 'Welcome NestJS Email Sending Tutorial', 
            template: "./activation-successful",
            context: context
            // context: {
            //     name: "Gaurav",
            //     loginLink: "http://localhost:3000/"
            // }
           });
        return response
    }

}
