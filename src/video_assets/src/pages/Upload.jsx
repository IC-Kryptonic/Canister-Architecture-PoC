import React, { useState } from 'react';
import { Grid, TextField, Button, CircularProgress } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import Header from '../components/Header';
import { uploadStyles } from '../styles/upload_styles';
import { uploadVideo } from '../services/video_backend';

const maxFileSize = 30000000;
const filesLimit = 1;

const Upload = () => {
  const classes = uploadStyles();
  const [video, setVideo] = useState(undefined);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const canSubmit = () => {
    return video !== undefined && title !== '' && description !== '';
  };

  const executeUpload = async () => {
    setUploading(true);
    try {
      await uploadVideo(title, description, video);
      setVideo(undefined);
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Upload video:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <Grid container justify="center">
        <Grid container className={classes.uploadContainer} spacing={3}>
          <Grid container item justify="center">
            <span className={classes.headerText}>
              <strong>Video hochladen</strong>
            </span>
          </Grid>
          <Grid
            container
            item
            justify="center"
            alignItems="center"
            spacing={1}
            className={classes.uploadArea}
          >
            <Grid item>
              <div className={classes.dropzone}>
                <DropzoneArea
                  onChange={(videos) => setVideo(videos[0])}
                  maxFileSize={maxFileSize}
                  filesLimit={filesLimit}
                />
              </div>
            </Grid>
            <Grid item>
              <Grid container spacing={2}>
                <Grid container item>
                  Titel:
                </Grid>
                <Grid container item>
                  <TextField
                    variant="outlined"
                    value={title}
                    onChange={(changedTitle) => {
                      setTitle(changedTitle.target.value);
                    }}
                  />
                </Grid>
                <Grid container item>
                  Beschreibung:
                </Grid>
                <Grid container item>
                  <TextField
                    variant="outlined"
                    value={description}
                    onChange={(changedDescription) => {
                      setDescription(changedDescription.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item justify="center">
            <Button
              disabled={uploading || !canSubmit()}
              variant="contained"
              color="secondary"
              onClick={executeUpload}
            >
              {uploading ? <CircularProgress /> : 'Hochladen'}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Upload;
