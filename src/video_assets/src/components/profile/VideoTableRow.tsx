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
import { getVideoLikes } from '../../services/profile_service';

interface VideoTableRowProps {
    index: number;
    post: Post;
}

const VideoTableRow = ({ index, post }: VideoTableRowProps) => {

    const [likes, setLikes] = useState(0);
    
    useEffect(() => {
        const getLikes = async(videoId: String) => {
            setLikes(await getVideoLikes(videoId));
        }
        getLikes(post.video_id[0])
    }, []);

    return (
        <TableRow key={index}>
            <TableCell component="th" scope="row">
                <VideoElem key={index} post={post} />
            </TableCell>
            <TableCell>
                {Math.floor(Math.random() * 1000)}
            </TableCell>
            <TableCell>
                {likes}
            </TableCell>
            <TableCell>
                {Math.floor(Math.random() * 10)}€
            </TableCell>
        </TableRow>
    );
};

export default VideoTableRow;