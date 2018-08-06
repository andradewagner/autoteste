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

var hoje = Date.now();
var massa = "01102480746";
const _DIR_ = "/home/wagner/Documentos/Projetos/mean/modules/testes/client/images/";

var teste = new AutoTeste("Acesso Rápido - App Minha Oi", "3.0", Date.now(), massa, "Acesso Rápido");
teste.cenarios.push({cenario: "Tela cpf", imagem: "01.png", status: null, duracao: '', erro: ''});
teste.cenarios.push({cenario: "Selecionar terminal", imagem: "02.png", status: null, duracao: '', erro: ''});

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

  it("Tela cpf", function () {
    return driver
      .waitForElementById('br.com.mobicare.minhaoi:id/minhaoi_hub_top_btn')
      .elementById('br.com.mobicare.minhaoi:id/minhaoi_hub_top_btn').click()
      .elementById('br.com.mobicare.minhaoi:id/screen_login_quick_access_container').click()
      .elementById('br.com.mobicare.minhaoi:id/moi_quick_access_cpf_edittext').sendKeys('01102480746')
      .elementById('br.com.mobicare.minhaoi:id/moi_quick_access_signin_btn').click()
      .elementById('br.com.mobicare.minhaoi:id/moi_barcode_footer_links_title')
      .then(function(el) {
        if (!process.env.npm_package_config_sauce) {
          return el.text().should.become('Ou se preferir, acesse a Minha Oi:');
        }
      }).then(function() {
        salvarScreenShot(driver, '01');
      });
  });

  it("Selecionar terminal", function () {
    return driver
    .elementById('br.com.mobicare.minhaoi:id/moi_quick_access_barcode_spinner_container').click()
    .elementByXPath('//android.widget.LinearLayout[@index=2]').click()
    .then(function() {
      salvarScreenShot(driver, '02');
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
