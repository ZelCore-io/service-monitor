const request = require('request-promise-native');
const nodemailer = require('nodemailer');

const url = 'https://status.zel.network';
const user = 'zelcorebotmailer@gmail.com';
const password = 'secretpassword';

setInterval(() => {
  request({ uri: url, json: true })
    .then((response) => {
      if (response.errors.length > 0) {
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
          to: 'tadeas@zel.network',
          cc: ['alex.rousseau@gmail.com', 'k4mil.piekarski@gmail.com'],
          subject: 'SERVICE down',
          text: JSON.stringify(response.errors),
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
    })
    .catch((error) => {
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
        to: 'tadeas@zel.network',
        cc: ['alex.rousseau@gmail.com', 'k4mil.piekarski@gmail.com'],
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
