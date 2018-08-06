"use strict";

require("./helpers/setup");

var util = require("./helpers/utils.js");
const AutoTeste = require('./teste.model');

var wd = require("wd"),
    _ = require('underscore'),
    actions = require("./helpers/actions"),
    serverConfigs = require('./helpers/appium-servers'),
    _p = require('./helpers/promise-utils'),
    fs = require('fs'),
    Q = require('q'),
    request = require('request');

var CenariosEnum = {
  LOGIN: "Login",
  INTERNET: "Internet",
  VOZ: "Voz",
  PAINEL: "Painel",
  COMPRA: "Compra",
  TROCA: "Troca"
};

var hoje = Date.now();
var massa = "21-988911758";
const _DIR_ = "/home/wagner/Documentos/Projetos/mean/modules/testes/client/images/";

var teste = new AutoTeste("Oi Mod", "3.0", Date.now(), massa, "Pré-Pago");
teste.cenarios.push({cenario: CenariosEnum.LOGIN, imagem: "01.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.COMPRA, imagem: "02.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.INTERNET, imagem: "03.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.TROCA, imagem: "04.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.VOZ, imagem: "05.png", status: null, duracao: '', erro: ''});

registrarTeste(teste, function(data) {
  teste = data;
});

wd.addPromiseChainMethod('swipe', actions.swipe);

describe("Oi Mod", function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;

  before(function () {
    var serverConfig = process.env.npm_package_config_sauce ?
      serverConfigs.sauce : serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require("./helpers/logging").configure(driver);

    var desired = process.env.npm_package_config_sauce ?
      _.clone(require("./helpers/caps").android18) :
      _.clone(require("./helpers/caps").android18);
    desired.app = require("./helpers/apps").oimod;
    if (process.env.npm_package_config_sauce) {
      desired.name = 'android - complex';
      desired.tags = ['sample'];
    }
    return driver
      .init(desired)
      .setImplicitWaitTimeout(60000);
  });

  after(function () {
    return driver
      .quit()
      .finally(function () {
        if (process.env.npm_package_config_sauce) {
          return driver.sauceJobStatus(allPassed);
        }
      });
  });

  afterEach(function () {
    var index = indiceCenario(this.currentTest.title);
    if(this.currentTest.state === 'passed') {
      teste.cenarios[index].status = true;
    } else {
      teste.cenarios[index].status = false;
    }
    allPassed = allPassed && this.currentTest.state === 'passed';
    teste.cenarios[index].duracao = this.currentTest.duration;
    if(this.currentTest.err) {
      teste.cenarios[index].erro = this.currentTest.err.message;
    }
    teste.statusGeral = allPassed;
    calcularTempoTotal(teste.cenarios[index].duracao);
    atualizarTeste(teste);
  });

  it(CenariosEnum.LOGIN, function () {
    return driver
      .elementByXPath('//android.widget.TextView[@text=\'Login\']').click()
      .elementById('usernameinput').sendKeys('testeoimod+c10@gmail.com')
      .hideKeyboard()
      .elementById('passwordinput').sendKeys('Testes123')
      .hideKeyboard()
      .elementById('register').click().sleep(5000)
      .waitForElementByXPath('//android.widget.TextView[@text=\'OI MOD\']', 60).then(function() {
        salvarScreenShot(driver, '01');
      });
  });

  it(CenariosEnum.COMPRA, function() {
    return driver
    .elementByXPath('//android.widget.TextView[@text=\'Compra\']').click().sleep(3000)
    .then(function() {
      salvarScreenShot(driver, '02');
    });
  });

  it(CenariosEnum.TROCA, function() {
    return driver
    .elementByXPath('//android.widget.TextView[@text=\'Troca\']').click().sleep(3000)
    .then(function() {
      salvarScreenShot(driver, '03');
    });
  });

  it(CenariosEnum.INTERNET, function() {
    return driver
    .elementByXPath('//android.widget.TextView[@text=\'Painel\']').click().sleep(3000)
    .elementByXPath('//android.view.ViewGroup[@index=2]').click()
    .then(function() {
      salvarScreenShot(driver, '04');
    }).sleep(5000).back();
  });

  it(CenariosEnum.VOZ, function() {
    return driver
    .elementByXPath('//android.widget.TextView[@text=\'Painel\']').click()
    .elementByXPath('//android.view.ViewGroup[@index=3]').click().sleep(3000)
    .then(function() {
      salvarScreenShot(driver, '05');
    }).sleep(5000).back();
  });
});

// Ids da tela de Cadastro
// nome
// email
// email2
// password
// confirm-password
// register


function salvarScreenShot(driver, nomeArquivo) {
  if(!fs.existsSync(_DIR_ + teste._id)) {
    fs.mkdirSync(_DIR_ + teste._id, '0777');
  }
  driver.takeScreenshot().then(function(image){
    return fs.writeFile(_DIR_ + teste._id + '/' + nomeArquivo + '.png', image, 'base64', function(callback) {

    })
  })
}

function indiceCenario(titulo) {
  for(var i = 0; i < teste.cenarios.length; i++) {
    if(teste.cenarios[i].cenario === titulo) {
      return i;
    }
  }
}

function registrarTeste(teste, callback) {
  request({
    url: "http://localhost:3000/api/testes",
    method: "POST",
    json: true,
    body: teste
  }, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      callback(body);
    }
  });
}

function atualizarTeste(teste) {
  request({
    url: "http://localhost:3000/api/teste/" + teste._id,
    method: "PUT",
    json: true,
    body: teste
  }, function(err, response, body) {
    if(!err && response.statusCode == 200) {
      console.log("Teste com id " + body._id + " atualizado com sucesso!");
    } else {
      console.log(err);
    }
  });
}

function calcularTempoTotal(tempo) {
  teste.tempoTotal = teste.tempoTotal + parseInt(tempo, 10);
}
