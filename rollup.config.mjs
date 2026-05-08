import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    { file: 'dist/index.mjs', format: 'esm', sourcemap: true },
    { file: 'dist/index.cjs', format: 'cjs', sourcemap: true }
  ],
  external: [/^[^./]/], 
  plugins: [
    typescript({ tsconfig: './tsconfig.json' }),
    terser({
      compress: { passes: 2, ecma: 2020 },
      mangle: { properties: false }
    })
  ]
};
