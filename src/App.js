import React, {Component} from 'react';
import './App.css';
import LikedList from './LikedList';
import {shouldFail} from './utils'

const initialState = {
  items: [29, 0, 54, 17, 46].map((likes, i) => ({
    id: i + 1,
    likes,
    username: `${shouldFail(i + 1) ? 'Fail' : 'Cool'}`,
    content: 'Text goes here'
  })),
  likedItems: [2, 5]
};

class App extends Component {
  state = initialState;

  render() {
    const {items, likedItems} = this.state;
    return (
        <section className="App">
          <LikedList data={items} likedItems={likedItems}/>
        </section>
    );
  }
}

export default App;
