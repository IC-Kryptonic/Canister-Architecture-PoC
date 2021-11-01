import React, { useState, useEffect, useContext } from 'react';
import {
  Grid,
  TextField,
  Button,
  CircularProgress,
  Typography,
  LinearProgress,
  Box,
  Tabs,
  Tab,
} from '@material-ui/core';
import { DropzoneArea } from 'material-ui-dropzone';
import { uploadStyles } from '../styles/upload_styles';
import { uploadVideo } from '../services/video_backend';
import { toast } from 'react-toastify';
import Layout from '../components/shared/Layout';
import { CreateVideoPost } from '../interfaces/video_interface';
import { AuthContext } from '../contexts/AuthContext';
import { createToken } from '../services/token_services';
import { TokenContext } from '../contexts/TokenContext';
import { createAd } from '../services/ad_manager';
import { CreateAdPost } from '../interfaces/ad_interface';

const maxFileSize = 30000000;
const filesLimit = 1;
const acceptedFiles = ['video/*'];

enum UploadType {
  Video,
  Ad,
}

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
  const [uploadType, setUploadType] = useState<UploadType>(UploadType.Video);
  const [allowance, setAllowance] = useState(10);
  const [amountPerView, setAmountPerView] = useState(0.01);

  const canSubmit = () => {
    return video !== undefined && title !== '' && description !== '' && shareAmount;
  };

  // Sets video progress
  const setProgressBarValue = (current: number, total: number) => {
    let progress = (current / total) * 100;
    if (progress > 100) {
      progress = 100;
    }
    setProgress(progress);
  };

  const executeUpload = async () => {
    setUploading(true);
    try {
      if (uploadType === UploadType.Video) {
        let createPost: CreateVideoPost = {
          name: title,
          description: description,
          keywords: [],
          thumbnail: undefined,
          video: video,
        };

        const videoId = await uploadVideo(identity, createPost, true, setProgressBarValue);
        await createToken(identity, videoId, createPost, shareAmount);
        setTokenTrigger(true);
      } else {
        let createAdPost: CreateAdPost = {
          name: title,
          description: description,
          keywords: [],
          thumbnail: undefined,
          video: video,
          allowance: BigInt(0),
          amountPerView: BigInt(0),
        };

        await createAd(identity, createAdPost);
      }

      toast.success('Successfully uploaded video!', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: true,
      });

      // Clean up attributes
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
      </>
    );
  } else {
    preview = <></>;
  }

  const uploadTypeLabel = uploadType === UploadType.Video ? 'Video' : 'Ad';

  const getUploadType = () => {
    switch (uploadType) {
      case UploadType.Video:
        return 0;
      case UploadType.Ad:
        return 1;
      default:
        return 0;
    }
  };

  const handleUploadTypeChange = (event: React.ChangeEvent<{}>, newValue: Number) => {
    switch (newValue) {
      case 0:
        setUploadType(UploadType.Video);
        break;
      case 1:
        setUploadType(UploadType.Ad);
        break;
      default:
        break;
    }
  };

  let videoSettings = (
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
  );

  let adSettings = (
    <Box display="flex" justifyContent="left" alignItems="center" flexDirection="column">
      <Box display="flex">
        <TextField
          id="standard-number"
          label="Total allowance"
          type="number"
          value={allowance}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => setAllowance(parseInt(event.target.value))}
          className={classes.textBox}
        />
      </Box>
      <Box display="flex">
        <TextField
          id="standard-number"
          label="Amount per view"
          type="number"
          value={amountPerView}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => setAmountPerView(parseInt(event.target.value))}
          className={classes.textBox}
        />
      </Box>
    </Box>
  );

  return (
    <Layout title={'Upload'}>
      <Grid container direction="column" justify="center" alignItems="center" spacing={4}>
        <Grid item>
          <Typography variant="h4">
            <strong>Upload a new {uploadTypeLabel}</strong>
          </Typography>
        </Grid>
        <Grid item className={classes.gridItem}>
          <Typography align="left" variant="subtitle1">
            <b>Choose an upload type</b>
          </Typography>
          <Tabs
            value={getUploadType()}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleUploadTypeChange}
            aria-label="Upload type"
            variant="fullWidth"
          >
            <Tab label="Video" />
            <Tab label="Ad" />
          </Tabs>
        </Grid>
        <Grid item className={classes.gridItem}>
          <Typography align="left" variant="subtitle1">
            <b>
              Upload {uploadType === UploadType.Video ? 'a' : 'an'} {uploadTypeLabel}
            </b>
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
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid item>
              <Typography align="left" variant="subtitle1">
                <b>{uploadTypeLabel} description</b>
              </Typography>
              <TextField
                label="Title"
                variant="outlined"
                value={title}
                placeholder={'Awesome title...'}
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
                placeholder={'Insightful description...'}
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
          {uploadType === UploadType.Video ? videoSettings : adSettings}
        </Grid>

        <Grid item className={classes.gridItem}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            className={classes.lastItem}
          >
            {!uploading ? (
              <Button
                disabled={uploading || !canSubmit()}
                variant="contained"
                color="primary"
                onClick={executeUpload}
              >
                Upload
              </Button>
            ) : (
              <>
                <Typography>Progress {Math.floor(progress)}%</Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  className={classes.progress}
                />
              </>
            )}
          </Box>
          <br />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Upload;
