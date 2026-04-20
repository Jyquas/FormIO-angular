import esbuild from 'esbuild';

esbuild
  .build({
    entryPoints: ['src/regula-wrapper.js'],
    outfile: 'dist/regula-wrapper.iife.js',
    bundle: true,
    format: 'iife',
    globalName: 'RegulaWebComponentBridge',
    platform: 'browser',
    target: ['es2018'],
    sourcemap: true,
    logLevel: 'info'
  })
  .catch(function (error) {
    console.error(error);
    process.exit(1);
  });
