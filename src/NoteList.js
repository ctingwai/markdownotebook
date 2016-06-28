import React, {Component} from 'react';
import NoteLink from './NoteLink';
import AccordionTitle from './AccordionTitle';
import AccordionContent from './AccordionContent';

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
            opened: ''
        };
    }
    componentDidMount() {
        $('.ui.accordion.notebooks-accordion').accordion({
            onOpen: () => {
                this.setState({opened: $('.notebooks-accordion .title.active').attr('id')});
            }
        });
    }
    getOpenedNotebook() {
        return this.state.opened;
    }
    render() {
        var notes;
        var notebooks = [];
        this.props.notebooks.forEach((item) => {
            if(item.notes) {
                notes = item.notes.map((note) => {
                    return (
                        <div className='ui list animated divided' key={note.title}>
                            <NoteLink title={note.title}
                                      edit={this.props.edit}
                                      created={note.created}
                                      deleteNote={this.props.deleteNote}
                                      openedNotebook={this.getOpenedNotebook.bind(this)} />
                        </div>
                    );
                });
                notebooks.push((<AccordionTitle key={item.name + '-title'} title={item.name} id={item.name} />));
                notebooks.push((<AccordionContent key={item.name + '-content'} content={notes} id={item.name} />));
            }
        });
        return (
            <div className='ui styled fluid accordion notebooks-accordion'>
                {notebooks}
            </div>
        );
    }
}
