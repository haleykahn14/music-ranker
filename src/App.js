import React, { Component } from 'react'; // Import Component from react
import logo from './logo.svg';
import './App.css';

class App extends Component { // Convert App to a class that extends Component
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      greeting: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ name: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    fetch(`/api/greeting?name=${encodeURIComponent(this.state.name)}`)
      .then(response => response.json())
      .then(state => this.setState(state));
  }

  render() { // Add render method
    return (
      <div className="Music Ranker">
        <header className="App-header">
          <p>
            Test out this music ranker!
          </p>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="name">Enter in the artist you are interested in: </label>
            <input
              id="name"
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
            />
            <button type="submit">Submit</button>
          </form>
          <p>{this.state.greeting}</p>
        </header>
      </div>
    );
  }
}

export default App;