import React, {Component} from 'react';
import NoteList from './NoteList';
import ConfirmationModal from './ConfirmationModal';
import ModalForm from './ModalForm';

/**
 * Component to create a notebook menu
 *
 * @props props.onNotebookCreate Function called to create a new notebook
 * @props props.onNotebookEdit Function called to edit a notebook
 *                           arg1: current notebook name,
 *                           arg2: new notebook name
 * @props props.onNotebookDelete Function called to delete an entire notebook,
 *                             arg1: notebook
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
 *
 * @props state.notebookName The name of the new notebook
 * @props state.notebooks Array of notes same format as props.items
 * @props state.errorTitle Store the title of the error message
 * @props state.errorMessage Store the error message
 * @props state.createNotebook Store the current state of notebook creation
 *
 * @function refresh Method called to refresh the notebooks when it is edited
 * */
export default class NotebookMenu extends Component {
    constructor() {
        super();
        this.state = {
            createNotebook: '',
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
                show: false,
                header: null,
                inputs: []
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
            errorMessage: '',
            createNotebook: 'creating'
        });
        if(this.validateNotebook()) {
            if(this.props.onNotebookCreate(this.state.notebookName)) {
                let notebooks = this.state.notebooks;
                notebooks.push({name: this.state.notebookName, notes: []});
                this.setState({notebooks: notebooks, notebookName: '', createNotebook: 'created'});
            }
        }
    }

    handleKeyUp(e) {
        if(this.state.createNotebook == 'created') {
            this.setState({createNotebook: ''});
        }
        this.setState({notebookName: e.target.value});
    }

    refresh(newNotebooks) {
        this.setState({notebooks: newNotebooks});
    }

    handleNotebookDelete() {
        let notebook = this.state.confirmation.id;
        this.setState({notebooks: this.props.onNotebookDelete(notebook)});
        this.clearConfirmation();
    }

    handleNotebookEdit() {
        let original = this.state.edit.original,
            newName = this.state.edit.newName;
        this.setState({notebooks: this.props.onNotebookEdit(original, newName)});
        this.clearEditForm();
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
        console.log(e.target.value);
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
                            <input type='text' defaultValue={notebook} onChange={this.updateNotebookFormState.bind(this)} />
                        </div>
                    </div>
                ]
            }
        });
    }

    clearEditForm() {
        this.setState({
            edit: {
                original: null,
                newName: null,
                show: false,
                header: null,
                inputs: []
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
        let createNbBtn = 'ui labeled icon button primary';
        let createNbIcon = 'icon book';
        let createNbText = 'Create Notebook';
        if(this.state.createNotebook == 'creating') {
            createNbBtn = 'ui labeled icon button secondary loading';
        } else if(this.state.createNotebook == 'created') {
            createNbBtn = 'ui labeled icon button secondary positive labeled icon';
            createNbIcon = 'icon checkmark';
            createNbText = 'Notebook Created';
        }
        return (
            <div className='notebook-menu'>
                <div className='ui stacked header'>Notebooks</div>
                <NoteList notebooks={this.state.notebooks} edit={this.props.edit}
                          deleteNotebook={this.confirmNotebookDelete.bind(this)}
                          editNotebook={this.showEditNotebookForm.bind(this)}
                          deleteNote={this.props.deleteNote} />
                <div className="ui horizontal divider"></div>
                {this.state.errorTitle ? errorMsg : null}
                <div className='ui action input' style={{width: '100%'}}>
                    <input type='text' placeholder='Enter notebook name'
                           value={this.state.notebookName}
                           onKeyUp={this.handleKeyUp.bind(this)}
                           onChange={this.handleKeyUp.bind(this)} />
                    <a className={createNbBtn}
                       onClick={this.createNotebook.bind(this)}>
                       <i className={createNbIcon} /> CreateNbText</a>
                </div>
                <ConfirmationModal header={this.state.confirmation.header}
                                   show={this.state.confirmation.show}
                                   hidden={this.clearConfirmation.bind(this)}
                                   icon={this.state.confirmation.icon}
                                   description={this.state.confirmation.description}
                                   onConfirm={this.state.confirmation.onConfirm}
                                   onCancel={this.state.confirmation.onCancel} />
                <ModalForm header={this.state.edit.header}
                           show={this.state.edit.show}
                           hidden={this.clearEditForm.bind(this)}
                           inputs={this.state.edit.inputs}
                           submit={this.handleNotebookEdit.bind(this)} />
            </div>
        );
    }
}
