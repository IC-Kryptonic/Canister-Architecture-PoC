import React, { useEffect } from 'react';
// javascipt plugin for creating charts
import Chart from 'chart.js';
// react plugin used to create charts
import { Line } from 'react-chartjs-2';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { chartOptions, parseOptions, chartExample1 } from '../../variables/charts.js';

import componentStyles from '../../assets/theme/views/admin/dashboard.js';

const useStyles = makeStyles(componentStyles);

function MarketplaceTable({ index }) {
  const classes = useStyles();
  const validIndex = index % 6;
  const [chartExample1Data, setChartExample1Data] = React.useState('data' + validIndex);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  return (
    <>
      {/* Page content */}
      <Container
        maxWidth={false}
        component={Box}
        marginTop="-6rem"
        classes={{ root: classes.containerRoot }}
      >
        <Grid container>
          <Grid
            item
            xs={12}
            xl={8}
            component={Box}
            marginBottom="3rem!important"
            classes={{ root: classes.gridItemRoot }}
          >
            <Card
              classes={{
                root: classes.cardRoot + ' ' + classes.cardRootBgGradient,
              }}
            >
              <CardContent>
                <Box position="relative" height="250px">
                  <Line
                    data={chartExample1[chartExample1Data]}
                    options={chartExample1.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default MarketplaceTable;
