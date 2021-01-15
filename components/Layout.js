import {
  AppBar,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Link,
  Container,
  Box,
  Typography,
  CircularProgress,
  Badge,
} from '@material-ui/core';
import Head from 'next/head';
import React, { useContext, useEffect } from 'react';
import { theme, useStyles } from '../utils/styles';
import NextLink from 'next/link';
import { Store } from './Store';
import getCommerce from '../utils/commerce';
import { cartTypes } from '../utils/types';

export default function Layout({
  children,
  commercePublicKey,
  title = 'NextJsShop',
}) {
  const classes = useStyles();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  console.log(cart);

  useEffect(() => {
    const fetchCart = async () => {
      const commerce = getCommerce(commercePublicKey);
      dispatch({ type: cartTypes.CART_RETRIEVE_REQUEST });
      const cartData = await commerce.cart.retrieve();
      dispatch({ type: cartTypes.CART_RETRIEVE_SUCCESS, payload: cartData });
    };
    fetchCart();
  }, []);

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
            <NextLink href="/" className={classes.toolbarTitle}>
              <Link variant="h6" color="inherit" noWrap href="/">
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
                  {cart.loading ? (
                    <CircularProgress />
                  ) : cart.data ? (
                    <Badge badgeContent={cart.data.total_items} color="primary">
                      Cart
                    </Badge>
                  ) : (
                    'Cart'
                  )}
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
