import * as esbuild from 'esbuild-wasm';

import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
  const serviceRef = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    startService();
  }, []);

  const startService = async () => {
    //esbuild will be running in the browser, cant access file system
    //intercept when it tries to look, and find the module ourselves
    serviceRef.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  const onClick = async () => {
    if (!serviceRef.current) return;

    const result = await serviceRef.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': 'production',
        global: 'window',
      },
    });
    // console.log(result);

    setCode(result.outputFiles[0].text);
  };
  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe src='/test.html' />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
