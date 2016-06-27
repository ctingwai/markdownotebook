import React, {Component} from 'react';

export default class Message extends Component {
    constructor() {
        super();
        this.state = {
            message: '',
            title: '',
            error: false
        };
    }

    clearMessage() {
        this.setState({
            message: '',
            title: '',
            error: false
        });
    }

    showMessage(title, message, isError) {
        this.setState({
            message: message,
            title: title,
            error: !!isError
        });
    }

    render() {
        let messageClass = 'ui message';
        if(this.state.error)
            messageClass += ' negative';
        let messageHtml = (
			<div className={messageClass}>
				<i className="close icon" onClick={this.clearMessage.bind(this)}></i>
				<div className="header">{this.state.title}</div>
				<p>{this.state.message}</p>
			</div>
        );
        return (
            this.state.message ? messageHtml : null
        );
    }
}
