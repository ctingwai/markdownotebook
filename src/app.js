import React from 'react';
import ReactDOM from 'react-dom';
import NotebookMenu from './NotebookMenu';
import Editor from './Editor';
import $ from 'jquery';

var notebooks = JSON.parse(localStorage.getItem('notebooks'));
var notes = [];
if(notebooks == null) {
    notebooks = ['Default'];
    let defNotes = {
        name: 'Default',
        notes: [
            {
                title: 'Markdown Syntax',
                created: new Date(),
                text: '## Markdown Syntax'
            }
        ]
    };
    notes.push(defNotes);
    localStorage.setItem('notebooks', JSON.stringify(notebooks));
    localStorage.setItem('Default', JSON.stringify(defNotes));
} else {
    notebooks.forEach((notebook) => {
        notes.push(JSON.parse(localStorage.getItem(notebook)));
    });
}

/**
 *
 * */
function createNotebook(name) {
    notebooks.push(name);
    localStorage.setItem('notebooks', JSON.stringify(notebooks));
    let note = {name: name, notes: []};
    notes.push(note);
    localStorage.setItem(name, JSON.stringify(note));
}

/**
 * Return note in the notebook with the title noteTitle
 * */
function findNote(notebook, noteTitle) {
    let haystack = notes.filter(function(el) {
        return el.name === notebook;
    });
    if(haystack.length <= 0)
        return null;
    let res = haystack[0].notes.filter(function(note) {
        return note.title === noteTitle;
    });
    if(res.length <= 0)
        return null;
    return res[0];
}

/**
 * Handler for when a note link is clicked
 * */
function openNote(notebook, noteTitle) {
    let target = findNote(notebook, noteTitle);
    editor.editNote(target.title, notebook, target.text, target.created);
}

/**
 * Handle saving of a note, on edits, it will delete the original note and add
 * the edited note into the array, on create, it will just create a new note
 * data in the format:
 * {
 *     title: <new note title>,
 *     notebook: <new notebook>,
 *     text: <new note content>,
 *     edit: {
 *         title: <original title>,
 *         notebook: <original notebook>,
 *         created: <original created date>
 *     }
 * }
 * */
function saveNote(data) {
    let editNote = data.edit;

    function updateNote(original, newData) {
        let res = null;
        notes.forEach((el, i) => {
            //Delete original note
            if(el.name === original.notebook) {
                el.notes.forEach((el2, j) => {
                    if(el2.title === original.title) {
                        notes[i].notes.splice(j, 1);
                        localStorage.setItem(original.notebook, JSON.stringify(notes[i]));
                    }
                });
            }
            //Add new note
            if(el.name === newData.notebook) {
                //Add new note
                notes[i].notes.push({
                    title: newData.title,
                    text: newData.text,
                    created: original.created
                });
                res = notes[i];
                localStorage.setItem(newData.notebook, JSON.stringify(res));
            }
        });
        return res;
    }

    function createNote(newData) {
        let res = null;
        notes.forEach((el, i) => {
            if(el.name === newData.notebook) {
                notes[i].notes.push({
                    title: newData.title,
                    text: newData.text,
                    created: new Date()
                });
                res = notes[i];
            }
        });
        localStorage.setItem(newData.notebook, JSON.stringify(res));
        return res;
    }

    let res = null;
    if(editNote.title && editNote.notebook) {
        res = updateNote({
            title: editNote.title,
            notebook: editNote.notebook,
            created: editNote.created
        }, {
            title: data.title,
            notebook: data.notebook,
            text: data.text
        });
    } else {
        res = createNote({
            title: data.title,
            text: data.text,
            notebook: data.notebook
        });
    }

    notebookMenu.refresh(notes);
}

var notebookMenu = ReactDOM.render(<NotebookMenu items={notes}
                                                 onNotebookCreate={createNotebook}
                                                 edit={openNote} />, document.getElementById('nav'));
var editor = ReactDOM.render(<Editor notebooks={notes}
                                     save={saveNote} />, document.getElementById('editor'));
