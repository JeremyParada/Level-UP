module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    
    files: [
      'src/**/*.spec.js',
      'src/**/*.test.js'
    ],
    
    preprocessors: {
      'src/**/*.spec.js': ['webpack', 'sourcemap'],
      'src/**/*.test.js': ['webpack', 'sourcemap']
    },
    
    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env', 
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ]
              }
            }
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          }
        ]
      },
      resolve: {
        extensions: ['.js', '.jsx']
      },
      devtool: 'inline-source-map'
    },
    
    webpackMiddleware: {
      stats: 'errors-only',
      noInfo: true
    },
    
    reporters: ['progress'],
    
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    singleRun: false,
    concurrency: Infinity,
    
    client: {
      jasmine: {
        random: false
      }
    }
  });
};