import * as esbuild from 'esbuild-wasm';

import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

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
      wasmURL: '/esbuild.wasm',
    });
  };

  const onClick = async () => {
    if (!serviceRef.current) return;

    const result = await serviceRef.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
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
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
