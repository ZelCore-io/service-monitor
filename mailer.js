const request = require('request-promise-native');
const nodemailer = require('nodemailer');

const url = 'https://status.zel.network';
const user = 'zelservicemanager@gmail.com';
const password = 'secretpassword';

setInterval(() => {
  request({ uri: url, json: true })
    .then((response) => {
      if (response.errors.length > 0 ) {
        var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user,
            pass: password
          }
        });
        
        var mailOptions = {
          from: user,
          to: 'tadeas@zel.network',
          subject: 'SERVICE down',
          text: JSON.stringify(response.errors),
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      } else {
        console.log('ALL OK');
      }
    })
    .catch((error) => {
      console
      var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user,
          pass: password
        }
      });
      
      var mailOptions = {
        from: user,
        to: 'tadeas@zel.network',
        subject: ' MONITORING DOWN',
        text: 'Please, check monitoring server!',
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    })
}, 6 * 60 * 1000);
