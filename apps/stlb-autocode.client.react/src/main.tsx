import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { Provider } from 'react-redux';
import { StlbStore } from '@stlb-autocode/stlb-base';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Provider store={StlbStore.default}>
      <App />
    </Provider>
  </StrictMode>
);
