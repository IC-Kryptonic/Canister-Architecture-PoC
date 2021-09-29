import { makeStyles, withStyles, createMuiTheme } from "@material-ui/core";

export const PurpleColor = "#5618F2";

export const LighterPurpleColor = "#1876f2";

export const DarkerPurpleColor = "#c318f2";

export const themeProvider = createMuiTheme({
  palette: {
    primary: {
      main: PurpleColor,
    },
    secondary: {
      main: LighterPurpleColor
    }
  },
});

export const useLayoutStyles = makeStyles((theme) => ({
  section: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    minHeight: "100%",
    overflow: "hidden",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    flexShrink: 0,
    position: "relative",
    padding: 0,
    order: 4,
  },
  childrenWrapper: {
    paddingTop: 30,
    display: "flex",
    margin: "0 auto",
    flexFlow: "row nowrap",
    // maxWidth: "935px !important",
  },
  children: {
    width: "100%",
  },
}));

export const useLoadingScreenStyles = makeStyles({
  section: {
    height: "100%",
    position: "absolute",
    width: "100%",
    top: 0,
    zIndex: 9999,
    background: "#fafafa",
    display: "grid",
    placeItems: "center",
  },
});

export const useGridPostStyles = makeStyles((theme) => ({
  image: {
    width: "100%",
    userSelect: "none",
  },
  gridPostContainer: {
    margin: theme.spacing(1),
    position: "relative"
  },
  gridPostOverlay: {
    [theme.breakpoints.down("xs")]: {
      gridAutoFlow: "row",
      alignContent: "space-evenly",
    },
    position: "absolute",
    display: "grid",
    placeItems: "center",
    gridAutoFlow: "column",
    width: "100%",
    height: "100%",
    justifyContent: "space-evenly",
    "&:hover": {
      background: "rgba(0,0,0,0.6)",
      cursor: "pointer",
      "& > div": {
        opacity: 1,
      },
    },
  },
  gridPostInfo: {
    color: "#ffffff",
    display: "grid",
    gridAutoFlow: "column",
    gridGap: 5,
    placeItems: "center",
    opacity: 0,
  },
  video: {
    borderRadius: 15,
    width: '80%',
    marginTop: 10,
    marginBottom: 20,
  },
  loadingSpinner: {
    margin: 40,
    color: 'black',
  }
}));

export const OnHoverVideoPlayerStyles = {
  videoElem: {
    height: 144,
    width: 256
  }
};

export const useSearchStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
    width: 20,
    height: 25,
    border: `1px solid ${PurpleColor}`,
    borderRadius: 0
  },
  icon: {
    color: PurpleColor
  },
  input: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(1),
    width: 300,
    height: 21,
    fontSize: '15px',
    border: `1px solid ${PurpleColor}`,
  },
  // @media screen and (max-width: 750px) {
  //   input#search,
  //   button {
  //     display: none;
  //   }
  // }
}));