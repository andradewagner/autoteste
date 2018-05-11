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
    return driver.sleep(5000)

      .elementById('br.com.mobicare.minhaoi:id/minhaoi_hub_bottom_btn').click()
      .elementById('br.com.mobicare.minhaoi:id/mop_login_ddd_edittext').sendKeys('21')
      .elementById('br.com.mobicare.minhaoi:id/mop_login_phone_edittext').sendKeys('988911758')
      .elementById('br.com.mobicare.minhaoi:id/mop_login_signin_btn').click()
      .sleep(15000)

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
    return driver.sleep(5000)
      .elementById('br.com.mobicare.minhaoi:id/mop_balance_exchange_btn_inside').click()
      .sleep(1000)
    });

  it("should scroll", function () {
    return driver
      .elementById('br.com.mobicare.minhaoi:id/mop_exchange_seekbar')
      //.elementsByXPath('//android.widget.TextView')
      .then(function (els) {
        var a1 = new wd.TouchAction();
        a1.press({x:30, y:645}).release();

        var smile = new wd.TouchAction();
        smile
          .press(els.getLocation())
          .moveTo({x:30, y:645}).release();

        var ma = new wd.MultiAction().add(a1, smile);
        return driver.performMultiAction(ma);
      });
  });
});
