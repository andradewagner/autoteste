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

  // it("Migrar para Oi Mod", function() {
  //   return driver.sleep(5000)
  //   .takeScreenshot().then(function(image){
  //     fs.writeFile('./oimod/home.png', image, 'base64', function(callback){
  //
  //     })
  //   });
  //   console.log(driver.elementByXPath('//android.widget.TextView[@text=\'Iniciar processo de migração\']'));
  // });

  it("Login pré", function () {
    return driver.sleep(5000)
      .takeScreenshot().then(function(image){
        fs.writeFile('./oimod/home.png', image, 'base64', function(callback){

        })
      })
      .elementByXPath('//android.widget.TextView[@text=\'Login\']').then(function(element){
        var x = driver.elementByXPath('//android.widget.TextView[@text=\'Login\']');
        x.then(function(sucesso){
          driver.elementByXPath('//android.widget.TextView[@text=\'Login\']').click();
        },
        function(error){

        });
      }, function(error) {
        console.log('Erro');
      })
      //.elementById('br.com.mobicare.minhaoi:id/screenLogin_btnSignIn').click()
      .sleep(15000)
      .takeScreenshot().then(function(image){
        fs.writeFile('./oimod/pospago_logado.png', image, 'base64', function(callback){

        })
      })
      .elementById('usernameinput').sendKeys('testeoimod@gmail.com')
      .hideKeyboard()
      .elementById('passwordinput').sendKeys('Testes123')
      .hideKeyboard()
      .elementById('register').click()
      .sleep(15000)
      .elementByXPath('//android.view.ViewGroup[@index=\'2\']').click()
      .sleep(10000);
  });
});

// Ids da tela de Cadastro
// nome
// email
// email2
// password
// confirm-password
// register
