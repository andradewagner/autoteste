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

var teste = new AutoTeste("App Minha Oi", "3.0", Date.now(), massa, "Pré/Controle");
teste.cenarios.push({cenario: "Access Token", imagem: "01.png", status: null, duracao: ''});
teste.cenarios.push({cenario: "Troca voz-internet", imagem: "02.png", status: null, duracao: ''});
teste.cenarios.push({cenario: "Comprar pacotes", imagem: "03.png", status: null, duracao: ''});
teste.cenarios.push({cenario: "Home :: Recarga", imagem: "04.png", status: null, duracao: ''});
teste.cenarios.push({cenario: "Menu Navegação :: Trocar oferta", imagem: "05.png", status: null, duracao: ''});
teste.cenarios.push({cenario: "Menu Navegação :: Entenda sua oferta", imagem: "06.png", status: null, duracao: ''});

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
      .setImplicitWaitTimeout(5000);
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
    teste.statusGeral = allPassed;
    calcularTempoTotal(teste.cenarios[index].duracao);
    atualizarTeste(teste);
  });

  it("Access Token", function () {
    return driver
      .waitForElementById('br.com.mobicare.minhaoi:id/minhaoi_hub_bottom_btn')
      .elementById('br.com.mobicare.minhaoi:id/minhaoi_hub_bottom_btn').click()
      .elementById('br.com.mobicare.minhaoi:id/mop_login_ddd_edittext').sendKeys('21')
      .elementById('br.com.mobicare.minhaoi:id/mop_login_phone_edittext').sendKeys('988911758')
      .elementById('br.com.mobicare.minhaoi:id/mop_login_signin_btn').click().sleep(10000)
      .elementById('br.com.mobicare.minhaoi:id/mop_benefits_refresh_date').then(function(el) {
          return el.text().should.become('Informações atualizadas: Agora mesmo').then(function() {
            salvarScreenShot(driver, "01");
          });
      });
  });

  it("Troca voz-internet", function () {
    // return driver.waitForElementById('br.com.mobicare.minhaoi:id/drawer_layout').then(function () {
    //   return Q.delay(5000).then(function() {
    //     if(driver.elementById('br.com.mobicare.minhaoi:id/mop_balance_exchange_btn')) {
    //       return driver.elementById('br.com.mobicare.minhaoi:id/mop_balance_exchange_btn').click().then(function() {
    //         return Q.delay(5000).then(function() {
    //           if(driver.elementById('br.com.mobicare.minhaoi:id/md_buttonDefaultNegative')) {
    //             salvarScreenShot(driver, "nao_ha_beneficio_disponivel_" + hoje.getDate() + "_" + hoje.getMonth() + "_" + hoje.getFullYear() + ".png");
    //             return driver.sleep(5000).elementById('br.com.mobicare.minhaoi:id/md_buttonDefaultNegative').click();
    //           }
    //         });
    //       });
    //     } else {
          return driver.elementById('br.com.mobicare.minhaoi:id/mop_balance_exchange_btn_inside').click().then(function() {
            salvarScreenShot(driver, "02");
            return Q.delay(5000).then(function() {
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
                .then(function () {

                })
                .elementById('br.com.mobicare.minhaoi:id/mop_exchange_reset_btn').click()
                .back();
            });
          });
    //     }
    //   });
    // });
  });

  it("Comprar pacotes", function() {
    return driver.elementByXPath('//android.widget.ImageButton').click()

    //.elementById('//android.widget.CheckedTextView[@text=\'Comprar pacotes\']').click()
    //.then(function () {
    //   return Q.delay(5000).then(function() {
    //     if(driver.elementById('br.com.mobicare.minhaoi:id/md_buttonDefaultPositive')) {
    //       salvarScreenShot(driver, "compra_pacote_sem_saldo_" + hoje.getDate() + "_" + hoje.getMonth() + "_" + hoje.getFullYear() + ".png");
    //       return driver.elementById('br.com.mobicare.minhaoi:id/md_buttonDefaultPositive').click();
    //     } else {
          .elementByXPath('//android.widget.CheckedTextView[@text=\'Comprar pacotes\']').click()
          .waitForElementById('br.com.mobicare.minhaoi:id/txt_description')
            .then(function() {
              salvarScreenShot(driver, "03");
              return driver.elementByXPath('//android.widget.TextView[@text=\'SMS\']').click().then(function() {
                return Q.delay(5000).then(function() {
                  return driver.elementByXPath('//android.widget.TextView[@text=\'Pacotes Avulsos\']').click()
                  .sleep(5000)
                  .elementByXPath('//android.widget.TextView[@text=\'Pacotes Recorrentes\']').click()
                  .back();
                });
              });
            })
            .then(function() {
              return Q.delay(5000).then(function() {
                return driver.elementByXPath('//android.widget.TextView[@text=\'VOZ\']').click()
                .sleep(5000)
                .elementByXPath('//android.widget.TextView[@text=\'Pacotes Avulsos\']').click()
                .elementByXPath('//android.widget.TextView[@text=\'Pacotes Recorrentes\']').click().back();
              });
            })
            .then(function() {
              return Q.delay(5000).then(function() {
                return driver.elementByXPath('//android.widget.TextView[@text=\'INTERNET\']').click()
                .sleep(5000)
                .elementByXPath('//android.widget.TextView[@text=\'Pacotes Extras\']').click()
                .elementByXPath('//android.widget.TextView[@text=\'Pacotes de Internet\']').click().back();
              });
            })
            .then(function() {
              return Q.delay(5000).then(function() {
                return driver.elementByXPath('//android.widget.TextView[@text=\'MIX\']').click()
                .sleep(5000)
                .back().back();
              });
            });
        // }
    //   });
    //})
  });

  it("Home :: Recarga", function() {
    return driver.elementByXPath('//android.widget.TextView[@text=\'RECARGA\']').click()
    .then(function() {
      return Q.delay(5000).then(function() {
        salvarScreenShot(driver, "04");
        return driver.elementById('br.com.mobicare.minhaoi:id/mop_balance_recharge_btn').click().then(function() {
          return Q.delay(7000).then(function() {
            salvarScreenShot(driver, 'escolher_valor_recarga');
          });
        });
      });
    }).then(function() {
      return driver.elementByXPath('//android.widget.TextView[@text=\'R$ 14\']').click().then(function() {
        return Q.delay(5000).then(function() {
          return driver.back().back();
        });
      });
    });
  });

  it("Menu Navegação :: Trocar oferta", function() {
    return driver.elementByXPath('//android.widget.ImageButton').click().then(function() {
      salvarScreenShot(driver, "05");
      return Q.delay(5000).then(function() {});
    }).then(function() {
      return driver.elementByXPath('//android.widget.CheckedTextView[@text=\'Mudar sua oferta\']').click().then(function() {
        return Q.delay(5000).then(function() {});
      });
    }).then(function() {
      return driver.elementByXPath('//android.widget.TextView[@text=\'CONTROLE\']').click().then(function() {
        return Q.delay(5000).then(function() {});
      });
    }).then(function() {
      return driver.elementByXPath('//android.widget.TextView[@text=\'PRÉ-PAGO\']').click().then(function() {
        return Q.delay(2000).then(function() {
          return driver.back();
        });
      });
    });
  });

  it("Menu Navegação :: Entenda sua oferta", function(done) {
    return driver.elementByXPath('//android.widget.ImageButton').click().then(function() {
      salvarScreenShot(driver, "06");
      return Q.delay(5000).then(function() {
        return driver.elementByXPath('//android.widget.CheckedTextView[@text=\'Entenda a sua oferta\']').click().then(function() {

          var rp = new Promise(function(resolve, reject) {
            driver.elementById('br.com.mobicare.minhaoi:id/toolbar_title').resolve;
            resolve(driver.elementById('br.com.mobicare.minhaoi:id/toolbar_title').text());
          });
          rp.then((result) => {

            done();
          });

          return Q.delay(5000).then(function() {
            //salvarScreenShot(driver, 'entenda_sua_oferta');
            teste.verificarStatusGeral();
            registrarTeste(teste);
            return driver.back().back();
          });
        });
      });
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
