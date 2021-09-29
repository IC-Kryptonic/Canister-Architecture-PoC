import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
  LinearProgress,
  Box,
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import Header from '../components/Header';
import { uploadStyles } from '../styles/upload_styles';
import { uploadVideo } from '../services/video_backend';
import { ToastContainer, toast } from 'react-toastify';
import Layout from '../components/shared/Layout';
import { CreateVideoPost } from '../interfaces/video_interface';
import { AuthContext } from '../contexts/AuthContext';
import { createToken } from '../services/token_services';
import { TokenContext } from '../contexts/TokenContext';

const maxFileSize = 30000000;
const filesLimit = 1;
const acceptedFiles = ['video/*'];

const Upload = () => {
  const { identity } = useContext(AuthContext);
  const { setTokenTrigger } = useContext(TokenContext);
  const classes = uploadStyles();
  const [video, setVideo] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);
  const [shareAmount, setShareAmount] = useState<number>(20);
  const [progress, setProgress] = useState(0);

  const canSubmit = () => {
    return video !== undefined && title !== '' && description !== '' && shareAmount;
  };

  // Sets video progress
  const setProgressBarValue = (current: number, total: number) => {
    let progress = current / total * 100;
    if (progress > 100) {
      progress = 100;
    }
    setProgress(progress);
  };

  const executeUpload = async () => {
    setUploading(true);
    try {
      let createPost: CreateVideoPost = {
        name: title,
        description: description,
        keywords: [],
        thumbnail: undefined,
        video: video,
      };
      const videoId = await uploadVideo(createPost, true, setProgressBarValue);
      await createToken(identity, videoId, createPost, shareAmount);
      setTokenTrigger(true);
      toast.success('Successfully uploaded video!', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: true,
      });
      setVideo(undefined);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Upload video:', error);
    } finally {
      setUploading(false);
    }
  };

  let preview;
  if (video) {
    preview = (
      <>
        <Typography align="left" variant="subtitle1">
          <b>Preview</b>
        </Typography>
        <div className={classes.dropzone}>
          <video controls className={classes.progress}>
            <source src={URL.createObjectURL(video)} type="video/mp4" />
          </video>
        </div>
      </>)
  } else {
    preview = <></>
  }


  return (
    <Layout title={"Upload"}>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={4}
      >
        <Grid item>
          <Typography variant="h4">
            <strong>Create a new NFT</strong>
          </Typography>
        </Grid>
        <Grid item className={classes.gridItem}>
          <Typography align="left" variant="subtitle1">
            <b>Upload a video</b>
          </Typography>
          <div className={classes.dropzone}>
            <DropzoneArea
              onChange={(videos) => setVideo(videos[0])}
              maxFileSize={maxFileSize}
              filesLimit={filesLimit}
              acceptedFiles={acceptedFiles}
              //@ts-ignore (fault of the package afaik)
              fileObjects={[video]}
            />
          </div>
        </Grid>

        <Grid item className={classes.gridItem}>
          {preview}
        </Grid>

        <Grid item className={classes.gridItem}>
          <Grid container
            direction="column"
            justify="center"
            alignItems="center" >
            <Grid item>
              <Typography align="left" variant="subtitle1">
                <b>Video description</b>
              </Typography>
              <TextField
                label="Title"
                variant="outlined"
                value={title}
                placeholder={"Awesome title..."}
                fullWidth
                onChange={(changedTitle) => {
                  setTitle(changedTitle.target.value);
                }}
                className={classes.textBox}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Description"
                variant="outlined"
                value={description}
                fullWidth
                placeholder={"Insightful description..."}
                multiline
                rows={4}
                onChange={(changedDescription) => {
                  setDescription(changedDescription.target.value);
                }}
                className={classes.textBox}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item className={classes.gridItem}>
          <Typography align="left" variant="subtitle1">
            <b>Marketplace settings</b>
          </Typography>

          <Box display="flex" justifyContent="left" alignItems="center">
            <TextField
              id="standard-number"
              label="Number of shares"
              type="number"
              value={shareAmount}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(event) => setShareAmount(parseInt(event.target.value))}
              className={classes.textBox}
            />
          </Box>
        </Grid>

        <Grid item className={classes.gridItem}>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" className={classes.lastItem}>
            {
              !uploading ? (
                <Button
                  disabled={uploading || !canSubmit()}
                  variant="contained"
                  color="primary"
                  onClick={executeUpload}
                >Upload</Button>
              ) : (
                <>
                  <Typography>Progress {Math.floor(progress)}%</Typography>
                  <LinearProgress variant="determinate" value={progress} className={classes.progress} />
                </>
              )
            }
          </Box>
          <br />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Upload;
