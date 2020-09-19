import React, {Component} from 'react';
import './App.css';
import StarList from './StarList';

const shouldFail = id => [3, 4].includes(id);

const initialState = {
  items: [0, 3, 8, 0, 1].map((stars, i) => ({
    id: i + 1,
    stars,
    username: `${shouldFail(i + 1) ? 'Fail' : 'Cool'}`,
    content: 'Text goes here'
  })),
  starredItems: [2, 5]
};

class App extends Component {
  state = initialState;

  render() {
    const {items, starredItems} = this.state;
    return (
        <section className="App">
          <StarList data={items} starredItems={starredItems}/>
        </section>
    );
  }
}

export default App;
