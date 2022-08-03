import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Card from '../../components/CustomCard';

import charmander from '../../assets/charmander.png';
import { Container, Grid } from '@mui/material';

export default function NotFound() {
  return (
    <Card>
      <Box my={4}>
        <Grid container spacing={8}>
          <Grid item xs={12}>
            <Typography variant="h3" component="p">
              Pokemon Not Found
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};