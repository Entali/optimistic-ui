import React, {Component} from 'react';
import withStyles from '@material-ui/styles/withStyles';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import './App.css';

const initialState = {
  items: [29, 4, 59, 17, 46].map((likes, i) => ({
    id: i + 1,
    likes,
    username: [`User ${i + 1}`],
    content: 'Text goes here'
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

// setState updater
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

class App extends Component {
  state = initialState;

  onClick = (postId) => () => {
    const {likedPosts} = this.state;
    const isLiked = likedPosts.includes(postId)

    this.setState(setPostLiked(postId, !isLiked))
    console.log(`State updated with id - ${postId}`)

    httpRequest(postId)
        .then((res) => {
          console.log('resolved')
        })
        .catch((err) => {
              console.log('Error caught')
            }
        )
  }

  renderButton = (likes, id) => {
    const {props, state, onClick} = this;
    const {likedPosts} = state;
    const {classes} = props;

    return (
        <div onClick={onClick(id)} className={classes.likeButton}>
          <span
              style={
                {color: likes && likedPosts.includes(id) ? 'red' : 'inherit'}
              }
          >
            <i className={`fa${likes ? 's' : 'r'} fa-heart`}/>
            &nbsp;
            <span>{likes}</span>
          </span>
        </div>
    )
  }

  renderItems = (items) => {
    const {props, renderButton} = this;
    const {classes} = props;

    return items.map(({id, likes, username, content}) => {
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
              {renderButton(likes, id)}
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
          <List className={classes.root}>
            {renderItems(items)}
          </List>
        </section>
    );
  }
}

export default withStyles(useStyles)(App);
