if (process.env.DEV) {
  exports.iosTestApp = "sample-code/apps/TestApp/build/release-iphonesimulator/TestApp-iphonesimulator.app";
  exports.iosWebviewApp = "sample-code/apps/WebViewApp/build/release-iphonesimulator/WebViewApp.app";
  exports.iosUICatalogApp = "sample-code/apps/UICatalog/build/release-iphonesimulator/UICatalog.app";
  exports.androidApiDemos = "sample-code/apps/ApiDemos/bin/ApiDemos-debug.apk";
  exports.selendroidTestApp = "sample-code/apps/selendroid-test-app.apk";
} else {
  exports.iosTestApp = "http://appium.github.io/appium/assets/TestApp7.1.app.zip";
  exports.iosWebviewApp = "http://appium.github.io/appium/assets/WebViewApp7.1.app.zip";
  exports.iosUICatalogApp = "http://appium.github.io/appium/assets/UICatalog7.1.app.zip";
  exports.androidApiDemos = "/home/wagner/Documentos/Projetos/minhaoi/minha-oi-2.7.3-prod-release.apk";
  //exports.androidApiDemos = "/home/wagner/Documentos/Projetos/minhaoi/minha-oi-3.0.0-prod-release.apk";
  exports.oimod = "/home/wagner/Documentos/Projetos/OiMod/OiMod_v1.0.13.apk";
  exports.selendroidTestApp = "http://appium.github.io/appium/assets/selendroid-test-app-0.10.0.apk";

  exports.iosWebviewAppLocal = "http://localhost:3000/WebViewApp7.1.app.zip";
  exports.androidApiDemosLocal = "http://localhost:3000/ApiDemos-debug.apk";
}
