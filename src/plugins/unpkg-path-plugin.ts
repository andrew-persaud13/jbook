import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin', //for debugging purposes, match by name
    setup(build: esbuild.PluginBuild) {
      //called by esbuild w/ build arg. Build represents the bundling process

      //figure out where file is stored -> onResolve intercepts it
      //filter decides what files we intercept
      //can define multiple resolves and onLoads using filters
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);
        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
        // else if (args.path === 'tiny-test-pkg') { //assume this is a module from unpkg
        //   return {
        //     path: 'https://unpkg.com/tiny-test-pkg@1.0.0/index.js',
        //     namespace: 'a',
        //   };
        // }
      });

      //load the file -> onLoad intercepts it
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);

        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import message from 'medium-test-pkg';
              console.log(message);
            `,
          };
        } else {
          const { data } = await axios.get(args.path);
          return {
            loader: 'jsx',
            contents: data,
          };
        }
      });
    },
  };
};
