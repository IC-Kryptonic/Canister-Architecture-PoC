import React, { useState, useEffect } from 'react';
import { Grid, Paper, makeStyles } from '@material-ui/core';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { Post } from '../../interfaces/video_interface';
import VideoElem from './VideoElem';

const videoStyles = makeStyles({
  profile_logo: {
      width: 100,
      height: 100,
  }
});

interface VideoBoxProps {
  posts: Array<Post>
}

const VideoBox = ({ posts }: VideoBoxProps) => {

  return (
    <Grid container justify="center">
      {posts && posts.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Views</TableCell>
                  <TableCell align="right">Likes</TableCell>
                  <TableCell align="right">Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.map((post, index) => (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row">
                      <VideoElem key={index} post={post} />
                    </TableCell>
                    <TableCell>
                      {Math.floor(Math.random() * 1000)}
                    </TableCell>
                    <TableCell>
                      {Math.floor(Math.random() * 100)}
                    </TableCell>
                    <TableCell>
                      {Math.floor(Math.random() * 10)}€
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <span>Du hast noch keine Videos :)</span>
      )}
    </Grid>);
};

export default VideoBox;