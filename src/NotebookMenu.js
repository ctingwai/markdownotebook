import React, {Component} from 'react';
import NoteList from './NoteList';

/**
 * Component to create a notebook menu
 *
 * @props props.onNotebookCreate Function called to create a new notebook
 * @props props.items Array of notes in the following format:
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
 * @props props.edit Function call to edit a note
 *
 * @props state.notebookName The name of the new notebook
 * @props state.notebooks Array of notes same format as props.items
 * @props state.errorTitle Store the title of the error message
 * @props state.errorMessage Store the error message
 * */
class NotebookMenu extends Component {
    constructor() {
        super();
        this.state = {
            notebookName: '',
            notebooks: [],
            errorTitle: '',
            errorMessage: ''
        };
    }
    componentWillMount() {
        this.setState({notebooks: this.props.items});
    }
    validateNotebook() {
        let exists = this.state.notebooks.find((item) => {
            return item.name.toLowerCase() === this.state.notebookName.toLowerCase()
        });
        if(exists) {
            this.setState({
                errorTitle: 'Notebook Exists',
                errorMessage: 'The supplied notebook name already existed, please use another name.'
            });
            return false;
        }

        if(this.state.notebookName == '') {
            this.setState({
                errorTitle: 'Invalid Name',
                errorMessage: 'Notebook name cannot be empty'
            });
            return false;
        }

        if(!/^[a-zA-Z0-9_ ]+$/g.test(this.state.notebookName)) {
            this.setState({
                errorTitle: 'Invalid Name',
                errorMessage: 'Only alphabet, numbers, underscore, and space is allowed'
            });
            return false;
        }

        return true;
    }
    createNotebook(e) {
        this.setState({
            errorTitle: '',
            errorMessage: ''
        });
        if(this.validateNotebook()) {
            if(this.props.onNotebookCreate(this.state.notebookName)) {
                let notebooks = this.state.notebooks;
                notebooks.push({name: this.state.notebookName, notes: []});
                this.setState({notebooks: notebooks, notebookName: ''});
            }
        }
    }
    handleKeyUp(e) {
        this.setState({notebookName: e.target.value});
    }
    refresh(newNotebooks) {
        this.setState({notebooks: newNotebooks});
    }
    render() {
        let errorMsg = (
            <div className="ui error message">
                <div className="header">{this.state.errorTitle}</div>
                <p>{this.state.errorMessage}</p>
            </div>
        );
        return (
            <div className='notebook-menu'>
                <div className='ui stacked header'>Notebooks</div>
                <NoteList notebooks={this.props.items} edit={this.props.edit} />
                <div className="ui horizontal divider"></div>
                {this.state.errorTitle ? errorMsg : null}
                <div className='ui action input' style={{width: '100%'}}>
                    <input type='text' placeholder='Enter notebook name'
                           onKeyUp={this.handleKeyUp.bind(this)} />
                    <a className='ui button'
                       onClick={this.createNotebook.bind(this)}>Create Notebook</a>
                </div>
            </div>
        );
    }
}

export default NotebookMenu;
