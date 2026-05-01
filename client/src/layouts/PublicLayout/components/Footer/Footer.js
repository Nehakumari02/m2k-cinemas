import React from 'react';
import { Divider, Typography, Link as MuiLink } from '@material-ui/core';
import { Link } from 'react-router-dom';
import useStyles from './styles';

export default function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Divider style={{ marginBottom: '24px' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px' }}>
        <div>
          <Typography variant="subtitle2" style={{ fontWeight: 800, color: '#b72429', marginBottom: '8px' }}>
            M2K Cinemas
          </Typography>
          <Typography variant="caption" style={{ color: '#64748b', display: 'block', lineHeight: 1.6 }}>
            <strong>M2K Corporate Park, Sector-51</strong><br />
            Gurugram, Haryana - 122003<br />
            Phone: +91 0124 4525000<br />
            Email: <a href="mailto:info@m2kcinemas.com" style={{ color: '#b72429', textDecoration: 'none' }}>info@m2kcinemas.com</a>
          </Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <Typography className={classes.copyright} variant="body2" style={{ color: '#0f172a', fontWeight: 500, margin: 0 }}>
            &copy; {new Date().getFullYear()} M2K Cinemas. All rights reserved.
          </Typography>
          <div style={{ marginTop: '8px' }}>
            <Link to="/privacy-policy" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.8rem' }}>Privacy Policy</Link>
            <span style={{ margin: '0 12px', color: '#cbd5e1' }}>|</span>
            <Link to="/terms-conditions" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.8rem' }}>Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
