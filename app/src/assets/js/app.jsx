import React from 'react';
import ReactDOM from 'react-dom';
import ReviewsContainer from './components/ReviewContainer';


const reactReviews = document.getElementById('react-reviews');

if (reactReviews) {
  ReactDOM.render(<ReviewsContainer serverData={reactReviews.dataset} />, reactReviews);
}