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

describe("minhaoi pos", function () {
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
    return driver.sleep(5000)
      .takeScreenshot().then(function(image){
        fs.writeFile('./pos/home.png', image, 'base64', function(err){
          if(err) console.log('Erro ao salvar imagem');
        })
      })
      .elementById('br.com.mobicare.minhaoi:id/minhaoi_hub_top_btn').click()
      //.elementById('br.com.mobicare.minhaoi:id/screenLogin_editTextUser').sendKeys('01102480746')
      .elementById('br.com.mobicare.minhaoi:id/screenLogin_editTextPass').sendKeys('1206tse')
      .elementById('br.com.mobicare.minhaoi:id/screenLogin_btnSignIn').click()
      .sleep(15000)
      .takeScreenshot().then(function(image){
        fs.writeFile('./pos/pospago_logado.png', image, 'base64', function(err){
          if(err) console.log('Erro ao salvar imagem');
        })
      });
  });
});
