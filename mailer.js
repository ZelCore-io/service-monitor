const request = require('request-promise-native');
const nodemailer = require('nodemailer');

const url = 'https://status.zel.network';
const user = 'zelservicemanager@gmail.com';
const password = 'somesecretpassword';

setInterval(() => {
  request({ uri: url, json: true })
    .then((response) => {
      if (response.error.length > 0 ) {
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user,
            password
          }
        });
        
        var mailOptions = {
          from: user,
          to: 'tadeas@zel.network',
          subject: 'SERVICE down',
          text: JSON.stringify(response.error),
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }
    })
    .catch((error) => {
      console.log("ERROR: " + url)
      return error
    })
}, 6 * 60 * 1000)
