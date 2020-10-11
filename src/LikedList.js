import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles({
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
});

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

const LikedList = (props) => {
  const {data, likedItems} = props;
  const classes = useStyles();

  const onClick = (id) => () => {
    httpRequest(id)
        .then(
            res => console.log('resolved'),
            rej => console.log('rejected')
        )
  }

  const renderButton = (likes, id) => {
    let likedByMe = likedItems.includes(id)
    return (
        <div onClick={onClick(id)} className={classes.likeButton}>
          <span
              style={{ color: likes && likedByMe ? 'red' : 'inherit' }}
          >
            <i className={`fa${likes ? 's' : 'r'} fa-heart`} />
            &nbsp;
            <span>{likes}</span>
          </span>
        </div>
    )
  }

  const renderItems = () => {
    return data.map(({id, likes, username, content}) => {
      return (
          <ListItem key={`${id + username}`} className={classes.container}>
            <ListItemAvatar>
              <Avatar>
                <i className="fas fa-user-astronaut" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={username} secondary={content}/>
            <div className={classes.actions}>
              <span>
                <i className="fas fa-comment" />
                &nbsp;
                <span>{likes + 7}</span>
              </span>
              <i className="fas fa-share" />
              {renderButton(likes, id)}
              <i className="fas fa-envelope" />
            </div>
          </ListItem>
      )
    })
  };

  return (
      <List className={classes.root}>
        {renderItems()}
      </List>
  )
}
export default LikedList;
