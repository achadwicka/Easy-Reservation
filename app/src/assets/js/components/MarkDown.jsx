import React, { Component } from 'react';
import PropTypes from 'prop-types';
const marked = require("marked")

class MarkDown extends Component {

    constructor(props) {
        super(props);

        this.state = {
            markdown: '',
        }

        this.updateMarkdown = this.updateMarkdown.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    updateMarkdown (event) {
        this.setState({ markdown: event.target.value });
        this.props.onInput(event)
    }    


    handleSubmit (event) {
        if(this.state.markdown.length > 1000){
            this.setState({ markdown: '' })
            document.getElementById('newReview').value = "";
            document.getElementById('markDownOutput').value = "";
            return;
        }
        // Esto evita que se refresque la pag.
        event.preventDefault();
        this.setState({ markdown: '' })
        this.props.newRev();
    }

    render() {

        return (
            <div className="form-react-comment">
                <div className="mdEditorBox">
                    <div className="mdInput">
                        <textarea className="new-review-text-md" placeholder="Enter Markdown" value={this.state.markdown} id="newReview" maxLength="1000" onChange = { (e) => this.updateMarkdown(e) }></textarea>
                    </div>
                    <div className="mdOutput">
                        <div><h2>Markdown Preview</h2></div>
                        <div id="markDownOutput" dangerouslySetInnerHTML = { { __html: marked(this.state.markdown) } }>

                        </div>
                    </div>
                    <div>
                        <button className="new-comment-button" type="submit" value="submit" onClick = { this.handleSubmit }>
                            Post Review
                        </button>
                        <button className="new-comment-button-md" type="submit" value="submit" onClick = {this.props.changeMD}>
                            Back to Normal Review
                        </button>
                    </div>

                </div>
            </div>
        );
    }

}

export default MarkDown;