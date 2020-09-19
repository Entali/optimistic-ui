import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';
import { shouldFail } from './utils'

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

const httpRequest = (id) => {
  console.log('begin')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldSucceed = !shouldFail(id);
      console.log('end')
      shouldSucceed ? resolve() : reject();
    }, 1000)
  })
}

const StarList = (props) => {
  const {data, starredItems} = props;
  const classes = useStyles();

  const renderButton = (stars, id) => {
    return (
        <div className={classes.likeButton} onClick={onClick(id)}>
          <span className={classes.likeIcon}>
            <Icon
              className={classes.icon}
              color={starredItems.includes(id) ? 'error' : 'inherit'}
            >
              {stars ? 'star' : 'star_outlined'}
            </Icon>
          </span>
          <span style={{color: starredItems.includes(id) && 'red'}}>
            {stars}
          </span>
        </div>
    )
  }

  const onClick = (id) => () => httpRequest(id)

  const renderItems = () => {
    return data.map(({id, stars, username, icon, content}) => {
      return (
          <ListItem key={`${id + username}`}>
            <ListItemAvatar>
              <Avatar>
                <Icon>{icon}</Icon>
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={username} secondary={content}/>
            {renderButton(stars, id)}
          </ListItem>
      )
    })
  };

  return (
      <List className={classes.root}>
        {renderItems()}
      </List>
  )
};
export default StarList;
