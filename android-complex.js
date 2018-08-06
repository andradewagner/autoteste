"use strict";

require("./helpers/setup");
var assert = require('assert');
var util = require("./helpers/utils.js");
const AutoTeste = require('./teste.model');

var wd = require("wd"),
    _ = require('underscore'),
    actions = require("./helpers/actions"),
    serverConfigs = require('./helpers/appium-servers'),
    _p = require('./helpers/promise-utils'),
    fs = require('fs'),
    Q = require('q'),
    chai = require('chai'),
    request = require('request');

var hoje = Date.now();
var massa = "21-988911758";
const _DIR_ = "/home/wagner/Documentos/Projetos/mean/modules/testes/client/images/";

var CenariosEnum = {
  TOKEN: "Access Token",
  TROCA_DADOS: "Trocar Voz/Internet",
  PACOTES_SMS: "Comprar pacotes sms",
  PACOTES_VOZ: "Comprar pacotes voz",
  PACOTES_INTERNET: "Comprar pacotes internet",
  PACOTES_MIX: "Comprar pacotes mix",
  RECARGA: "Home :: Recarga",
  MUDA_OFERTA: "Menu Navegação :: Mudar sua oferta",
  ENTENDA_OFERTA: "Menu Navegação :: Entenda a sua oferta"
};

var teste = new AutoTeste("Pré-pago - App Minha Oi", "3.0", Date.now(), massa, "Pré-Pago/Controle");
teste.cenarios.push({cenario: CenariosEnum.TOKEN, imagem: "01.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.TROCA_DADOS, imagem: "02.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.PACOTES_SMS, imagem: "03.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.PACOTES_VOZ, imagem: "04.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.PACOTES_INTERNET, imagem: "05.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.PACOTES_MIX, imagem: "06.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.RECARGA, imagem: "07.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.MUDA_OFERTA, imagem: "08.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: CenariosEnum.ENTENDA_OFERTA, imagem: "09.png", status: null, duracao: '', erro: ''});

registrarTeste(teste, function(data) {
  teste = data;
});

wd.addPromiseChainMethod('swipe', actions.swipe);

describe("android complex", function () {
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
      _.clone(require("./helpers/caps").android19);
    desired.app = require("./helpers/apps").androidApiDemos;
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
      salvarScreenShot(driver, this.currentTest.title);
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

  it(CenariosEnum.TOKEN, function () {
    return driver
      .waitForElementById('br.com.mobicare.minhaoi:id/minhaoi_hub_bottom_btn', 60)
      .elementById('br.com.mobicare.minhaoi:id/minhaoi_hub_bottom_btn').click()
      .elementById('br.com.mobicare.minhaoi:id/mop_login_ddd_edittext').sendKeys('21')
      .elementById('br.com.mobicare.minhaoi:id/mop_login_phone_edittext').sendKeys('988911758')
      .elementById('br.com.mobicare.minhaoi:id/mop_login_signin_btn').click()
      .waitForElementByXPath('//android.widget.TextView[@text=\'Minha Oi\']')
      .then(function(result) {
        return result.text().should.become('Minha Oi');
      });
  });

  it(CenariosEnum.TROCA_DADOS, function () {
    return driver.waitForElementById('br.com.mobicare.minhaoi:id/drawer_layout', 60)
      .elementByXPath('//android.widget.Button[@text=\'Trocar voz/internet\']').click()
        .elementByXPath('//android.widget.TextView').then(function(element) {
            return element.text().should.become('Trocar voz e internet');
          }).then(function() {
            function findSlideBar() {
              return driver
                .elementsByClassName('android.widget.SeekBar')
                .then(function (els) {
                  return Q.all([
                    els[els.length - 1].getLocation(),
                    els[0].getLocation()
                  ]).then(function (locs) {
                    return driver.swipe({
                      startX: locs[0].x, startY: locs[0].y,
                      endX: locs[1].x, endY: locs[1].y,
                      duration: 800
                    });
                  });
                }).elementById('br.com.mobicare.minhaoi:id/mop_exchange_seekbar')
                .catch(function () {
                  return findSlideBar();
                });
            }
            return driver
              .elementById('br.com.mobicare.minhaoi:id/mop_exchange_seekbar')
              .then(findSlideBar)
              .click()
              .sleep(1000)
              .elementById('br.com.mobicare.minhaoi:id/mop_exchange_reset_btn').click()
              .back();
          });
  });

  it(CenariosEnum.PACOTES_SMS, function() {
    return driver.elementByXPath('//android.widget.ImageButton').click()
      .elementByXPath('//android.widget.CheckedTextView[@text=\'Comprar pacotes\']').click()
      .waitForElementByXPath('//android.widget.TextView[@text=\'Pacotes\']', 60)
      .then(function(element) {
        return element.text().should.become('Pacotes');
      }).then(function() {
        return driver.elementByXPath('//android.widget.TextView[@text=\'SMS\']').click()
          .waitForElementByXPath('//android.widget.TextView[@text=\'Pacotes de SMS\']', 60)
          .then(function(result) {
            return result.text().should.become('Pacotes de SMS');
          }).then(function() {
            return driver.elementByXPath('//android.widget.TextView[@text=\'Pacotes Avulsos\']').click()
            .elementByXPath('//android.widget.TextView[@text=\'Pacotes Recorrentes\']').click()
            .back().back();
          });
      });
  });

  it(CenariosEnum.PACOTES_VOZ, function() {
    return driver.elementByXPath('//android.widget.ImageButton').click()
      .elementByXPath('//android.widget.CheckedTextView[@text=\'Comprar pacotes\']').click()
      .waitForElementByXPath('//android.widget.TextView[@text=\'Pacotes\']', 60)
      .then(function(result) {
        return result.text().should.become('Pacotes');
      }).then(function() {
        return driver.elementByXPath('//android.widget.TextView[@text=\'VOZ\']').click()
          .waitForElementByXPath('//android.widget.TextView[@text=\'Pacotes de VOZ\']', 60)
          .then(function(result) {
            return result.text().should.become('Pacotes de VOZ');
          }).then(function(){
            return driver.elementByXPath('//android.widget.TextView[@text=\'Pacotes Avulsos\']').click()
            .elementByXPath('//android.widget.TextView[@text=\'Pacotes Recorrentes\']').click()
            .back().back();
          });
      });
  });

  it(CenariosEnum.PACOTES_INTERNET, function() {
    return driver.elementByXPath('//android.widget.ImageButton').click()
      .elementByXPath('//android.widget.CheckedTextView[@text=\'Comprar pacotes\']').click()
      .waitForElementByXPath('//android.widget.TextView[@text=\'Pacotes\']', 60)
      .then(function(result) {
        return result.text().should.become('Pacotes');
      }).then(function() {
        return driver.elementByXPath('//android.widget.TextView[@text=\'INTERNET\']').click()
          .waitForElementByXPath('//android.widget.TextView[@text=\'Pacotes de INTERNET\']', 60)
          .then(function(result) {
            return result.text().should.become('Pacotes de INTERNET');
          }).then(function() {
            return driver.elementByXPath('//android.widget.TextView[@text=\'Pacotes Extras\']').click()
            .elementByXPath('//android.widget.TextView[@text=\'Pacotes de Internet\']').click()
            .back().back();
          });
      });
  });

  it(CenariosEnum.PACOTES_MIX, function() {
    return driver.elementByXPath('//android.widget.ImageButton').click()
      .elementByXPath('//android.widget.CheckedTextView[@text=\'Comprar pacotes\']').click()
      .waitForElementByXPath('//android.widget.TextView[@text=\'Pacotes\']', 60)
      .then(function(element) {
        return element.text().should.become('Pacotes');
      }).then(function() {
        return driver.elementByXPath('//android.widget.TextView[@text=\'MIX\']').click()
          .waitForElementByXPath('//android.widget.TextView[@text=\'MIX\']', 60)
          .then(function(element) {
            return element.text().should.become('MIX');
          }).then(function() {
            return driver.elementByXPath('//android.widget.TextView[@text=\'MIX\']').click()
            .back().back();
          });
      });
  });

  it(CenariosEnum.RECARGA, function() {
    return driver.elementByXPath('//android.widget.TextView[@text=\'RECARGA\']').click()
    .elementById('br.com.mobicare.minhaoi:id/mop_balance_recharge_btn').click()
    .waitForElementByXPath('//android.widget.TextView[@text=\'Recarga\']', 60)
    .then(function(el) {
      return el.text().should.become('Recarga');
    }).then(function() {
      return driver.elementByXPath('//android.widget.TextView[@text=\'R$ 14\']').click()
      .back().back();
    });
  });

  it(CenariosEnum.MUDA_OFERTA, function() {
    return driver.elementByXPath('//android.widget.ImageButton').click()
    .elementByXPath('//android.widget.CheckedTextView[@text=\'Mudar sua oferta\']').click()
    .waitForElementByXPath('//android.widget.TextView[@text=\'Ofertas com troca de voz/internet\']', 60)
    .then(function(el) {
      return el.text().should.become('Ofertas com troca de voz/internet');
    }).then(function() {
      return driver.elementByXPath('//android.widget.TextView[@text=\'CONTROLE\']').click()
      .elementByXPath('//android.widget.TextView[@text=\'PRÉ-PAGO\']').click()
      .back();
    });
  });

  it(CenariosEnum.ENTENDA_OFERTA, function() {
    return driver.elementByXPath('//android.widget.ImageButton').click()
    .elementByXPath('//android.widget.CheckedTextView[@text=\'Entenda a sua oferta\']').click()
    .waitForElementByXPath('//android.widget.TextView[@text=\'Regras da Oferta\']')
    .then(function(el) {
      return el.text().should.become('Regras da Oferta');
    }).then(function() {
      return driver.back();
    });
  });
});

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
