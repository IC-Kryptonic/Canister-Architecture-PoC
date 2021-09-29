import { Grid } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { useLayoutStyles, themeProvider } from '../../styles/shared_styles';
import MarketplaceHeader from '../marketplace/MarketplaceHeader';

interface LayoutProps {
  children?: JSX.Element | JSX.Element[];
  minimalNavbar?: Boolean;
  title: string;
  marginTop?: number;
  marketPlaceHeader?: boolean;
}

function Layout({
  children,
  minimalNavbar = false,
  title,
  marginTop = 60,
  marketPlaceHeader = false,
}: LayoutProps) {
  const classes = useLayoutStyles();

  return (
    // <SEO title={title} />
    <section className={classes.section}>
      <ThemeProvider theme={themeProvider}>
        <Grid container justify="center" className={classes.header}>
          <MarketplaceHeader />
        </Grid>
        <main className={classes.main} style={{ marginTop }}>
          <section className={classes.childrenWrapper}>
            <div className={classes.children}>{children}</div>
          </section>
        </main>
      </ThemeProvider>
    </section>
  );
}

export default Layout;
