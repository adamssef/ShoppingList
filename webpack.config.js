var Encore = require('@symfony/webpack-encore');

Encore
    // the project directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // the public path used by the web server to access the previous directory
    .setPublicPath('/build')
    // the public path you will use in Symfony's asset() function - e.g. asset('build/some_file.js')
    .setManifestKeyPrefix('build/')

    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    .splitEntryChunks()
    .enableSingleRuntimeChunk()

    // the following line enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())
    .enableReactPreset()
    .configureBabel(function(babelConfig) {
        // add additional presets
        babelConfig.plugins.push('@babel/plugin-proposal-class-properties');
        // babelConfig.presets.push('@babel/preset-env')
        // no plugins are added by default, but you can add some
    })

    // uncomment to define the assets of the project
    .addEntry('js/app', ['babel-polyfill','./assets/js/app.js'])
    //
    .addStyleEntry('css/app', './assets/css/app.css')
    .addEntry('images/photo', './assets/img/photo.jpg')
;

module.exports = Encore.getWebpackConfig();
