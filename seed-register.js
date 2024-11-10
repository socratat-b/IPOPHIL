const tsConfigPaths = require('tsconfig-paths');
const tsConfig = require('./tsconfig.seed.json');

tsConfigPaths.register({
    baseUrl: './dist',
    paths: tsConfig.compilerOptions.paths
});