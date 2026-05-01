import {
  GET_PRODUCTS,
  GET_PRODUCTS_ADMIN,
  ADD_PRODUCT,
  UPDATE_PRODUCT,
  DELETE_PRODUCT,
  PRODUCT_ERROR
} from '../types';
import { setAlert } from './alert';

// Get all products
export const getProducts = () => async dispatch => {
  try {
    const res = await fetch('/products');
    const data = await res.json();
    dispatch({
      type: GET_PRODUCTS,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

// Get all products (admin)
export const getProductsAdmin = () => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const res = await fetch('/admin/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    dispatch({
      type: GET_PRODUCTS_ADMIN,
      payload: data
    });
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};

// Upload product image
export const uploadProductImage = (id, image) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const data = new FormData();
    data.append('file', image);
    const response = await fetch(`/products/photo/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: data
    });
    if (response.ok) {
      dispatch(setAlert('Image Uploaded', 'success', 5000));
    } else {
      dispatch(setAlert('Failed to upload image', 'error', 5000));
    }
  } catch (error) {
    dispatch(setAlert(error.message, 'error', 5000));
  }
};

// Add product (admin)
export const addProduct = (image, productData) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const res = await fetch('/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    const product = await res.json();
    if (res.ok) {
      dispatch(setAlert('Product Added', 'success'));
      if (image) await dispatch(uploadProductImage(product._id, image));
      dispatch(getProductsAdmin());
      return { status: 'success' };
    }
    return { status: 'error' };
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
    return { status: 'error' };
  }
};

// Update product (admin)
export const updateProduct = (id, image, productData) => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    const res = await fetch(`/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      dispatch(setAlert('Product Updated', 'success'));
      if (image) await dispatch(uploadProductImage(id, image));
      dispatch(getProductsAdmin());
      return { status: 'success' };
    }
    return { status: 'error' };
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
    return { status: 'error' };
  }
};

// Delete product (admin)
export const deleteProduct = id => async dispatch => {
  try {
    const token = localStorage.getItem('jwtToken');
    await fetch(`/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    dispatch({
      type: DELETE_PRODUCT,
      payload: id
    });
    dispatch(setAlert('Product Deleted', 'success'));
    dispatch(getProductsAdmin());
  } catch (err) {
    dispatch({
      type: PRODUCT_ERROR,
      payload: { msg: err.response?.statusText, status: err.response?.status }
    });
  }
};
