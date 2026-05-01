import React from 'react';
import { Container, Typography, Box } from '@material-ui/core';

export default function TermsConditionsPage() {
  return (
    <Container maxWidth="md">
      <Box py={8}>
        <Typography variant="h3" gutterBottom style={{ fontWeight: 800, color: '#111827' }}>
          Terms & Conditions
        </Typography>
        <Typography variant="body1" paragraph>
          The Company is dedicated to the ‘Corporate Mission’ of creating higher level of customer satisfaction and enthusiasm to enrich people’s lives. This philosophy is driven by ‘Management Principles’ that aspire for surpassing customer expectations, establishing a social environment that fosters self esteem and fulfillment of responsibilities.
        </Typography>
        <Typography variant="body1" paragraph>
          Corporate Social Responsibility has a significant place on the Company`s agenda by as we strive to contribute towards worthwhile causes. M2K is committed to play a key role in discharging its social obligations by adhering to specified norms of legal, environmental and ethical practices and adopting Quality Control norms and checks of highest standards.
        </Typography>
        <Typography variant="body1" paragraph>
          All measures are taken up for environmental protection, upgradation and conservation of natural resources, water harvesting, tree plantation etc, including safety measures for the workforce during the construction phase.
        </Typography>
        <Typography variant="body1" paragraph>
          100% sewage recycling and rain water harvesting is carried out at all projects. Ground water is preserved for its prudent use and control system is adopted for over-drawal of ground water in critical areas.
        </Typography>
        <Typography variant="body1" paragraph>
          In order to maintain ecological balance and also to avoid ill-effects on environment, the company adapts several methods like extensive landcape work, installation of STP, silent DG sets with canopy, solar lighting and heating systems.
        </Typography>
      </Box>
    </Container>
  );
}
