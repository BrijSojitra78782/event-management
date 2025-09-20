
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    host : "smtp.gmail.com",
    port : 465,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
    },
    secure: true
});


async function sendMail(to,subject,content,attachments) {
    var config = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: content,
        attachments
    };

    return new Promise((resolve,reject)=>{
        transporter.sendMail(config, (error) => {
            if (error) {
               reject(error);
            } else {
               resolve({ message: "Successful email send. Can be verified." });
            }
        });
    }) 
}

module.exports = {
    sendMail
}