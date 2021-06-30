import React, { useState } from 'react';
import { Grid, TextField, Button, CircularProgress } from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import Header from '../components/Header';
import { uploadStyles } from '../styles/upload_styles';
import { uploadVideo } from '../services/video_backend';
import { ToastContainer, toast } from 'react-toastify';

const maxFileSize = 30000000;
const filesLimit = 1;
const acceptedFiles = ['video/*'];

const Upload = () => {
  const classes = uploadStyles();
  const [video, setVideo] = useState<File | undefined>(undefined);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const canSubmit = () => {
    return video !== undefined && title !== '' && description !== '';
  };

  const executeUpload = async () => {
    setUploading(true);
    try {
      await uploadVideo(title, description, video);
      toast.success('Video erfolgreich hochgeladen!', {
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

  return (
    <>
      <Header />
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
      <Grid container justify="center">
        <Grid
          container
          justify="center"
          className={classes.uploadContainer}
          spacing={3}
        >
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
            <Grid
              container
              item
              justify="center"
              className={classes.dropzoneContainer}
              xs={4}
            >
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
            <Grid container item xs={4} justify="center">
              <Grid container spacing={2} className={classes.form}>
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
              className={classes.uploadButton}
              disabled={uploading || !canSubmit()}
              variant="contained"
              color="secondary"
              onClick={executeUpload}
            >
              {uploading ? (
                <CircularProgress className={classes.progress} />
              ) : (
                'Hochladen'
              )}
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default Upload;
