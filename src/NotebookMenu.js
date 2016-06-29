import React, {Component} from 'react';
import NoteList from './NoteList';
import ConfirmationModal from './ConfirmationModal';
import ModalForm from './ModalForm';

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
 * @props props.deleteNote Function called to delete a note
 * @props props.deleteNotebook Function called to delete an entire notebook
 * @props props.editNotebook Function called to edit a notebook
 *
 * @props state.notebookName The name of the new notebook
 * @props state.notebooks Array of notes same format as props.items
 * @props state.errorTitle Store the title of the error message
 * @props state.errorMessage Store the error message
 *
 * @function refresh Method called to refresh the notebooks when it is edited
 * */
export default class NotebookMenu extends Component {
    constructor() {
        super();
        this.state = {
            notebookName: '',
            notebooks: [],
            errorTitle: '',
            errorMessage: '',
            confirmation: {
                show: false,
                header: '',
                icon: '',
                description: '',
                onConfirm: null,
                onCancel: null
            },
            edit: {
                original: null,
                newName: null,
                show: false
            }
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

    handleNotebookDelete() {
        //TODO Add delete function
    }

    handleNotebookEdit() {
        //TODO add edit function
        console.log('Original: ' + this.state.edit.original + ', New: ' + this.state.edit.newName);
    }

    clearConfirmation() {
        this.setState({
            confirmation: {
                id: null,
                show: false,
                header: '',
                icon: '',
                description: '',
                onConfirm: null,
                onCancel: null
            }
        });
    }

    confirmNotebookDelete(notebook) {
        let desc = 'All notes contained within the notebook, ' + notebook + ', will be removed. ' +
                   'Are your sure you want to delete this notebook?';
        this.setState({
            confirmation: {
                id: notebook,
                header: 'Are you sure you want to remove ' + notebook + '?',
                show: true,
                icon: 'icon warning sign',
                description: desc,
                onConfirm: this.handleNotebookDelete.bind(this),
                onCancel: this.clearConfirmation.bind(this)
            }
        });
    }

    updateNotebookFormState(e) {
        this.setState({
            edit: {
                show: this.state.edit.show,
                header: this.state.edit.header,
                original: this.state.edit.original,
                newName: e.target.value,
                inputs: this.state.edit.inputs
            }
        });
    }

    showEditNotebookForm(notebook) {
        this.setState({
            edit: {
                show: true,
                header: 'Edit Notebook',
                original: notebook,
                newName: notebook,
                inputs: [
                    <div className='ui form' key='modal-form-input'>
                        <div className='field'>
                            <label>New Notebook Name</label>
                            <input type='text' value={notebook} onChange={this.updateNotebookFormState.bind(this)} />
                        </div>
                    </div>
                ]
            }
        });
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
                <NoteList notebooks={this.props.items} edit={this.props.edit}
                          deleteNotebook={this.confirmNotebookDelete.bind(this)}
                          editNotebook={this.showEditNotebookForm.bind(this)}
                          deleteNote={this.props.deleteNote} />
                <div className="ui horizontal divider"></div>
                {this.state.errorTitle ? errorMsg : null}
                <div className='ui action input' style={{width: '100%'}}>
                    <input type='text' placeholder='Enter notebook name'
                           onKeyUp={this.handleKeyUp.bind(this)} />
                    <a className='ui button'
                       onClick={this.createNotebook.bind(this)}>Create Notebook</a>
                </div>
                <ConfirmationModal header={this.state.confirmation.header}
                                   show={this.state.confirmation.show}
                                   icon={this.state.confirmation.icon}
                                   description={this.state.confirmation.description}
                                   onConfirm={this.state.confirmation.onConfirm}
                                   onCancel={this.state.confirmation.onCancel} />
                <ModalForm header={this.state.edit.header}
                           show={this.state.edit.show}
                           inputs={this.state.edit.inputs}
                           submit={this.handleNotebookEdit.bind(this)} />
            </div>
        );
    }
}
