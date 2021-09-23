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
        backgroundColor: "#E9E6E6"
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
        padding: "10px"
    }
});

export { watchVideoStyles };