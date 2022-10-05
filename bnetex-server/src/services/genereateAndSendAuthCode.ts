import * as nodemailer from 'nodemailer'

const genereateAndSendAuthCode = async (email: string, type: string = "auth") => {
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Boolean(process.env.SMTP_SECURE),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const makeLink = (length: number) => {
        var result           = '';
        var characters       = '0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * 
            charactersLength));
       }
       return result;
    }

    const authCode = makeLink(6);

    switch (type) {
        case "auth":
            await transporter.sendMail({
                from: `"Bnetex bot" <${process.env.SMTP_USER}>`, // sender address
                to: email, // list of receivers
                subject: "Код подтверждения", // Subject line
                html: `<p>${authCode},</p>`, // html body
            });
        
            return authCode;

        case "withdraw":
            await transporter.sendMail({
                from: `"Bnetex bot" <${process.env.SMTP_USER}>`, // sender address
                to: email, // list of receivers
                subject: "Вывод средств", // Subject line
                html: `<p>${authCode},</p>`, // html body
            });
        
            return authCode;

        default:
            return "";
    }
    
    
}

export default genereateAndSendAuthCode;