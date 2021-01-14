import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  Card,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Layout from '../../components/Layout';
import { useStyles } from '../../utils/styles';
import getCommerce from '../../utils/commerce';
import { cartTypes } from '../../utils/types';
import Router from 'next/dist/next-server/server/router';
import { Store } from '../../components/Store';

export default function Product(props) {
  const { product } = props;
  const [quantity, setQuantity] = useState(1);

  const classes = useStyles();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const handleAddToCart = async () => {
    const commerce = getCommerce(props.commercePublicKey);
    const lineItem = cart.data.line_items.find(
      (x) => x.product_id === product.id
    );
    if (lineItem) {
      const cartData = await commerce.cart.update(lineItem.id, {
        quantity: quantity,
      });
      dispatch({
        type: cartTypes.CART_RETRIEVE_SUCCESS,
        payload: cartData.cart,
      });
    } else {
      const cartData = await commerce.cart.add(product.id, quantity);
      dispatch({
        type: cartTypes.CART_RETRIEVE_SUCCESS,
        payload: cartData.cart,
      });
    }
    // Router.push('/cart');
  };

  return (
    <Layout title="test" commercePublicKey={props.commercePublicKey}>
      <Grid container spacing={1}>
        <Grid item md={6}>
          <img
            src={product.media.source}
            alt={product.name}
            className={classes.largeImage}
          />
        </Grid>
        <Grid item md={3}>
          <List>
            <ListItem>
              <Typography
                gutterBottom
                variant="h6"
                color="textPrimary"
                component="h1"
              >
                {product.name}
              </Typography>
            </ListItem>
            <ListItem>
              <Box
                dangerouslySetInnerHTML={{ __html: product.description }}
              ></Box>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    Price
                  </Grid>
                  <Grid item xs={6}>
                    {product.price.formatted_with_symbol}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    Status
                  </Grid>
                  <Grid item xs={6}>
                    {product.quantity > 0 ? (
                      <Alert icon={false} severity="success">
                        In Stock
                      </Alert>
                    ) : (
                      <Alert icon={false} severity="error">
                        Unavailable
                      </Alert>
                    )}
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container justify="flex-end">
                  <Grid item xs={6}>
                    Quantity
                  </Grid>
                  <Grid item xs={6}>
                    <Select
                      labelId="quantity-label"
                      id="quantity"
                      fullWidth
                      onChange={(e) => setQuantity(e.target.value)}
                      value={quantity}
                    >
                      {[...Array(product.quantity).keys()].map((x) => (
                        <MenuItem key={x + 1} value={x + 1}>
                          {x + 1}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const { id } = params;
  const commerce = getCommerce();
  const product = await commerce.products.retrieve(id, {
    type: 'permalink',
  });
  return {
    props: {
      product,
    },
  };
}
