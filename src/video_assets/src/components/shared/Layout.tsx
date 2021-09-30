import { Grid, useMediaQuery } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { useLayoutStyles, themeProvider } from '../../styles/shared_styles';
import MarketplaceHeader from '../marketplace/MarketplaceHeader';
import Sidebar, { SidebarType } from './Sidebar';

interface LayoutProps {
  children?: JSX.Element | JSX.Element[];
  minimalNavbar?: Boolean;
  title: string;
  marginTop?: number;
  marketplaceHeader?: boolean;
}

function Layout({
  children,
  minimalNavbar = false,
  title,
  marginTop = 60,
  marketplaceHeader = false,
}: LayoutProps) {
  const classes = useLayoutStyles();

  const showSidebar = useMediaQuery('(min-width:1520px)');

  return (
    // <SEO title={title} />
    <section className={classes.section}>
      <ThemeProvider theme={themeProvider}>
        <Grid container justify="center">
          <MarketplaceHeader showLogo={!showSidebar} />
        </Grid>
        {showSidebar && (
          <Sidebar type={marketplaceHeader ? SidebarType.MARKETPLACE : SidebarType.PLATFORM} />
        )}
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
