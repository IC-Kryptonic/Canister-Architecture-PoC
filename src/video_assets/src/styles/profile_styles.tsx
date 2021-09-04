import { makeStyles, Theme, withStyles } from "@material-ui/core";

interface useProfilePageStylesInterface {
  container: any,
  followingSection: any,
  followingText: any,
  followingCount: any,
  cardLarge: any,
  cardContentLarge: any,
  cardSmall: any,
  sectionSmall: any,
  typography: any,
  section: any,
  usernameSection: any,
  username: any,
  button: any,
  settings: any,
  settingsWrapper: any,
  usernameDivSmall: any,
  dialogScrollPaper: any,
  dialogPaper: any,
  dialogTitle: any,
  wrapper: any,
  avatar: any,
  unfollowDialogScrollPaper: any,
  cancelButton: any,
  unfollowButton: any,
  unfollowDialogText: any,
  buttonSmall: any,
  buttonSelected: any
}

export const useProfilePageStyles = makeStyles((theme): useProfilePageStylesInterface => {
  const followingSectionLarge = {
    display: "grid",
    gridAutoFlow: "column",
    gridGap: 40,
    gridTemplateColumns:
      "minmax(auto, max-content) minmax(auto, max-content) minmax(auto, max-content)",
  };
  const followingTextLarge = {
    display: "grid",
    gridGap: 5,
    gridAutoFlow: "column",
    gridTemplateColumns: "minmax(auto, max-content) minmax(auto, max-content)",
  };
  return {
    container: {
      maxWidth: 935,
    },
    followingSection: {
      [theme.breakpoints.up("sm")]: {
        ...followingSectionLarge,
      },
      [theme.breakpoints.down("xs")]: {
        display: "grid",
        gridAutoFlow: "column",
        padding: "10px 0",
      },
    },
    followingText: {
      [theme.breakpoints.up("sm")]: {
        ...followingTextLarge,
      },
      [theme.breakpoints.down("xs")]: {
        display: "grid",
        justifyItems: "center",
        "& p": {
          fontSize: "0.9rem",
        },
      },
    },
    followingCount: {
      fontWeight: "600 !important",
    },
    cardLarge: {
      background: "transparent !important",
      border: "unset !important",
      display: "grid",
      gridAutoFlow: "column",
      gridTemplateColumns: "minmax(auto, 290px) minmax(auto, 645px)",
    },
    cardContentLarge: {
      display: "grid",
      gridGap: 20,
    },
    cardSmall: {
      background: "transparent !important",
      border: "unset !important",
      [theme.breakpoints.down("xs")]: {
        width: "100vw",
      },
    },
    sectionSmall: {
      display: "grid",
      gridAutoFlow: "column",
      marginBottom: 16,
      gridTemplateColumns: "77px auto",
      gridGap: 20,
    },
    typography: {
      fontWeight: "600 !important",
    },
    section: {
      "& p": {
        [theme.breakpoints.down("xs")]: {
          fontSize: "0.9rem",
        },
      },
    },
    usernameSection: {
      display: "grid",
      gridGap: 10,
      gridAutoFlow: "column",
      gridTemplateColumns: "minmax(auto, max-content) minmax(auto, 112px) 30px",
      alignItems: "center",
    },
    username: {
      fontSize: "28px !important",
      fontWeight: "300 !important",
    },
    button: {
      lineHeight: "unset !important",
      height: "30px !important",
    },
    settings: {
      height: 30,
      width: 30,
    },
    settingsWrapper: {
      "&:hover": {
        cursor: "pointer",
      },
    },
    usernameDivSmall: {
      display: "grid",
      // gridGap: 20,
      gridAutoFlow: "column",
      // gridTemplateColumns: "minmax(auto, max-content) minmax(auto, 112px) 30px",
      alignItems: "center",
      gridTemplateColumns: "minmax(auto, max-content) 30px",
      gridGap: 10,
    },
    dialogScrollPaper: {
      display: "grid !important",
      gridTemplateColumns: "minmax(auto, 480px) !important",
    },
    dialogPaper: {
      borderRadius: 12,
    },
    dialogTitle: {
      textAlign: "center",
    },
    wrapper: {
      display: "grid",
      justifyContent: "center",
      padding: "32px 16px 16px",
    },
    avatar: {
      width: 90,
      height: 90,
    },
    unfollowDialogScrollPaper: {
      display: "grid",
      gridTemplateColumns: "minmax(auto, 496px)",
    },
    cancelButton: {
      padding: "12px 8px !important",
    },
    unfollowButton: {
      color: `${theme.palette.error.main} !important`,
      padding: "12px 8px !important",
    },
    unfollowDialogText: {
      padding: "16px 16px 32px !important",
    },
    buttonSmall: {
      width: "30px",
      height: "30px",
      minWidth: "30px",
    },
    buttonSelected: {
      width: "30px !important",
      height: "30px !important",
      minWidth: "30px !important",
      opacity: "0.7 !important",
    },
  };
});

interface useProfilePictureStylesInterface {
  person: any,
  wrapper: any,
  section: any,
  image: any,
}

interface useProfilePictureStylesParams {
  size: number,
  isOwner: Boolean
}

export const useProfilePictureStyles = makeStyles((theme: useProfilePictureStylesParams): useProfilePictureStylesInterface => {
  return {
    person: {
      color: "#ffffff",
      height: ({ size = 150 }) => size,
      width: ({ size = 150 }) => size,
    },
    wrapper: {
      background: "#DBDBDB",
      width: ({ size = 150 }) => size,
      height: ({ size = 150 }) => size,
      borderRadius: "50%",
      display: "grid",
      position: "relative",
      placeItems: "center",
      "&:hover": {
        cursor: ({ isOwner = false }) => (isOwner ? "pointer" : "default"),
      },
    },
    section: {
      display: "grid",
      justifyContent: "center",
    },
    image: {
      height: ({ size = 150 }) => size,
      width: ({ size = 150 }) => size,
      borderRadius: "50%",
    },
  }
});

interface useProfileTabsStylesInterface {
  tabs: any
  section: any,
  tabsIndicator: any,
  tabRoot: any,
  tabLabelIcon: any,
  tabWrapper: any,
  savedPostsSection: any,
  noContent: any,
  image: any,
  imageWrapper: any,
  postMeta: any,
  postMetaItems: any,
  profilePostsSection: any,
  noPicDivAlt: any,
  article: any,
  postContainer: any,
}

export const useProfileTabsStyles = makeStyles((theme): useProfileTabsStylesInterface => {
  return {
    tabs: {
      borderBottom: "1px solid rgba(var(--b38,219,219,219),1)",
    },
    section: {
      [theme.breakpoints.up("sm")]: {
        marginTop: 24,
      },
    },
    tabsIndicator: {
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
      top: 0,
      backgroundColor: "#000000 !important",
    },
    tabRoot: {
      margin: "0px 20px",
      opacity: 0.5,
    },
    tabLabelIcon: {
      minHeight: "unset !important",
    },
    tabWrapper: {
      flexDirection: "row !important",
    },
    savedPostsSection: {
      paddingTop: 60,
      display: "grid",
      justifyContent: "center",
    },
    noContent: {
      display: "grid",
      placeItems: "center",
      gridTemplateColumns: "minmax(auto, 345px)",
      "& *": {
        marginBottom: 16,
      },
    },
    image: {
      width: "100%",
      userSelect: "none",
    },
    imageWrapper: {
      position: "relative",
    },
    postMeta: {
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
    postMetaItems: {
      color: "#ffffff",
      display: "grid",
      gridAutoFlow: "column",
      gridGap: 5,
      placeItems: "center",
      opacity: 0,
    },
    profilePostsSection: {
      display: "flex",
      justifyContent: "center",
      paddingTop: 60,
    },
    noPicDivAlt: {
      display: "grid",
      placeItems: "center",
      "& div": {
        marginBottom: 16,
      },
    },
    article: {
      display: "grid",
      gridTemplateColumns: "minmax(auto, 935px)",
    },
    postContainer: {
      [theme.breakpoints.down("sm")]: {
        gridGap: 2,
      },
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gridGap: 20,
    },
  };
});