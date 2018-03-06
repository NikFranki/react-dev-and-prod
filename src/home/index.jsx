import React from 'react';  // 必须引入
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

ReactDOM.render(
  <AppContainer>
    <div>12345678</div>
  </AppContainer>,
  document.getElementById('main')
);

if (module.hot) {
  module.hot.accept();
}
