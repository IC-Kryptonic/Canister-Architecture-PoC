import { makeStyles } from '@material-ui/core';

const gridItemWidth = 400;

const uploadStyles = makeStyles({
  uploadContainer: {
    maxWidth: 1280,
    padding: 10,
  },
  dropzoneContainer: {
    borderRight: '1px solid rgb(227, 227, 228)',
  },
  dropzone: {
    width: gridItemWidth,
  },
  form: {
    width: gridItemWidth,
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
    marginBottom: "10px",
    backgroundColor: "white",
    width: gridItemWidth
  },
  lastItem: {
    marginBot: "25px"
  }
});

export { uploadStyles };
