import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  withStyles,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  CircularProgress,
  Tooltip,
  Switch,
  FormControlLabel
} from '@material-ui/core';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@material-ui/icons';
import { getAllReviews, updateReview, deleteReview } from '../../../store/actions';

const styles = theme => ({
  root: {
    padding: theme.spacing(4)
  },
  tableWrapper: {
    marginTop: theme.spacing(3),
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
  },
  table: {
    minWidth: 800
  },
  head: {
    backgroundColor: '#f8fafc'
  },
  headCell: {
    fontWeight: 700,
    color: '#64748b'
  },
  statusPending: { backgroundColor: '#fef3c7', color: '#92400e' },
  statusApproved: { backgroundColor: '#dcfce7', color: '#166534' },
  statusRejected: { backgroundColor: '#fee2e2', color: '#991b1b' },
  actionButton: {
    margin: theme.spacing(0.5)
  }
});

class ReviewList extends Component {
  componentDidMount() {
    this.props.getAllReviews();
  }

  handleStatusChange = (reviewId, newStatus) => {
    this.props.updateReview(reviewId, { status: newStatus });
  };

  handleToggleHighlight = (reviewId, currentHighlight) => {
    this.props.updateReview(reviewId, { isHighlighted: !currentHighlight });
  };

  handleDelete = reviewId => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      this.props.deleteReview(reviewId);
    }
  };

  getStatusClass = status => {
    const { classes } = this.props;
    switch (status) {
      case 'Approved': return classes.statusApproved;
      case 'Rejected': return classes.statusRejected;
      default: return classes.statusPending;
    }
  };

  render() {
    const { classes, reviews, movies } = this.props;

    if (!reviews) return <CircularProgress />;

    return (
      <div className={classes.root}>
        <Box mb={4}>
          <Typography variant="h3" style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Review Management
          </Typography>
          <Typography variant="body1" style={{ color: '#64748b' }}>
            Approve, reject, or highlight user reviews for movies.
          </Typography>
        </Box>

        <Paper className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead className={classes.head}>
              <TableRow>
                <TableCell className={classes.headCell}>Movie</TableCell>
                <TableCell className={classes.headCell}>User</TableCell>
                <TableCell className={classes.headCell}>Rating</TableCell>
                <TableCell className={classes.headCell} style={{ width: '30%' }}>Comment</TableCell>
                <TableCell className={classes.headCell}>Status</TableCell>
                <TableCell className={classes.headCell}>Highlighted</TableCell>
                <TableCell className={classes.headCell}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reviews.length > 0 ? (
                reviews.map(review => {
                  const movie = movies.find(m => m._id === review.movieId);
                  return (
                    <TableRow key={review._id}>
                      <TableCell style={{ fontWeight: 600 }}>
                        {movie ? movie.title : 'Unknown Movie'}
                      </TableCell>
                      <TableCell>{review.userName}</TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Typography variant="body2" style={{ fontWeight: 700, marginRight: 4 }}>
                            {review.rating}
                          </Typography>
                          <StarIcon style={{ color: '#fbbf24', fontSize: '1rem' }} />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                          "{review.comment}"
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={review.status || 'Pending'}
                          size="small"
                          className={this.getStatusClass(review.status)}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => this.handleToggleHighlight(review._id, review.isHighlighted)}
                          style={{ color: review.isHighlighted ? '#fbbf24' : '#cbd5e1' }}
                        >
                          {review.isHighlighted ? <StarIcon /> : <StarBorderIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        <Box display="flex">
                          {review.status !== 'Approved' && (
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                className={classes.actionButton}
                                style={{ color: '#166534' }}
                                onClick={() => this.handleStatusChange(review._id, 'Approved')}
                              >
                                <CheckIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          {review.status !== 'Rejected' && (
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                className={classes.actionButton}
                                style={{ color: '#991b1b' }}
                                onClick={() => this.handleStatusChange(review._id, 'Rejected')}
                              >
                                <CloseIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              className={classes.actionButton}
                              onClick={() => this.handleDelete(review._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" style={{ padding: '20px', color: '#64748b' }}>
                      No reviews found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  reviews: state.reviewState.reviews,
  movies: state.movieState.movies
});

const mapDispatchToProps = { getAllReviews, updateReview, deleteReview };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ReviewList));
