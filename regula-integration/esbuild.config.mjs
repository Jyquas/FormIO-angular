import esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/regula-wrapper.js'],
  outfile: 'dist/regula-wrapper.iife.js',
  bundle: true,
  format: 'iife',
  globalName: 'RegulaWebComponentBridge',
  platform: 'browser',
  target: ['es2018'],
  sourcemap: true,
  logLevel: 'info'
};

if (isWatch) {
  const context = await esbuild.context(buildOptions);
  await context.watch();
  await context.rebuild();
  console.log('Watching for changes...');
} else {
  esbuild.build(buildOptions).catch(function (error) {
    console.error(error);
    process.exit(1);
  });
}
