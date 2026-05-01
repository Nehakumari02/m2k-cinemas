import React from 'react';
import { Container, Typography, Box } from '@material-ui/core';

export default function PrivacyPolicyPage() {
  return (
    <Container maxWidth="md">
      <Box py={8}>
        <Typography variant="h3" gutterBottom style={{ fontWeight: 800, color: '#111827' }}>
          Privacy Policy
        </Typography>
        <Typography variant="body1" paragraph>
          Thank you for visiting www.m2kcinemas.com. We value the relationship we have with our guests, members and clients, and we are committed to responsible information handling practices.
        </Typography>
        <Typography variant="body1" paragraph>
          This privacy policy only applies to information collected from you by www.m2kcinemas.com. , its subsidiaries and affiliates (collectively, “M2K”, “we” “us” “our” and “ourselves”) on websites where this privacy policy is posted. This privacy policy does not apply to any information collected by us through any other means.
        </Typography>
        <Typography variant="body1" paragraph>
          Although M2K makes available a number of websites with unique services and offerings, each m2k website shares similar privacy philosophies and principles, including the following.
        </Typography>
        <ul>
          <li>Providing you with notice of our information practices</li>
          <li>Giving you choices about how we will use your data</li>
          <li>Providing you the opportunity to update or correct your personally identifiable information</li>
          <li>Using information security safeguards</li>
          <li>Limiting the sharing of your information with other parties</li>
          <li>Committing to complying with applicable privacy requirements</li>
          <li>Providing you with means to contact us about privacy-related issues</li>
        </ul>
        <Typography variant="body1" paragraph>
          The following privacy policy describes how we collect, use and protect information collected from you at www.m2kcinemas.com. To assist you with reading our privacy policy, we have provided answers to questions you may find most important.
        </Typography>
        <Typography variant="body1" paragraph>
          You may share Personal Information that you voluntarily provide us during your visit to our website.
          M2K automatically collects information from you when you visit M2K’s website, such as the search engine you used to access the M2K website, the previous websites you visited, the websites or advertisements you view or select, the type of Internet browser you use, the computer operating system you use, and your computer's IP address. M2K may also collect information concerning your project/product preferences, such as the Project for which you booked the property. M2K also collects information that you may disclose on M2K website such as ratings or review pages, blogs, and message boards.
        </Typography>
        <Typography variant="body1" paragraph>
          We may also retain third parties to place and manage advertisements on our websites. These third party advertisers may use cookies and other technology to collect information about your visits to our websites and other websites in order to provide advertisements about goods and services that may be of interest to you. This information is not personally associated with you, and M2K may share it with third parties from time to time.
        </Typography>
        <Typography variant="body1" paragraph>
          Personally identifiable information is information that identifies you, such as your name, postal address, telephone number, e-mail address, payment method and other information once it is associated with your personally identifiable information. We may also collect publicly available information about you from other sources, such as information from newspapers, blogs, and commercial websites or third party data aggregators and supplement your personally identifiable information maintained by us. M2K also collects personally identifiable information that you may disclose on the M2K website such as ratings or review pages, blogs, and message boards.
        </Typography>
        <Typography variant="body1" paragraph>
          M2K uses personally identifiable information for the purpose for which you provided it, such as to fulfill your request for products, services or information.M2K also uses personally identifiable information to notify you of changes to M2K’s websites, to provide you with entertainment news, e-mail offers, and project detail to let you know about the products and services that may be of interest to you.
        </Typography>
        <Typography variant="body1" paragraph>
          M2K also combines anonymous usage information collected from your visit to an M2K website with that of other users to determine which features and areas of the website are most popular. By collecting and analyzing this data, M2K can improve the websites. This aggregated information does not contain information personally associated with you.
        </Typography>
        <Typography variant="body1" paragraph>
          M2K may also update and supplement personally identifiable information collected from you with other information that we obtain from third parties or from our subsidiaries and affiliates. If we associate information obtained from our affiliates and subsidiaries or third parties with personally identifiable information collected under this policy we will treat the acquired information like information we have collected ourselves.
        </Typography>
      </Box>
    </Container>
  );
}
