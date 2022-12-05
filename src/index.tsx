import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import { setupStore } from './store/store';

import { App } from '@/App';
import './utils/i18n';

import '@/styles/index.pcss';

const container = document.getElementById('app');
const root = createRoot(container!);

const store = setupStore();

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
