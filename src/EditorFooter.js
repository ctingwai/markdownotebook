import React, {Component} from 'react';

/**
 * Component for editor's footer
 * @props props.createFn Function called when the create button is clicked
 * @props props.saveFn Function called when the save button is clicked
 * */
export default class EditorFooter extends Component {
    constructor() {
        super();
        this.state = {
            noteState: 'modified'
        };
    }

    handleSave() {
        this.setState({noteState: 'saving'});
        if(this.props.saveFn()) {
            this.setState({noteState: 'saved'});
        } else {
            this.setState({noteState: 'error'});
        }
    }

    handleCreate() {
        this.setState({noteState: 'modified'});
        this.props.createFn();
    }

    noteModified() {
        this.setState({noteState: 'modified'});
    }

    render() {
        let saveIcon = 'icon save', saveText = 'Save';
        if(this.state.noteState == 'saving') {
            saveIcon = 'icon loading';
            saveText = 'Saving';
        } else if(this.state.noteState == 'saved') {
            saveIcon = 'icon checkmark';
            saveText = 'Saved';
        } else if(this.state.noteState == 'error') {
            saveIcon = 'icon warning sign';
            saveText = 'Error';
        }

        return (
            <div className='editor-footer'>
                <button className='ui button labeled icon' onClick={this.handleCreate.bind(this)}>
                    <i className='icon add square'></i> New Note
                </button>
                <button className='ui button labeled icon' onClick={this.handleSave.bind(this)}>
                    <i className={saveIcon}></i>{saveText}
                </button>
            </div>
        );
    }
}
