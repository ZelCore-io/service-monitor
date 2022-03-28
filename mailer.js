const request = require('request-promise-native');
const nodemailer = require('nodemailer');
const webhook = require('@prince25/discord-webhook-sender');

const url = 'https://status.zel.network';
const user = 'zelservicemanager@gmail.com';
const password = 'secretpassword';
const web_hook_url = 'web_hook_url';

function discord_hook(node_msg, web_hook_url, title, color, field_name) {
  if (typeof web_hook_url !== 'undefined' && web_hook_url !== '0') {
    
    const Hook = new webhook.Webhook(`${web_hook_url}`);
    Hook.setUsername('Service Monitor');
    const msg = new webhook.MessageBuilder()
      .setTitle(`:loudspeaker: **${title}**`)
      .addField(`${field_name}:`, node_msg)
      .setColor(`${color}`)
    try {  
      Hook.send(msg);
      console.log('Sent to Discord');
    } catch (error) {
      console.log('Error Sending to Discord');
    }
  }
}

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
          cc: ['alex.rousseau@gmail.com', 'doukka@gmail.com', 'k4mil.piekarski@gmail.com'],
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
        discord_hook(JSON.stringify(response.errors), web_hook_url, 'SERVICE down', '#1F8B4C', 'Errors');
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
        cc: ['alex.rousseau@gmail.com', 'doukka@gmail.com', 'k4mil.piekarski@gmail.com'],
        subject: 'MONITORING DOWN',
        text: 'Please, check monitoring server!',
      };
      discord_hook('Please, check monitoring server!', web_hook_url, 'MONITORING DOWN', '#1F8B4C', 'Action');
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });
    });
}, 6 * 60 * 1000);


