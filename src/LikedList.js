import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';

const useStyles = makeStyles({
  root: {
    width: '100%',
    maxWidth: 360
  },
  likeButton: {
    display: 'flex',
    alignItems: 'center'
  },
  likeIcon: {
    margin: '0 4px',
    cursor: 'pointer'
  },
  icon: {}
});

const shouldFail = id => [3, 4].includes(id);

// Fake request. Fail for id 3 and 4
const httpRequest = (id) => {
  console.log('http request pending')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldSucceed = !shouldFail(id);
      console.log('shouldSucceed', shouldSucceed)
      shouldSucceed ? resolve() : reject();
    }, 2000)
  })
}

const LikedList = (props) => {
  const {data, likedItems} = props;
  const classes = useStyles();

  const renderButton = (likes, id) => {
    let likedByMe = likedItems.includes(id)
    return (
        <div className={classes.likeButton} onClick={onClick(id)}>
          <span
              className={classes.likeIcon}
              style={{ color: likes && likedByMe ? 'red' : 'inherit' }}
          >
            <i className={`fa${likes ? 's' : 'r'} fa-heart`} />
            &nbsp;
            <span>{likes}</span>
          </span>
        </div>
    )
  }

  const onClick = (id) => () => {
    httpRequest(id)
        .then(
            res => console.log('resolved'),
            rej => console.log('rejected')
        )
  }

  const renderItems = () => {
    return data.map(({id, likes, username, icon, content}) => {
      return (
          <ListItem key={`${id + username}`}>
            <ListItemAvatar>
              <Avatar>
                <Icon>{icon}</Icon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={username} secondary={content}/>
            {renderButton(likes, id)}
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
