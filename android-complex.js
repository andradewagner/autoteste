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
    driver
      .elementById('br.com.mobicare.minhaoi:id/minhaoi_hub_bottom_btn').click()
      .elementById('br.com.mobicare.minhaoi:id/mop_login_ddd_edittext').sendKeys('21')
      .elementById('br.com.mobicare.minhaoi:id/mop_login_phone_edittext').sendKeys('988911758')
      .elementById('br.com.mobicare.minhaoi:id/mop_login_signin_btn').click()
      .sleep(15000)
      .then(function() {
        return Q.delay(3000).then(function() {
          salvarScreenShot(driver, 'pos_login');
        })
      })
      //.elementById('br.com.mobicare.minhaoi:id/mop_sms_auth_received_btn').click()
      //.takeScreenshot()
      //.elementById('br.com.mobicare.minhaoi:id/mop_sms_code_code_edittext').sendKeys('')
      //.elementById('br.com.mobicare.minhaoi:id/mop_sms_code_continue_btn').click()

       // .text().should.become('API Demos')
      //.elementsByXPath('//android.widget.TextView[contains(@text, "Animat")]')
       // .then(_p.filterDisplayed).first()
      //.then(function (el) {
       // if (!process.env.npm_package_config_sauce) {
         // return el.text().should.become('Animation');
       // }
       // }).elementByXPath('//android.widget.TextView[@text=\'App\']').click()
       // .sleep(3000)
      //.elementsByAndroidUIAutomator('new UiSelector().clickable(true)')
       // .should.eventually.have.length.above(10)
     // .elementByXPath('//android.widget.TextView[@text=\'Action Bar\']')
       // .should.eventually.exist
     // .elementsByXPath('//android.widget.TextView')
       // .then(_p.filterDisplayed).first()
       // .text().should.become('API Demos')
     // .back().sleep(1000);
  });

  it("Troca voz-internet", function () {
    return driver.sleep(5000).then(function () {
      if(driver.elementById('br.com.mobicare.minhaoi:id/mop_balance_exchange_btn')) {
        driver.elementById('br.com.mobicare.minhaoi:id/mop_balance_exchange_btn').click();
        driver.sleep(5000);
        if(driver.elementById('br.com.mobicare.minhaoi:id/md_buttonDefaultNegative')) {
          salvarScreenShot(driver, 'nao_ha_beneficio_disponivel');
          driver.sleep(5000).elementById('br.com.mobicare.minhaoi:id/md_buttonDefaultNegative').click();
        } else {
          driver.back();
        }
      } else {
        driver.elementById('br.com.mobicare.minhaoi:id/mop_balance_exchange_btn_inside').click().sleep(5000);
        salvarScreenShot(driver, 'troca_voz_internet');
      }
    })

  });

  // it("should scroll", function () {
  //   return driver
  //     .elementByXPath('//android.widget.TextView[@text=\'Animation\']')
  //     .elementsByXPath('//android.widget.TextView')
  //     .then(function (els) {
  //       return Q.all([
  //         els[7].getLocation(),
  //         els[3].getLocation()
  //       ]).then(function (locs) {
  //         console.log('locs -->', locs);
  //         return driver.swipe({
  //           startX: locs[0].x, startY: locs[0].y,
  //           endX: locs[1].x, endY: locs[1].y,
  //           duration: 800
  //         });
  //       });
  //     });
  // });

  it("deslizar troca voz-dados", function () {
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
      .elementById('br.com.mobicare.minhaoi:id/mop_exchange_seekbar')//.click()
      .then(findSlideBar)
      .click()
      .sleep(1000)
      .then(function () {
        // var a1 = new wd.TouchAction();
        // a1.press({x: 150, y: 100}).release();
        // var a2 = new wd.TouchAction();
        // a2.press({x: 250, y: 100}).release();
        // var smile = new wd.TouchAction();
        // smile
        //   .press({x:110, y:200})
          // .moveTo({x:1, y:1})
          // .moveTo({x:1, y:1})
          // .moveTo({x:1, y:1})
          // .moveTo({x:1, y:1})
          // .moveTo({x:1, y:1})
          // .moveTo({x:2, y:1})
          // .moveTo({x:2, y:1})
          // .moveTo({x:2, y:1})
          // .moveTo({x:2, y:1})
          // .moveTo({x:2, y:1})
          // .moveTo({x:3, y:1})
          // .moveTo({x:3, y:1})
          // .moveTo({x:3, y:1})
          // .moveTo({x:3, y:1})
          // .moveTo({x:3, y:1})
          // .moveTo({x:4, y:1})
          // .moveTo({x:4, y:1})
          // .moveTo({x:4, y:1})
          // .moveTo({x:4, y:1})
          // .moveTo({x:4, y:1})
          // .moveTo({x:5, y:1})
          // .moveTo({x:5, y:1})
          // .moveTo({x:5, y:1})
          // .moveTo({x:5, y:1})
          // .moveTo({x:5, y:1})
          // .moveTo({x:5, y:0})
          // .moveTo({x:5, y:0})
          // .moveTo({x:5, y:0})
          // .moveTo({x:5, y:0})
          // .moveTo({x:5, y:0})
          // .moveTo({x:5, y:0})
          // .moveTo({x:5, y:0})
          // .moveTo({x:5, y:0})
          // .moveTo({x:5, y:-1})
          // .moveTo({x:5, y:-1})
          // .moveTo({x:5, y:-1})
          // .moveTo({x:5, y:-1})
          // .moveTo({x:5, y:-1})
          // .moveTo({x:4, y:-1})
          // .moveTo({x:4, y:-1})
          // .moveTo({x:4, y:-1})
          // .moveTo({x:4, y:-1})
          // .moveTo({x:4, y:-1})
          // .moveTo({x:3, y:-1})
          // .moveTo({x:3, y:-1})
          // .moveTo({x:3, y:-1})
          // .moveTo({x:3, y:-1})
          // .moveTo({x:3, y:-1})
          // .moveTo({x:2, y:-1})
          // .moveTo({x:2, y:-1})
          // .moveTo({x:2, y:-1})
          // .moveTo({x:2, y:-1})
          // .moveTo({x:2, y:-1})
          // .moveTo({x:1, y:-1})
          // .moveTo({x:1, y:-1})
          // .moveTo({x:1, y:-1})
          // .moveTo({x:1, y:-1})
          // .moveTo({x:1, y:-1})
          //.release();

        // var ma = new wd.MultiAction().add(a1, a2, smile);
        // return driver.performMultiAction(ma)
        //   // so you can see it
        //   .sleep(10000)
        //   .back().sleep(1000)
        //   .back().sleep(1000);
      })
      .elementById('br.com.mobicare.minhaoi:id/mop_exchange_reset_btn').click()
      .back();
  });

  it("comprar pacotes", function() {
    return driver.sleep(2000)
    .elementByXPath('//android.widget.ImageButton').click()
    .sleep(10000).then(function () {
      if(driver.elementByXPath('//android.widget.TextView[contains(@text, "erro")]')) {
        driver.sleep(5000);
        salvarScreenShot(driver, 'erro_compra_pacotes');
        driver.sleep(5000).back();
      } else {
        driver.elementByXPath('//android.widget.CheckedTextView[@text=\'Comprar pacotes\']').click().sleep(5000);
        salvarScreenShot(driver, 'comprar_pacotes');
        driver.sleep(5000);
      }
    })

    //.elementById('br.com.mobicare.minhaoi:id/mop_balance_mcmsbtn_inside').click()
    .elementByXPath('//android.widget.TextView[@text=\'SMS\']').click()
    .sleep(5000).then(function() {
      if(driver.elementByXPath('//android.widget.TextView[contains(@text, "erro")]')) {
        salvarScreenShot(driver, 'erro_compra_pacotes');
        driver.sleep(5000).back();
      } else {
        driver.elementByXPath('//android.widget.TextView[@text=\'Pacotes Avulsos\']').click()
        .sleep(5000)
        .elementByXPath('//android.widget.TextView[@text=\'Pacotes Recorrentes\']').click()
        .back();
      }
    })

    .elementByXPath('//android.widget.TextView[@text=\'VOZ\']').click()
    .sleep(5000)
    .elementByXPath('//android.widget.TextView[@text=\'Pacotes Avulsos\']').click()
    .elementByXPath('//android.widget.TextView[@text=\'Pacotes Recorrentes\']').click()
    .back()
    .elementByXPath('//android.widget.TextView[@text=\'INTERNET\']').click()
    .sleep(5000)
    .elementByXPath('//android.widget.TextView[@text=\'Pacotes Extras\']').click()
    .elementByXPath('//android.widget.TextView[@text=\'Pacotes de Internet\']').click()
    .back()
    .elementByXPath('//android.widget.TextView[@text=\'MIX\']').click()
    .sleep(5000)
    .back().back();
  });

  it("Home :: Recarga", function() {
    return driver.sleep(5000)
    .elementByXPath('//android.widget.TextView[@text=\'RECARGA\']').click()
    .sleep(5000)
    .takeScreenshot().then(function(image){
      return fs.writeFile('home-recarga.png', image, 'base64', function(callback) {

      })
    })
    .elementById('br.com.mobicare.minhaoi:id/mop_balance_recharge_btn').click()
    .sleep(7000)
    .takeScreenshot().then(function(image){
      return fs.writeFile('escolher-valor-recarga.png', image, 'base64', function(callback) {

      })
    })
    .elementByXPath('//android.widget.TextView[@text=\'R$ 14\']').click()
    .sleep(5000)
    .takeScreenshot().then(function(image){
      return fs.writeFile('recarga.png', image, 'base64', function(callback) {

      })
    })
    .back().back()
    .elementById('br.com.mobicare.minhaoi:id/mop_balance_exchange_btn').click()
    .sleep(5000)
    .back()
    .elementById('br.com.mobicare.minhaoi:id/mop_balance_mcms_btn').click()
    .sleep(5000)
    .back()
  });

  it("Menu Navigation :: Trocar oferta", function() {
    return driver.sleep(10000)
    .elementByXPath('//android.widget.ImageButton').click()
    .sleep(2000)
    .takeScreenshot().then(function(image){
      return fs.writeFile('menu.png', image, 'base64', function(callback) {

      })
    })
    .elementByXPath('//android.widget.CheckedTextView[@text=\'Mudar sua oferta\']').click()
    .sleep(5000)
    .takeScreenshot().then(function(image){
      return fs.writeFile('mudar-oferta.png', image, 'base64', function(callback) {

      })
    })
    .elementByXPath('//android.widget.TextView[@text=\'CONTROLE\']').click()
    .sleep(5000)
    .takeScreenshot().then(function(image){
      return fs.writeFile('mudar-oferta-controle.png', image, 'base64', function(callback) {

      })
    })
    .elementByXPath('//android.widget.TextView[@text=\'PRÉ-PAGO\']').click()
    .back();
  });

  it("Menu Navigation :: Entenda sua oferta", function() {
    return driver.sleep(5000)
    .elementByXPath('//android.widget.ImageButton').click()
    .elementByXPath('//android.widget.CheckedTextView[@text=\'Entenda a sua oferta\']').click()
    .sleep(5000)
    .takeScreenshot().then(function(image){
      return fs.writeFile('entenda-oferta.png', image, 'base64', function(callback) {

      })
    })
    .back().back();
  });

});

function logar(driver) {

}

function salvarScreenShot(driver, nomeArquivo) {
  driver.takeScreenshot().then(function(image){
    return fs.writeFile(nomeArquivo + '.png', image, 'base64', function(callback) {

    })
  })
}
