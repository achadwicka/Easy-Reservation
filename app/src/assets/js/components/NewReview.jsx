// para esto tengo que hacer la api de metodo post para guardar la nueva review
import React, { Component } from 'react';
import MarkDown from './MarkDown';
const marked = require("marked")
const SimpleCrypto = require("simple-crypto-js").default;

const _secretKey = "encriptado";
const encriptador = new SimpleCrypto(_secretKey);

// El new review es otra clase que se importa
class NewReview extends Component {

    constructor(props) {
        super(props);

        this.state = {
            comment: '',
        }

        // Aca van los bindings con las funciones de abajo
        this.handleUserInput = this.handleUserInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.newReview = this.newReview.bind(this);
        this.checkType = this.checkType.bind(this);
        this.changeMD = this.changeMD.bind(this);
    }

    handleUserInput (e) {

        const value = e.target.value;
        // Acá seteamos constantemente el valor por el texto escrito
        this.setState({ comment: value });
      }

    handleSubmit (event) {
        // Esto evita que se refresque la pag.
        if(this.state.comment.length > 1000){
            this.setState({ comment: '' })
            document.getElementById('newReview').value = "";
            return;
        }
        event.preventDefault();
        this.newReview();
        document.getElementById('newReview').value = "";
    }

    async newReview() {

        if (this.state.comment === "" || this.state.comment === " " || this.state.comment === "  "){
            alert('Please enter some text')
        }

        else{ 
            const userId = parseInt(encriptador.decrypt(this.props.userId))
            const restaurantId = parseInt(encriptador.decrypt(this.props.restaurantId))

            const createPath = "/apiReview/create"
            const body = { userId: userId, restaurantId: restaurantId, comment: this.state.comment, userName: this.props.userName, markDown: this.props.markDown }
            async function newReview(createPath, body) {
                //Si no pongo / antes de api el path es relativo.
                let response = await fetch(createPath, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    Accept: 'application/json',
                },
                })

            }

            try{
                newReview(createPath, body);
                const today = new Date();
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const key = this.props.count + 1;
                // console.log('Creamos la '+ key)
                if(this.props.markDown) {
                    this.props.onAddReview(
                        <div key={key} className="cardReview-item">
                            <div className="cardReview-title">
                                <div className="cardReview-name">
                                    { this.props.userName }
                                </div>
                                <div className="cardReview-date">
                                    on { monthNames[today.getMonth()] } { today.getDate() } { today.getFullYear()}:
                                </div>
                            </div>
                            <div className="cardReview-item-comment" dangerouslySetInnerHTML = {{ __html: marked(this.state.comment) }}></div>
                            <div className="delete-button-container">
                                <div className="delete-button-review" onClick = {() => this.props.onDelete(key)} >
                                    Delete Review
                                </div>
                            </div>
                        </div>
                    );
                }
                else{
                    this.props.onAddReview(
                        <div key={key} className="cardReview-item">
                            <div className="cardReview-title">
                                <div className="cardReview-name">
                                    { this.props.userName }
                                </div>
                                <div className="cardReview-date">
                                    on { monthNames[today.getMonth()] } { today.getDate() } { today.getFullYear()}:
                                </div>
                            </div>
                            <div className="cardReview-item-comment">
                                { this.state.comment }
                            </div>
                            <div className="delete-button-container">
                                <div className="delete-button-review" onClick = {() => this.props.onDelete(key)} >
                                    Delete Review
                                </div>
                            </div>
                        </div>
                    );
                }

            } catch(e){
                console.log(e)
            }
        
            this.state.comment = ''
        }
      
    }

    changeMD () {
        this.props.onchangeMD;
    }

    // Esta funcion revisa si se quiere hacer review en MD
    checkType() {
        if(!this.props.markDown){
            return (
                <div className="form-react-comment">
                    <textarea className="new-review-text" name="newReview" placeholder="Enter your Review" id="newReview" maxLength="1000" onChange={(event) => this.handleUserInput(event)}></textarea>
                    <div>
                        <button className="new-comment-button" type="submit" value="submit" onClick = {this.handleSubmit}>
                            Post Review
                        </button>
                        <button className="new-comment-button-md" type="submit" value="submit" onClick = {this.props.onchangeMD}>
                            Create a MarkDown Review
                        </button>
                    </div>
                </div>
            )
        }
        else {
            return (
                <MarkDown 
                    changeMD = { this.props.onchangeMD }
                    newRev = { this.newReview }
                    onInput = { this.handleUserInput }
                />
            )
        }
    }

    render() {
        return (
            this.checkType()
        );
    }

}

export default NewReview;