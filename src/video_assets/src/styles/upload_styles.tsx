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
  progress: {
    maxWidth: "500px",
    width: '100%'
  },
  gridItem: {
    width: "100%"
  },
  textBox: {
    marginBottom: "10px"
  }
});

export { uploadStyles };
