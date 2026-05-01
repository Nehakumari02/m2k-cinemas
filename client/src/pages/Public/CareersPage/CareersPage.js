import React from 'react';
import { makeStyles, Container, Typography, Grid, Paper, Box, Button } from '@material-ui/core';
import { Work, TrendingUp, AccountBalance, LocationOn } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: theme.spacing(12),
    paddingBottom: theme.spacing(8),
    minHeight: '80vh',
    background: '#ffffff',
  },
  hero: {
    padding: theme.spacing(8, 0),
    textAlign: 'center',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    color: '#ffffff',
    borderRadius: '0 0 40px 40px',
    marginBottom: theme.spacing(8),
  },
  title: {
    fontWeight: 800,
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    opacity: 0.8,
    maxWidth: '700px',
    margin: '0 auto',
  },
  sectionTitle: {
    fontWeight: 800,
    marginBottom: theme.spacing(4),
    textAlign: 'center',
    color: '#0f172a',
  },
  jobCard: {
    padding: theme.spacing(3),
    borderRadius: '16px',
    border: '1px solid rgba(15,23,42,0.08)',
    marginBottom: theme.spacing(3),
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
      borderColor: '#b72429',
    }
  },
  role: {
    fontWeight: 700,
    color: '#b72429',
    marginBottom: theme.spacing(1),
  },
  loc: {
    display: 'flex',
    alignItems: 'center',
    color: '#64748b',
    fontSize: '0.85rem',
    marginBottom: theme.spacing(2),
  },
  benefitsCard: {
    padding: theme.spacing(4),
    textAlign: 'center',
    background: '#f8fafc',
    borderRadius: '20px',
    height: '100%',
  },
  benefitIcon: {
    fontSize: '3rem',
    color: '#b72429',
    marginBottom: theme.spacing(2),
  }
}));

const CareersPage = () => {
  const classes = useStyles();

  const jobs = [
    { title: 'Assistant Manager', location: 'Delhi, Rohini' },
    { title: 'Duty Officer', location: 'Delhi, Rohini' },
    { title: 'Operation Head', location: 'Delhi, Rohini' },
    { title: 'Cinema Manager', location: 'Delhi, Rohini' }
  ];

  return (
    <div className={classes.root}>
      <Box className={classes.hero}>
        <Container maxWidth="md">
          <Typography variant="h2" className={classes.title}>Careers at M2K</Typography>
          <Typography variant="h6" className={classes.subtitle}>
            Join our fast-growing organization and build a career in the dynamic cinema industry.
            We are looking for talented and hardworking professionals to join our family.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={6}>
          <Grid item xs={12} md={7}>
            <Typography variant="h4" className={classes.sectionTitle} style={{ textAlign: 'left' }}>
              Open Positions
            </Typography>
            {jobs.map((job, i) => (
              <Paper key={i} className={classes.jobCard} elevation={0}>
                <Grid container alignItems="center" justify="space-between">
                  <Grid item>
                    <Typography variant="h5" className={classes.role}>{job.title}</Typography>
                    <Box className={classes.loc}>
                      <LocationOn fontSize="small" style={{ marginRight: '4px' }} />
                      {job.location}
                    </Box>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="secondary">Apply Now</Button>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Grid>

          <Grid item xs={12} md={5}>
            <Typography variant="h4" className={classes.sectionTitle} style={{ textAlign: 'left' }}>
              Why M2K?
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Paper className={classes.benefitsCard} elevation={0}>
                  <TrendingUp className={classes.benefitIcon} />
                  <Typography variant="h6" style={{ fontWeight: 700 }}>Growth Opportunities</Typography>
                  <Typography variant="body2" color="textSecondary">
                    We believe in nurturing talent and providing clear pathways for career advancement.
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.benefitsCard} elevation={0}>
                  <AccountBalance className={classes.benefitIcon} />
                  <Typography variant="h6" style={{ fontWeight: 700 }}>Stability & Vision</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Join a stable, vision-driven organization that is a leader in the entertainment sector.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Box style={{ marginTop: '80px', textAlign: 'center' }}>
          <Typography variant="body1" color="textSecondary">
            Don't see a role for you? Send your resume to
          </Typography>
          <Typography variant="h5" style={{ color: '#b72429', fontWeight: 700 }}>
            careers@m2kcinemas.com
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default CareersPage;
