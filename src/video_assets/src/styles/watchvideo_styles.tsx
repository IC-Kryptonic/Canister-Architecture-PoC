import { makeStyles } from '@material-ui/core';

const watchVideoStyles = makeStyles({
    arrowControl: {
        height: "50px",
        width: "50px"
    },
    arrowControlWrapper: {
        width: "50px"
    },
    videoBox: {
        width: "75vh",
        height: "85vh",
        // border: "1px solid black",
    },
    videoPlayer: {
        width: "75vh",
        height: "42vh",
    },
    metadataBox: {
        width: "25vw",
        hegiht: "85vh"
    },
    videoStatisticsWrapper: {
        width: "100px"
    },
    videoStatistic: {
        margin: 5
    },
    shareIcon: {
        height: "30px",
        width: "30px"
    },
    textLabel: {
        marginRight: "5px"
    },
    bidButton: {
        minWidth: "200px"
    },
    titleBox: {
        flexGrow: 1,
        padding: "10px"
    },
    fullWidth: {
        width: "100%"
    },
    dimmedVideoPlayer: {
        width: "75vh",
        height: "42vh",
        boxShadow: "0 0 0 100vmax rgba(0, 0, 0, .3)",
        pointerEvents: "none"
    },
});

export { watchVideoStyles };