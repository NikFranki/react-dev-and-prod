import React, { Component } from 'react';
import ReactDOM, { render } from 'react-dom';
import PropType from 'prop-types';

class WTMM extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>rzrq wtmm11</div>;
    }
}

render(<WTMM />, document.getElementById('main'));

if (module.hot) {
  module.hot.accept();
}
