"use strict";

require("./helpers/setup");

var util = require("./helpers/utils.js");

var wd = require("wd"),
    _ = require('underscore'),
    actions = require("./helpers/actions"),
    serverConfigs = require('./helpers/appium-servers'),
    _p = require('./helpers/promise-utils'),
    fs = require('fs'),
    Q = require('q');

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
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  it("Login pré", function () {
    return driver
      .waitForElementById('br.com.mobicare.minhaoi:id/minhaoi_hub_bottom_btn')
      .elementById('br.com.mobicare.minhaoi:id/minhaoi_hub_bottom_btn').click()
      .elementById('br.com.mobicare.minhaoi:id/mop_login_ddd_edittext').sendKeys('21')
      .elementById('br.com.mobicare.minhaoi:id/mop_login_phone_edittext').sendKeys('988911758')
      .elementById('br.com.mobicare.minhaoi:id/mop_login_signin_btn').click()
      .waitForElementById('br.com.mobicare.minhaoi:id/action_bar_root').then(function() {
        return Q.delay(10000).then(function() {
          salvarScreenShot(driver, 'pos_login');
        })
      });
  });

  it("Troca voz-internet", function () {
    return driver.waitForElementById('br.com.mobicare.minhaoi:id/drawer_layout').then(function () {
      return Q.delay(5000).then(function() {
        if(driver.elementById('br.com.mobicare.minhaoi:id/mop_balance_exchange_btn')) {
          return driver.elementById('br.com.mobicare.minhaoi:id/mop_balance_exchange_btn').click().then(function() {
            return Q.delay(5000).then(function() {
              if(driver.elementById('br.com.mobicare.minhaoi:id/md_buttonDefaultNegative')) {
                salvarScreenShot(driver, 'nao_ha_beneficio_disponivel');
                return driver.sleep(5000).elementById('br.com.mobicare.minhaoi:id/md_buttonDefaultNegative').click();
              }
            });
          });
        } else {
          return driver.elementById('br.com.mobicare.minhaoi:id/mop_balance_exchange_btn_inside').click().then(function() {
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
        }
      });
    });
  });

  it("comprar pacotes", function() {
    return driver.elementByXPath('//android.widget.ImageButton').click()
    .then(function () {
      return Q.delay(5000).then(function() {
        salvarScreenShot(driver, 'comprar_pacotes');
        return driver.elementByXPath('//android.widget.CheckedTextView[@text=\'Comprar pacotes\']').click();
      });
    })
    //.elementById('br.com.mobicare.minhaoi:id/mop_balance_mcmsbtn_inside').click()
    .then(function() {
      return driver.elementByXPath('//android.widget.TextView[@text=\'SMS\']').click().then(function() {
        return Q.delay(5000).then(function() {
          salvarScreenShot(driver, 'pacote_sms');
          return driver.elementByXPath('//android.widget.TextView[@text=\'Pacotes Avulsos\']').click()
          .sleep(5000)
          .elementByXPath('//android.widget.TextView[@text=\'Pacotes Recorrentes\']').click()
          .back();
        });
      });
    })
    .then(function() {
      return Q.delay(5000).then(function() {
        salvarScreenShot(driver, 'pacote_voz');
        return driver.elementByXPath('//android.widget.TextView[@text=\'VOZ\']').click()
        .sleep(5000)
        .elementByXPath('//android.widget.TextView[@text=\'Pacotes Avulsos\']').click()
        .elementByXPath('//android.widget.TextView[@text=\'Pacotes Recorrentes\']').click()
        .back();
      });
    })
    .then(function() {
      return Q.delay(5000).then(function() {
        salvarScreenShot(driver, 'pacote_internet');
        return driver.elementByXPath('//android.widget.TextView[@text=\'INTERNET\']').click()
        .sleep(5000)
        .elementByXPath('//android.widget.TextView[@text=\'Pacotes Extras\']').click()
        .elementByXPath('//android.widget.TextView[@text=\'Pacotes de Internet\']').click()
        .back();
      });
    })
    .then(function() {
      return Q.delay(5000).then(function() {
        salvarScreenShot(driver, 'pacote_mix');
        return driver.elementByXPath('//android.widget.TextView[@text=\'MIX\']').click()
        .sleep(5000)
        .back().back();
      });
    });
  });

  it("Home :: Recarga", function() {
    return driver.elementByXPath('//android.widget.TextView[@text=\'RECARGA\']').click()
    .then(function() {
      return Q.delay(5000).then(function() {
        salvarScreenShot(driver, 'home_recarga');
        return driver.elementById('br.com.mobicare.minhaoi:id/mop_balance_recharge_btn').click().then(function() {
          return Q.delay(7000).then(function() {
            salvarScreenShot(driver, 'escolher_valor_recarga');
          });
        });
      });
    }).then(function() {
      return driver.elementByXPath('//android.widget.TextView[@text=\'R$ 14\']').click().then(function() {
        return Q.delay(5000).then(function() {
          salvarScreenShot(driver, 'recarga_14_reais');
          return driver.back().back();
        });
      });
    });
  });

  it("Menu Navigation :: Trocar oferta", function() {
    return driver.elementByXPath('//android.widget.ImageButton').click().then(function() {
      return Q.delay(5000).then(function() {
        salvarScreenShot(driver, 'trocar_oferta');
      });
    }).then(function() {
      return driver.elementByXPath('//android.widget.CheckedTextView[@text=\'Mudar sua oferta\']').click().then(function() {
        return Q.delay(5000).then(function() {
          salvarScreenShot(driver, 'mudar_ofeta');
        });
      });
    }).then(function() {
      return driver.elementByXPath('//android.widget.TextView[@text=\'CONTROLE\']').click().then(function() {
        return Q.delay(5000).then(function() {
          salvarScreenShot(driver, 'mudar_oferta_controle');
        });
      });
    }).then(function() {
      return driver.elementByXPath('//android.widget.TextView[@text=\'PRÉ-PAGO\']').click().then(function() {
        return Q.delay(2000).then(function() {
          return driver.back();
        });
      });
    });
  });

  it("Menu Navigation :: Entenda sua oferta", function() {
    return driver.elementByXPath('//android.widget.ImageButton').click().then(function() {
      return Q.delay(5000).then(function() {
        return driver.elementByXPath('//android.widget.CheckedTextView[@text=\'Entenda a sua oferta\']').click().then(function() {
          return Q.delay(5000).then(function() {
            salvarScreenShot(driver, 'entenda_sua_oferta');
            return driver.back().back();
          });
        });
      });
    });
  });
});

function salvarScreenShot(driver, nomeArquivo) {
  driver.takeScreenshot().then(function(image){
    return fs.writeFile(nomeArquivo + '.png', image, 'base64', function(callback) {

    })
  })
}
