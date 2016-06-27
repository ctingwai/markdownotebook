import React, {Component} from 'react';

var moment = require('moment');

/**
 * Component to create anchor link to note
 *
 * @props props.openedNotebook Function called when the note is clicked
 * @props props.title Title of the note
 * @props props.created Date the note is create
 * @props props.edit Function called when link is clicked
 * @props props.deleteNote Function called when delete is called
 * */
export default class NoteLink extends Component {
    handleClick(e) {
        this.props.edit(this.props.openedNotebook(), e.target.innerHTML);
    }
    handleDelete(e) {
        let title = e.target.getAttribute('data-title');
        if(!title)
            title = e.target.parentNode.getAttribute('data-title');
        this.props.deleteNote(this.props.openedNotebook(), title);
    }
    render() {
        return (
            <div className='item'>
                <div className='right floated content delete-note'>
                    <button className="circular ui icon button"
                            data-title={this.props.title}
                            onClick={this.handleDelete.bind(this)}>
                        <i className="icon remove"></i>
                    </button>
                </div>
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
