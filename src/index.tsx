import ReactDOM from 'react-dom';
import { useState } from 'react';

import CodeEditor from './components/CodeEditor';

import 'bulmaswatch/superhero/bulmaswatch.min.css';
import Preview from './components/Preview';
import bundlerService from './bundler';

const App = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const onClick = async () => {
    const code = await bundlerService(input);
    setCode(code);
  };

  return (
    <div>
      <CodeEditor
        initialValue='Hello Editor!'
        onChange={(value) => setInput(value)}
      />
      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <Preview code={code} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
