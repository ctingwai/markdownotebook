import React, {Component} from 'react';

var moment = require('moment');

/**
 * Component to create anchor link to note
 *
 * @props props.openedNotebook Function called when the note is clicked
 * @props props.title Title of the note
 * @props props.created Date the note is create
 * */
export default class NoteLink extends Component {
    handleClick(e) {
        this.props.edit(this.props.openedNotebook(), e.target.innerHTML);
    }
    render() {
        return (
            <div className='item'>
                <i className="large file middle aligned icon"></i>
                <div className='content'>
                    <a className='header' onClick={this.handleClick.bind(this)}>{this.props.title}</a>
                    <div className='description'>
                        Created {moment(this.props.created).fromNow()}
                    </div>
                </div>
            </div>
        );
    }
}
