import React, {Component} from 'react';
import EditorMenu from './EditorMenu';
import EditorFooter from './EditorFooter';
import marked from 'marked';

/**
 * Component to create an editor
 * @props props.notebooks Array of notes in the following format:
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
 * @props props.save Function called when a note is saved
 *
 * @props states.preview Whether to preview the note
 * @props states.text Content of the new note
 * @props states.title Title of the new note
 * @props states.notebook Notebook name of the new noe
 * @props states.notebookOptions Notebook options used in notebook dropdown
 * @props states.edit Used to store the original data of the edited note
 * @props states.edit.notebook Original notebook
 * @props states.edit.title Original title
 * @props states.edit.created Original created date
 * */
export default class Editor extends Component {
    constructor() {
        super();
        this.state = {
            preview: false,
            text: '',
            title: '',
            notebook: '',
            edit: {
                notebook: null,
                title: null,
                created: null
            },
            notebookOptions: []
        };
    }
    onView(preview) {
        this.setState({preview: preview});
    }
    handleTextChange(e) {
        this.footer.noteModified();
        this.setState({text: e.target.value});
    }
    handleTitleChange(e) {
        this.footer.noteModified();
        this.setState({title: e.target.value});
    }
    handleSave() {
        let res = this.props.save({
            title: this.state.title,
            text: this.state.text,
            notebook: this.state.notebook,
            edit: this.state.edit
        });
        if(res && this.state.edit.notebook == null) {
            this.setState({
                title: this.state.title,
                text: this.state.text,
                notebook: this.state.notebook,
                edit: {
                    notebook: this.state.notebook,
                    title: res.title,
                    created: res.created
                }
            });
        }
        return res;
    }
    handleNewNote() {
        this.setState({
            title: '',
            text: '',
            notebook: '',
            edit: {
                notebook: null,
                title: null,
                create: null
            }
        });
    }
    editNote(title, notebook, text, created) {
        this.setState({
            title: title,
            text: text,
            notebook: notebook,
            edit: {
                notebook: notebook,
                title: title,
                created: created
            }
        });
    }
    refreshNotebooks() {
        let opts = this.props.notebooks.map((notebook) => {
            return (
                <option key={notebook.name} value={notebook.name}>{notebook.name}</option>
            );
        });
        this.setState({
            notebookOptions: opts,
            notebook: this.props.notebooks.length > 0 ? this.props.notebooks[0].name : ''
        });
    }
    componentWillMount() {
        this.refreshNotebooks();
    }
    render() {
        var textArea = (
            <div className='ui form'>
                <div className='field'>
                    <textarea className='text-editor'
                              value={this.state.text}
                              onChange={this.handleTextChange.bind(this)}
                              onKeyUp={this.handleTextChange.bind(this)} />
                </div>
            </div>
        );
        var viewer = (
            <p dangerouslySetInnerHTML={{__html: marked(this.state.text)}} />
        );
        return (
            <div className='ui piled segments editor'>
                <div className='ui segment secondary'>
                    <div className='ui grid'>
                        <div className='column twelve wide'>
                            <div className='ui labeled input large' style={{width: '100%'}}>
                                <div className='ui label'>Title</div>
                                <input type='text' placeholder='Enter title'
                                       value={this.state.title}
                                       onChange={this.handleTitleChange.bind(this)}
                                       onKeyUp={this.handleTitleChange.bind(this)} />
                                <select className="ui selection compact dropdown notebooks"
                                        onChange={ (e) => {this.setState({notebook: e.target.value})} }
                                        value={this.state.notebook}>
                                    {this.state.notebookOptions}
                                </select>
                            </div>
                        </div>
                        <div className='column four wide'>
                            <EditorMenu onView={this.onView.bind(this)} />
                        </div>
                    </div>
                </div>
                <div className='ui segment editor-container'>
                    {this.state.preview ? viewer : textArea}
                </div>
                <div className='ui segment secondary'>
                    <EditorFooter saveFn={this.handleSave.bind(this)}
                                  ref={(c) => this.footer = c}
                                  createFn={this.handleNewNote.bind(this)} />
                </div>
            </div>
        );
    }
}
