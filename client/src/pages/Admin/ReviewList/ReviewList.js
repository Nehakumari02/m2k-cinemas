import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { setAlert } from '../../../store/actions/alert';
import { setAuthHeaders } from '../../../utils';

class ReviewList extends Component {
  state = {
    reviews: [],
    loading: true,
    deleteDialogOpen: false,
    reviewToDelete: null
  };

  componentDidMount() {
    this.fetchAllReviews();
  }

  fetchAllReviews = async () => {
    try {
      // We need a route to get ALL reviews across all movies
      // I'll update the backend to support GET /movies/reviews/all
      const response = await fetch('/movies/reviews/all', {
        headers: setAuthHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        this.setState({ reviews: data, loading: false });
      } else {
        this.props.setAlert(data.message || 'Error fetching reviews', 'error');
        this.setState({ loading: false });
      }
    } catch (e) {
      console.error(e);
      this.setState({ loading: false });
    }
  };

  handleDeleteClick = (reviewId) => {
    this.setState({ deleteDialogOpen: true, reviewToDelete: reviewId });
  };

  handleDeleteConfirm = async () => {
    const { reviewToDelete } = this.state;
    this.setState({ deleteDialogOpen: false });
    
    try {
      const response = await fetch(`/movies/reviews/${reviewToDelete}`, {
        method: 'DELETE',
        headers: setAuthHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        this.props.setAlert('Review deleted successfully', 'success');
        this.setState(prev => ({
          reviews: prev.reviews.filter(r => r._id !== reviewToDelete)
        }));
      } else {
        this.props.setAlert(data.message || 'Error deleting review', 'error');
      }
    } catch (e) {
      console.error(e);
      this.props.setAlert('Error connecting to server', 'error');
    }
  };

  handleDeleteCancel = () => {
    this.setState({ deleteDialogOpen: false, reviewToDelete: null });
  };

  render() {
    const { reviews, loading } = this.state;

    return (
      <Container maxWidth="lg" style={{ paddingTop: 40 }}>
        <Box mb={4}>
          <Typography variant="h4" style={{ fontWeight: 800, color: '#0f172a' }}>
            Review Management
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage and moderate user reviews across all movies.
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress />
          </Box>
        ) : (
          <Paper elevation={0} style={{ borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
            <Table>
              <TableHead style={{ background: '#f8fafc' }}>
                <TableRow>
                  <TableCell style={{ fontWeight: 700 }}>User</TableCell>
                  <TableCell style={{ fontWeight: 700 }}>Rating</TableCell>
                  <TableCell style={{ fontWeight: 700 }}>Comment</TableCell>
                  <TableCell style={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell style={{ fontWeight: 700 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviews.map((rev) => (
                  <TableRow key={rev._id} hover>
                    <TableCell style={{ fontWeight: 600 }}>{rev.userName}</TableCell>
                    <TableCell>{rev.rating} / 5</TableCell>
                    <TableCell style={{ maxWidth: 300 }}>{rev.comment}</TableCell>
                    <TableCell>
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => this.handleDeleteClick(rev._id)} color="secondary">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {!reviews.length && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" style={{ py: 4 }}>
                      No reviews found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        )}
        {/* Delete Confirmation Dialog */}
        <Dialog
          open={this.state.deleteDialogOpen}
          onClose={this.handleDeleteCancel}
        >
          <DialogTitle>Delete Review?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDeleteCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleDeleteConfirm} color="secondary" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}

export default connect(null, { setAlert })(ReviewList);
