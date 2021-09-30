// @ts-nocheck
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button } from '@material-ui/core';
import { useSearchStyles } from '../../styles/shared_styles';
import SearchIcon from '@material-ui/icons/Search';

function Search() {
  const history = useHistory();
  const classes = useSearchStyles();

  function handleSubmit(event) {
    event.preventDefault();
    const searchQuery = event.target.elements.search.value;

    if (!searchQuery.trim()) return;

    history.push(`/home?search=${searchQuery}`);
  }

  return (
    <Box>
      <form onSubmit={handleSubmit} className={classes.form}>
        <input id="search" type="text" placeholder="Search" className={classes.input} />
        <Button aria-label="Search videos" type="submit" className={classes.button}>
          <SearchIcon className={classes.icon} />
        </Button>
      </form>
    </Box>
  );
}

export default Search;
