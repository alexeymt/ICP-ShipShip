import { createRoot } from 'react-dom/client';

import { App } from './src/App';

import 'react-toastify/dist/ReactToastify.css';

// eslint-disable-next-line no-extend-native, func-names
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const root = createRoot(document.getElementById('root'));

root.render(<App />);
