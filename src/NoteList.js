import React, {Component} from 'react';
import NoteLink from './NoteLink';

/**
 * Component to create a list of notes
 *
 * @props props.notebooks Array of notes in the format:
 * [
 *     {
 *         name: <name of the notebook>,
 *         notes: [
 *             {
 *                 title: <title of the note>,
 *                 created: <create date of the note>,
 *                 text: <note's contents>
 *             }
 *         ]
 *     }
 * ]
 * @props props.edit Function called when a note is clicked
 * @props props.deleteNote Function called to delete a note
 *
 * @props state.opened Store the opened notebook
 * */
export default class NoteList extends Component {
    constructor() {
        super();
        this.state = {
            opened: '',
            hovered: ''
        };
    }
    handleClick(e) {
        let notebook = e.target.getAttribute('data-notebook');
        if(!notebook)
            notebook = e.target.parentNode.getAttribute('data-notebook');
        this.setState({opened: notebook == this.state.opened ? '' : notebook});
    }
    showAdditionalControls(e) {
        let notebook = e.target.getAttribute('data-notebook');
        if(!notebook)
            notebook = e.target.parentNode.getAttribute('data-notebook');
        this.setState({hovered: notebook});
    }
    hideAdditionalControls(e) {
        this.setState({hovered: ''});
    }
    editNotebook(e) {
        //TODO edit notebook
    }
    deleteNotebook(e) {
        //TODO delete notebook
    }
    render() {
        var notes;
        var notebooks = [];
        this.props.notebooks.forEach((item) => {
            if(item.notes) {
                notes = item.notes.map((note) => {
                    return (
                        <NoteLink title={note.title}
                                  key={note.title}
                                  edit={this.props.edit}
                                  created={note.created}
                                  deleteNote={this.props.deleteNote}
                                  notebook={item.name} />
                    );
                });
                let buttonRm = (
                    <button className='ui negative icon basic button right floated edit-notebook-btn'
                            onClick={this.deleteNotebook.bind(this)}>
                        <i className='icon remove' />
                    </button>
                );
                let buttonEdit = (
                    <button className='ui teal icon basic button right floated edit-notebook-btn'
                            onClick={this.editNotebook.bind(this)}>
                        <i className='icon write' />
                    </button>
                );
                notebooks.push(
                    <h3 className='ui attached header notelist-header' key={item.name}
                            data-notebook={item.name}
                            onMouseLeave={this.hideAdditionalControls.bind(this)}
                            onMouseEnter={this.showAdditionalControls.bind(this)}>
                        <span data-notebook={item.name} onClick={this.handleClick.bind(this)}>
                            <i className={(item.name == this.state.opened) ? 'icon caret down' : 'icon caret right'} />
                            {item.name}
                        </span>
                        {this.state.hovered == item.name ? buttonRm : null}
                        {this.state.hovered == item.name ? buttonEdit : null}
                    </h3>
                );
                let notelist = (
                    <div className={'ui attached segment notelist-notes'} key={item.name + '-notes'}>
                        <div className='ui list animated divided'>
                            {notes}
                        </div>
                    </div>
                );
                if(this.state.opened == item.name) {
                    notebooks.push(notelist);
                }
            }
        });
        return (
            <div className='ui segments notebooks-accordion'>
                {notebooks}
            </div>
        );
    }
}
