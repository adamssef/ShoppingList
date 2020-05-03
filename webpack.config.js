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
    // .enableSingleRuntimeChunk()
    .disableSingleRuntimeChunk()
    // the following line enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())
    .enableReactPreset()
    // .enableSassLoader()
    .configureBabel(function(babelConfig) {
        // add additional presets
        babelConfig.plugins.push('@babel/plugin-proposal-class-properties');
        // babelConfig.presets.push('@babel/preset-env')
        // no plugins are added by default, but you can add some
    })
    // .configureBabel(() => {}, {
    //     useBuiltIns: 'usage',
    //     corejs: 3
    // })

    // uncomment to define the assets of the project
    .addEntry('index', ['babel-polyfill','./assets/js/index.js'])
    .configureLoaderRule('images', (loaderRule) => {
        loaderRule.options.esModule = false;
    })
    //
    // .addStyleEntry('css/app', './assets/css/app.css')
    // .copyFiles({
    //     from: './assets/img',
    //     to: 'img/[path][name].[hash:8].[ext]'
    // })
;

// Encore.configureLoaderRule(['css'], loaderRule => {
//     loaderRule.test = /\.css$/
// });
//
// Encore.configureLoaderRule(['img'], loaderRule => {
//     loaderRule.test = /\.(png|svg|jpg|gif)$/
// });



module.exports = Encore.getWebpackConfig();