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
    // .enableSingleRuntimeChunk()
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
    .addStyleEntry('css/app', './assets/css/app.css')
//.addStyleEntry('css/app', './assets/css/app.scss')

// uncomment if you use TypeScript
//.enableTypeScriptLoader()

// uncomment if you use Sass/SCSS files
//.enableSassLoader()

// uncomment for legacy applications that require $/jQuery as a global variable
//.autoProvidejQuery()
;

module.exports = Encore.getWebpackConfig();
