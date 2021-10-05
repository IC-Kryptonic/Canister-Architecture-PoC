import { makeStyles } from '@material-ui/core';

const useFeedStyles = makeStyles((theme) => {
    return {
        article: {
            display: "grid",
            gridTemplateColumns: "minmax(auto, 935px)",
            maxWidth: "1280px"
        },
        gridContainer: {
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridGap: "2rem",
            marginTop: "25px",
            [theme.breakpoints.down("sm")]: {
                gridGap: 2,
            }
        }
    }
});

export { useFeedStyles };