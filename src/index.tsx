import * as esbuild from 'esbuild-wasm';
import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

import './index.css';

const App = () => {
  const ref = useRef<any>();

  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });

    console.log('result => ', result);

    setCode(result.outputFiles[0].text);
  };

  return (
    <div className="main">
      <textarea
        className="item item-outline"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button className="btn" onClick={onClick}>
          Submit
        </button>
      </div>
      <pre className="item item-outline">{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector('#root'));
