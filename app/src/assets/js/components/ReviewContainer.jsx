import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Review from './Review';
import NewReview from './NewReview';
const marked = require("marked")
const SimpleCrypto = require("simple-crypto-js").default;

const _secretKey = "encriptado";
const encriptador = new SimpleCrypto(_secretKey);



// esto es como ejemplo por ahora, despues sera una api
import { reviews } from '../reviews.json';
import { runInThisContext } from 'vm';

class ReviewsContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            text: this.props.serverData.text,
            restaurantId: this.props.serverData.encryptedrestaurant,
            userId: this.props.serverData.encrypteduser,
            userName: this.props.serverData.name,
            count: parseInt(this.props.serverData.count),
            markDown: false
        }
    
        // Aca van los bindings con las funciones de abajo
        this.handleCurrentUser = this.handleCurrentUser.bind(this);
        this.loadReviews = this.loadReviews.bind(this);
        this.reviewsRequest = this.reviewsRequest.bind(this);
        this.handleAddReview = this.handleAddReview.bind(this);
        this.handleUserDelete = this.handleUserDelete.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.changeMD = this.changeMD.bind(this); 
        this.handleMD = this.handleMD.bind(this);        
    }

    componentDidMount(){
        this.loadReviews();
      }
    
    async handleAddReview(review) {
        this.setState({
            Review: [...this.state.Review, review],
            count: this.state.count + 1
        })
    }

    async handleDelete(revId) {

        const body = {id: revId};
        // console.log('Borramos la ' + revId)
        const Path = `/apiReview/delete/${revId}`
        async function deleteComment(Path, body) {
            let response = await fetch(Path, {
              method: 'DELETE',
              body: JSON.stringify(body),
              headers: {
                Accept: 'application/json',
              },
            });
            
          }
        await deleteComment(Path, body);
        this.loadReviews()
        this.setState({ 
            Review: this.state.Review.filter((e, i) => {
                return i != revId
            }),
        })
    }
  
    // Request a API para obtener todas las reviews
    async reviewsRequest(loadPath) {
        let response = await fetch(loadPath, {
            method: 'GET',
            headers: {
            Accept: 'application/json',
            },
        });
        response = await response.json();
        response = response.data;
        return response;
    }

    handleMD (post) {
        if (post.md){
            return (
                <div className="cardReview-item-comment" dangerouslySetInnerHTML = { { __html: marked(post.comment) } }>

                </div>
            )
        }
        return (
            <div className="cardReview-item-comment">
                { post.comment }
            </div>
        )
    }
  
    async loadReviews() {
    try {
        const loadPath = `/apiReview/${encriptador.decrypt(this.state.restaurantId)}`;
        const posts = await this.reviewsRequest(loadPath);
        // Aca se agregan todas las reviews al state
        this.setState({
        Review: posts.map((post, i) => (
            <div key={i} className="cardReview-item">
                <div className="cardReview-title">
                    <div className="cardReview-name">
                        { post.attributes['user-name'] }
                    </div>
                    <div className="cardReview-date">
                        on { post.attributes['created-at'].slice(4, 16) }:
                    </div>
                </div>
                < this.handleMD 
                    md = { post.attributes['mark-down'] }
                    comment = { post.attributes['comment'] } />

                { this.handleUserDelete(post.attributes['user-id'], post.attributes['id']) }
            </div>
        ))
        });

    } catch (err) {
        console.log(err);
    }
    }

    changeMD() {
        this.setState({ markDown: !this.state.markDown });
    }

    // Esta función revisa si hay usuario para ver si puede crear nuevo comentario
    handleCurrentUser() {
        if (this.state.userId) {
            return <NewReview
                onchangeMD = { this.changeMD }
                markDown = { this.state.markDown }
                userName = { this.state.userName }
                update = { this.loadReviews }
                onAddReview = { this.handleAddReview }
                userId = { this.state.userId }
                restaurantId = { this.state.restaurantId }
                onDelete = { this.handleDelete }
                count = { this.state.count }/>
            }
        else {
            return null;
            }
    }
    
    handleUserDelete(id, reviewId) {
        
        if (parseInt(encriptador.decrypt(this.state.userId)) === id) {
            return (
                <div className="delete-button-container">
                    <div className="delete-button-review" onClick = { () => this.handleDelete(reviewId) }>
                        Delete Review
                    </div>
                </div>)
            }
        else {
            return null;
            }
    }
      

    render() {

        return (
            <div className="reviews-box">
                <div className="review-container">
                    <Review 
                        reviewList = { this.state.Review }
                    />
                </div>

                <div className="review-box-new">
                    <this.handleCurrentUser  />                        
                </div>
            </div>
        );
    }

}

export default ReviewsContainer;