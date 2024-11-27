const axios = require('axios');
const nodemailer = require('nodemailer');

const url = 'https://api.status.runonflux.io';
const user = 'infrabot@zohomail.com';
const password = 'secretpassword';

setInterval(() => {
  axios.get(url).then((response) => {
    if (response.data.errors.length > 0) {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user,
          pass: password,
        },
      });

      const mailOptions = {
        from: user,
        to: 'tadeas@zelcore.io',
        cc: ['jeremy@runonflux.io'],
        subject: 'SERVICE down',
        text: JSON.stringify(response.data.errors),
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
    } else {
      console.log('ALL OK');
    }
  }).catch((error) => {
    console.log(error);
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user,
        pass: password,
      },
    });

    const mailOptions = {
      from: user,
      to: 'tadeas@zelcore.io',
      cc: ['jeremy@runonflux.io'],
      subject: 'MONITORING DOWN',
      text: 'Please, check monitoring server!',
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    });
  });
}, 6 * 60 * 1000);
