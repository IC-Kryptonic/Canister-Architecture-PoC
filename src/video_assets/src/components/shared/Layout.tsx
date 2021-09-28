import { ThemeProvider } from "@material-ui/core/styles";
import React from "react";
import { useLayoutStyles, themeProvider } from "../../styles/shared_styles";
import Header from "../Header";

interface LayoutProps {
  children?: JSX.Element | JSX.Element[],
  minimalNavbar?: Boolean,
  title: string,
  marginTop?: number
}

function Layout({ children, minimalNavbar = false, title, marginTop = 60 }: LayoutProps) {
  const classes = useLayoutStyles();

  return (
    // <SEO title={title} />
    //   <Navbar minimalNavbar={minimalNavbar} />
    <section className={classes.section}>
      <ThemeProvider theme={themeProvider}>
        <Header />
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
