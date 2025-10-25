module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    
    files: [
      'src/**/*.spec.js'
    ],
    
    preprocessors: {
      'src/**/*.spec.js': ['webpack', 'sourcemap'],
      // Agregar coverage para archivos fuente (no specs)
      'src/**/!(*.spec).js': ['webpack', 'coverage'],
      'src/**/!(*.spec).jsx': ['webpack', 'coverage']
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
                ],
                // Agregar plugin de istanbul solo en entorno de test
                plugins: process.env.NODE_ENV === 'test' ? ['istanbul'] : []
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
    
    // Agregar reporter de coverage
    reporters: ['spec', 'junit', 'html', 'coverage'],
    
    specReporter: {
      maxLogLines: 5,
      suppressErrorSummary: false,
      suppressFailed: false,
      suppressPassed: false,
      suppressSkipped: true,
      showSpecTiming: true,
      failFast: false
    },
    
    junitReporter: {
      outputDir: 'test-reports/junit',
      outputFile: 'test-results.xml',
      suite: 'Level-UP Gamer Store Tests',
      useBrowserName: false
    },
    
    htmlReporter: {
      outputDir: 'test-reports/html',
      templatePath: null,
      focusOnFailures: true,
      namedFiles: false,
      pageTitle: 'Level-UP - Test Reports',
      urlFriendlyName: false,
      reportName: 'test-report',
      preserveDescribeNesting: true,
      foldAll: false
    },
    
    // Configuración del reporte de cobertura
    coverageReporter: {
      dir: 'test-reports/coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.' },
        { type: 'text-summary' },
        { type: 'json', subdir: '.', file: 'coverage.json' }
      ],
      check: {
        global: {
          statements: 70,
          branches: 60,
          functions: 70,
          lines: 70
        }
      }
    },
    
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