const nodemailer = require('nodemailer');

async function sendEmail(userEmail, subject, text) {
    let transporter  = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "emailname.com",
            pass: "password"

        }
    });

    let mailOptions = {
        from: "emailname.com",
        to: userEmail,
        subject: subject,
        text: text
    }

    transporter.sendMail(mailOptions, function(err, data) {
        if(err) {
            console.log('Error Occurs', err);
        } else {
            console.log('Email sent!!!');
        }
    });
}