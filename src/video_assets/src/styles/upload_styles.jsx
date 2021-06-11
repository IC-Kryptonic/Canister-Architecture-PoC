import { makeStyles } from '@material-ui/core';

const maxWidth = 400;

const uploadStyles = makeStyles({
  uploadContainer: {
    maxWidth: 1280,
    padding: 10,
  },
  dropzoneContainer: {
    borderRight: '1px solid rgb(227, 227, 228)',
  },
  dropzone: {
    maxWidth,
  },
  form: {
    maxWidth,
    marginLeft: 20,
  },
  uploadArea: {
    marginTop: 30,
  },
  headerText: {
    fontSize: 40,
  },
  uploadButton: {
    marginTop: 50,
  },
  progress: {
    maxHeight: '100%',
  },
});

export { uploadStyles };
