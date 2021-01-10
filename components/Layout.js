import {
  AppBar,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Link,
  Container,
  Box,
  Typography,
} from '@material-ui/core';
import Head from 'next/head';
import React from 'react';
import { theme, useStyles } from '../utils/styles';
import NextLink from 'next/link';

export default function Layout({
  children,
  commercePublicKey,
  title = 'NextJsShop',
}) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Head>
        <meta charSet="utf-8" />
        <title>{`${title} - NextJsShop`}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar
          position="static"
          color="default"
          elevation={0}
          className={classes.appBar}
        >
          <Toolbar className={classes.toolbar}>
            <NextLink href="/">
              <Link
                variant="h6"
                color="inherit"
                noWrap
                href="/"
                className={classes.toolbarTitle}
              >
                NextJsShop
              </Link>
            </NextLink>
            <nav>
              <NextLink href="/cart">
                <Link
                  variant="button"
                  color="textPrimary"
                  noWrap
                  href="/cart"
                  className={classes.link}
                >
                  Cart
                </Link>
              </NextLink>
            </nav>
          </Toolbar>
        </AppBar>
        <Container component="main" className={classes.main}>
          {children}
        </Container>
        <Container maxWidth="md" component="footer">
          <Box mb={5}>
            <Typography variant="body2" color="textSecondary" align="center">
              NextJsShop 2020. copyright by nguyen dinh khoi
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    </React.Fragment>
  );
}