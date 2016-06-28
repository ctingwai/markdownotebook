import React, {Component} from 'react';

var moment = require('moment');

/**
 * Component to create anchor link to note
 *
 * @props props.notebook The notebook for the note
 * @props props.title Title of the note
 * @props props.created Date the note is create
 * @props props.edit Function called when link is clicked
 * @props props.deleteNote Function called when delete is called
 * */
export default class NoteLink extends Component {
    handleClick(e) {
        this.props.edit(e.target.getAttribute('data-notebook'), e.target.getAttribute('data-title'));
    }
    handleDelete(e) {
        let title = e.target.getAttribute('data-title');
        if(!title)
            title = e.target.parentNode.getAttribute('data-title');
        let notebook = e.target.getAttribute('data-notebook');
        if(!notebook)
            notebook = e.target.parentNode.getAttribute('data-notebook');
        this.props.deleteNote(notebook, title);
    }
    render() {
        return (
            <div className='item'>
                <div className='right floated content delete-note'>
                    <button className="circular ui icon button"
                            data-title={this.props.title}
                            data-notebook={this.props.notebook}
                            onClick={this.handleDelete.bind(this)}>
                        <i className="icon remove"></i>
                    </button>
                </div>
                <i className="large file middle aligned icon"></i>
                <div className='content'>
                    <a className='header' onClick={this.handleClick.bind(this)}
                            data-title={this.props.title}
                            data-notebook={this.props.notebook}>{this.props.title}</a>
                    <div className='description'>
                        Created {moment(this.props.created).fromNow()}
                    </div>
                </div>
            </div>
        );
    }
}
