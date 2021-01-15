import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  MenuItem,
  Select,
  Slide,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import Router from 'next/dist/next-server/server/router';
import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import { Store } from '../components/Store';
import dynamic from 'next/dynamic';
import { useStyles } from '../utils/styles';
import getCommerce from '../utils/commerce';
import { cartTypes } from '../utils/types';

const dev = process.env.NODE_ENV === 'development';

function Checkout(props) {
  const classes = useStyles();

  const { state, dispatch } = useContext(Store);
  const { cart } = state;

  const [firstName, setFirstName] = useState(dev ? 'Jane' : '');
  const [lastName, setLastName] = useState(dev ? 'Doe' : '');
  const [email, setEmail] = useState(dev ? 'janedoe@gmail.com' : '');
  const [errors, setErrors] = useState([]);

  //shipping
  const [shippingName, setShippingName] = useState(dev ? 'Jane Doe' : '');
  const [shippingStreet, setShippingStreet] = useState(
    dev ? '123 Face st' : ''
  );
  const [shippingPostalZipCode, setShippingPostalZipCode] = useState(
    dev ? '90089' : ''
  );
  const [shippingCity, setShippingCity] = useState(dev ? 'Los Angeles' : '');
  const [shippingStateProvince, setShippingStateProvince] = useState(
    dev ? 'AR' : ''
  );
  const [shippingCountry, setShippingCountry] = useState(dev ? 'GB' : '');
  const [shippingOption, setShippingOption] = useState({});

  //Payment details
  const [cardNum, setCardNum] = useState(dev ? '4242 4242 4242 4242' : '');
  const [expMonth, setExpMonth] = useState(dev ? '11' : '');
  const [expYear, setExpYear] = useState(dev ? '2020' : '');
  const [cvv, setCvv] = useState(dev ? '113' : '');
  const [billingPostalZipCode, setBillingPostalZipCode] = useState(
    dev ? '90089' : ''
  );

  // shipping and fulfillment data
  const [shippingCountries, setShippingCountries] = useState({});
  const [shippingSubdivisions, setShippingSubdivisions] = useState({});
  const [shippingOptions, setShippingOptions] = useState([]);

  // stepper
  const [activeStep, setActiveStep] = React.useState(0);
  const steps = [
    'Customer information',
    'Shipping details',
    'Payment information',
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      handleCaptureCheckout();
    }
  };

  const handleBack = () => {
    setErrors([]);
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shippingName"
              label="shipping Name"
              name="shippingName"
              value={shippingName}
              onChange={(e) => setShippingName(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shippingCity"
              label="shipping City"
              name="shippingCity"
              value={shippingCity}
              onChange={(e) => setShippingCity(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shippingPostalZipCode"
              label="Postal/Zip Code"
              name="postalZipCode"
              value={shippingPostalZipCode}
              onChange={(e) => setShippingPostalZipCode(e.target.value)}
            />
            <FormControl className={classes.formControl}>
              <InputLabel id="shippingCountry-label">Country</InputLabel>
              <Select
                labelId="shippingCountry-label"
                id="shippingCountry"
                label="Country"
                fullWidth
                onChange={handleShippingCountryChange}
                value={shippingCountry}
              >
                {Object.keys(shippingCountries).map((index) => (
                  <MenuItem value={index} key={index}>
                    {shippingCountries[index]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Layout title="Check out" commercePublicKey={props.commercePublicKey}>
      <Typography gutterBottom variant="h6" color="textPrimary" component="h1">
        Check out
      </Typography>
      {cart.loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          <Grid item md={8}>
            <form className={classes.card}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box>
                {activeStep === steps.length ? (
                  errors && error.length > 0 ? (
                    <Box>
                      <List>
                        {errors.map((error) => (
                          <ListItem key={error}>
                            <Alert severity="error">{error}</Alert>
                          </ListItem>
                        ))}
                      </List>
                      <Box className={classes.mt1}>
                        <Button onClick={handleBack} className={classes.button}>
                          Back
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <CircularProgress />
                      <Typography className={classes.instructions}>
                        Confirming Order...
                      </Typography>
                    </Box>
                  )
                ) : (
                  <Box>
                    {getStepContent(activeStep)}
                    <Box className={classes.mt1}>
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.button}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                      >
                        {activeStep === steps.length - 1
                          ? 'Confirm Order'
                          : 'Next'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </form>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(Checkout), {
  ssr: false,
});
