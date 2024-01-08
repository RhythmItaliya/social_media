// GlobalLoading.js

import React from 'react';
import { connect } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';
import './others.css';

const GlobalLoading = ({ loading }) => {
  return loading ? <LoadingSpinner /> : null;
};

const mapStateToProps = (state) => ({
  loading: state.login.loading || state.register.loading,
});

export default connect(mapStateToProps)(GlobalLoading);
