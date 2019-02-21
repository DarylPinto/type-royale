import React, { Component } from 'react';
import 'components/App.sass';

import TypePanel from 'components/TypePanel.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Type Royale</h1>
        <TypePanel />
      </div>
    );
  }
}

export default App;
