"use strict";

const nodemailer = require('nodemailer');

function EnviarEmail(teste, erro) {
  nodemailer.createTestAccount((err, account) => {

    let transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
          user: 'wlandrade@latam.stefanini.com',
          pass: '@miL2517'
      }
    });

    let mailOptions = {
      from: '"Wagner Andrade" <soundofreis@gmail.com>',
      to: 'andradewagner@hotmail.com',
      subject: 'Teste Automatizado ' + teste.aplicacao,
      text: 'O teste automático realizado em '+ extrairData(teste.horaExecucao) +' apresentou erro em ' + erro + '.\nA versão do testada é ' + teste.versao + '.\nA massa de teste é ' + teste.massaTeste,
      //html: '<b>Hello world?</b>'
      attachments: [{
          filename: erro + ".png",
          filePath: "/home/wagner/Documentos/Projetos/mean/modules/testes/client/images",
          cid: "logo-mail"
      }]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);

      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
  });
}

function extrairData(data) {
  var dataFormatada = new Date(data);
  return dataFormatada.getDate() + '/' + dataFormatada.getMonth()+1 + '/' + dataFormatada.getFullYear() + ' às ' + dataFormatada.getHours() + ':' + dataFormatada.getMinutes();
}

module.exports = EnviarEmail;
