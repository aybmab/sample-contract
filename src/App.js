import React, { Component } from 'react';
import './App.css';
import PixelGrid from './components/pixel_grid/PixelGrid.jsx'

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }


  render() {
    return (

      <div className="App">
        <header className="App-header">
        </header>
        <p className="App-intro">
        </p>

        <PixelGrid />
      </div>

    );
  }
}

export default App;
