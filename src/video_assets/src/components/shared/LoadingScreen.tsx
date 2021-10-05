import React from "react";
import { useLoadingScreenStyles } from "../../styles/shared_styles";
import LoopIcon from '@material-ui/icons/Loop';

function LoadingScreen() {
  const classes = useLoadingScreenStyles();

  return (
    <section className={classes.section}>
      <span>
        <LoopIcon />
      </span>
    </section>
  );
}

export default LoadingScreen;
