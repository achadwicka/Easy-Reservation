import React, { Component } from 'react';

// El new review es otra clase que se importa
class Review extends Component {

    constructor(props) {
        super(props);


    }

    
    
    // Hace render dos veces, una con lista vacia y despues con la completa
    render() {

      return (
        <div>      
          { this.props.reviewList } 
        </div>
      );
    }

}

export default Review;