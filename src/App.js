/** @jsx jsx */
import React, {Component} from 'react';
import withStyles from '@material-ui/styles/withStyles';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import { css, jsx } from '@emotion/core'
import './App.css';

const initialState = {
  items: [29, 4, 59, 17, 46].map((likes, i) => ({
    id: i + 1,
    likes,
    username: [`User ${i + 1}`],
    content: 'Text goes here',
    isLoading: false
  })),
  likedPosts: [2, 5]
};

const useStyles = {
  root: {
    width: '400px',
  },
  container: {
    position: 'relative',
    margin: '20px 0 40px',
    paddingBottom: '50px',
    background: '#fff',
    boxShadow: '1px 1px 1px 0 #e0e0e0'
  },
  actions: {
    position: 'absolute',
    bottom: '10px',
    left: '8px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  likeButton: {
    cursor: 'pointer'
  }
};

const shouldFail = id => [3, 4].includes(id);

// Fake request. Fail for id 3 and 4
const httpRequest = (id) => {
  console.log(`HTTP /like_post/${id}`)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldSucceed = !shouldFail(id);
      shouldSucceed ? resolve() : reject();
    }, 2000)
  })
}

// State updaters
const setPostLiked = (postId, newLiked) => {
  return state => {
    const {items, likedPosts} = state;

    return {
      items: items.map((item) => item.id === postId
          ? {...item, likes: item.likes + (!newLiked ? -1 : 1)}
          : item
      ),
      likedPosts: !newLiked
          ? likedPosts.filter(id => id !== postId)
          : [...state.likedPosts, postId]
    }
  }
}

const setLoading = (postId) => {
  return state => {
    const {items} = state;

    return {
      items: items.map((item) => item.id === postId
          ? {...item, isLoading: !item.isLoading}
          : item
      )
    }
  }
}

class App extends Component {
  state = initialState;

  onClick = (postId) => () => {
    const {likedPosts} = this.state;
    const isLiked = likedPosts.includes(postId)

    this.setState(setPostLiked(postId, !isLiked))
    this.setState(setLoading(postId)) // true

    httpRequest(postId)
        .then((res) => {
          console.log('resolved')
        })
        .catch((err) => {
          this.setState(setPostLiked(postId, isLiked))
          console.log('rejected')
        })
        .then(() => {
          this.setState(setLoading(postId)) // false
        })
  }

  renderButton = (likes, id, isLoading) => {
    const {props, state, onClick} = this;
    const {likedPosts} = state;
    const {classes} = props;

    return (
        <div
            className={classes.likeButton}
            onClick={!isLoading ? onClick(id, isLoading) : null}
            style={{pointerEvents: isLoading ? 'none' : 'all'}}
        >
          <span
              style={
                {color: likes && likedPosts.includes(id) ? 'red' : 'inherit'}
              }
          >
            <i className="fas fa-heart"/>
            &nbsp;
            <span>{likes}</span>
          </span>
        </div>
    )
  }

  renderItems = (items) => {
    const {props, renderButton} = this;
    const {classes} = props;

    return items.map(({id, likes, username, content, isLoading}) => {
      return (
          <ListItem key={`${id + username}`} className={classes.container}>
            <ListItemAvatar>
              <Avatar>
                <i className="fas fa-user-astronaut"/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={username} secondary={content}/>
            <div className={classes.actions}>
              <span>
                <i className="fas fa-comment"/>
                &nbsp;
                <span>{likes + 7}</span>
              </span>
              <i className="fas fa-share"/>
              {renderButton(likes, id, isLoading)}
              <i className="fas fa-envelope"/>
            </div>
          </ListItem>
      )
    })
  };

  render() {
    const {props, state, renderItems} = this;
    const {classes} = props;
    const {items} = state;
    return (
        <section className="App">
          <PlainList />
          <List className={classes.root}>
            {renderItems(items)}
          </List>
        </section>
    );
  }
}

let style = css`
  background-color: green;
  &:hover {
    background-color: yellow;
  }
`

class PlainList extends Component {
  state = {
    items: [1, 2, 3, 4, 5].map((i) => ({
      id: i + 1,
      title: `Item ${i + 1}`
    }))
  }

  render() {
    const {items} = this.state;
    return items && items.length && (
        <ul css={style}>
          {items.map(({id, title}) => (
            <li key={`${id}-${title}`}>{title}</li>
          ))}
        </ul>
    )
  }
}

export default withStyles(useStyles)(App);
