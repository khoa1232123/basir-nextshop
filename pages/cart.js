import {
  Button,
  Card,
  CircularProgress,
  Grid,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Slide,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Router from 'next/router';
import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import { Store } from '../components/Store';
import dynamic from 'next/dynamic';
import { useStyles } from '../utils/styles';
import getCommerce from '../utils/commerce';
import { cartTypes } from '../utils/types';

function Cart(props) {
  const classes = useStyles();
  const { products } = props;

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const handleQuantity = async (lineItem, quantity) => {
    const commerce = getCommerce(props.commercePublicKey);
    const cartData = await commerce.cart.update(lineItem.id, {
      quantity,
    });
    dispatch({ type: cartTypes.CART_RETRIEVE_SUCCESS, payload: cartData.cart });
  };

  const handleRemoveCart = async (lineItem) => {
    const commerce = getCommerce(props.commercePublicKey);
    const cartData = await commerce.cart.remove(lineItem.id);
    dispatch({ type: cartTypes.CART_RETRIEVE_SUCCESS, payload: cartData.cart });
  };

  const proccessToCheckout = () => {
    Router.push('/checkout');
  };

  return (
    <Layout title="Cart" commercePublicKey={props.commercePublicKey}>
      {cart.loading ? (
        <CircularProgress />
      ) : !cart.data ? (
        <Alert icon={false} severity="error">
          Cart is empty. <Link href="/">Go shopping</Link>
        </Alert>
      ) : (
        <React.Fragment>
          <Typography variant="h1" component="h1">
            Shopping
          </Typography>
          <Slide direction="up" in={true}>
            <Grid container spacing={1}>
              <Grid item md={9}>
                <TableContainer>
                  <Table aria-label="Orders">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {cart.data.line_items &&
                        cart.data.line_items.map((cartItem) => (
                          <TableRow key={cartItem.name}>
                            <TableCell component="th" scope="row">
                              {cartItem.name}
                            </TableCell>
                            <TableCell>
                              <Select
                                labelId="quantity-label"
                                id="quantity"
                                fullWidth
                                onChange={(e) =>
                                  handleQuantity(cartItem, e.target.value)
                                }
                                value={cartItem.quantity}
                              >
                                {[...Array(10).keys()].map((x) => (
                                  <MenuItem key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </MenuItem>
                                ))}
                              </Select>
                            </TableCell>
                            <TableCell>
                              {cartItem.price.formatted_with_symbol}
                            </TableCell>
                            <TableCell>
                              <Button
                                onClick={() => handleRemoveCart(cartItem)}
                                variant="contained"
                                color="secondary"
                              >
                                X
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item md={3}>
                <Card className={classes.card}>
                  <List>
                    <ListItem>
                      <Grid container>
                        <Typography>
                          Subtotal: {cart.data.subtotal.formatted_with_symbol}
                        </Typography>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      {cart.data.total_items > 0 && (
                        <Button
                          type="button"
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={proccessToCheckout}
                        >
                          Proceed to checkout
                        </Button>
                      )}
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Slide>
        </React.Fragment>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Cart), {
  ssr: false,
});
