import React from 'react';
import ReactDOM from 'react-dom';
import NotebookMenu from './NotebookMenu';
import Editor from './Editor';
import Message from './Message';
import $ from 'jquery';

var notebooks, notes;

/**
 * Initialize notebooks and its notes
 * */
function initNotebooks() {
    notes = [];
    notebooks = JSON.parse(localStorage.getItem('notebooks'));
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
}

/**
 * Function to create a notebook and store it in the database
 * */
function createNotebook(name) {
    notebooks.push(name);
    localStorage.setItem('notebooks', JSON.stringify(notebooks));
    let note = {name: name, notes: []};
    notes.push(note);
    localStorage.setItem(name, JSON.stringify(note));
    editor.refreshNotebooks();
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
 * Handler function to delete a note from the notebook
 * */
function deleteNote(notebook, title) {
    let res = false;
    //Search for matching note in title
    notes.forEach((el, i) => {
        if(el.name === notebook) {
            el.notes.forEach((el2, j) => {
                if(el2.title === title) {
                    notes[i].notes.splice(j, 1);
                    localStorage.setItem(notebook, JSON.stringify(notes[i]));
                    res = true;
                }
            });
        }
    });

    notebookMenu.refresh(notes);
    return res;
}

/**
 * Find duplicate note title
 *
 * @param notebook Notebook to search
 * @param title Title of the note
 * */
function isUnique(notebook, title) {
    let unique = true;
    notes.forEach((n, i) => {
        if(n.name === notebook) {
            n.notes.forEach((m, j) => {
                if(m.title === title) {
                    unique = false;
                }
            })
        }
    });
    return unique;
}

/**
 * Create a note and save it in browser
 * @param newData Data for creating the new note in the format:
 * {
 *     title: <note title>
 *     text: <note content>
 *     notebook: <notebook name for the new note>
 * }
 * */
function createNote(newData, createdDate) {
    let res = null, index;
    if(!newData.title) {
        let msg = 'Note title cannot be empty';
        message.showMessage('Error Creating Note', msg, true);
        return null;
    }
    if(!isUnique(newData.notebook, newData.title)) {
        let msg = 'The note already exist in ' + newData.notebook + ', please choose another name for your note';
        message.showMessage('Error Creating Note', msg, true);
        return null;
    }
    notes.forEach((el, i) => {
        if(el.name === newData.notebook) {
            res = {
                title: newData.title,
                text: newData.text,
                created: createdDate ? createdDate : new Date()
            };
            notes[i].notes.push(res);
            index = i;
        }
    });
    localStorage.setItem(newData.notebook, JSON.stringify(notes[index]));
    return res;
}

/**
 * Update a note by deleting the original note and creating the new note
 * */
function updateNote(original, newData) {
    let res1 = null, res2 = null;
    notes.forEach((el, i) => {
        res1 = deleteNote(original.notebook, original.title);
        res2 = createNote(newData, original.created);
    });
    return res2;
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
    return res;
}

/**
 * Handle deletion of an entire notebook
 *
 * @param notebook Notebook to delete
 * */
function deleteNotebook(notebook) {
    notebooks.splice(notebooks.indexOf(notebook), 1);
    localStorage.setItem('notebooks', JSON.stringify(notebooks));
    localStorage.removeItem(notebook);
    initNotebooks();
    return notes;
}

/**
 * Handle renaming of a notebook
 *
 * @param from Notebook to rename
 * @param to New notebook name
 * */
function renameNotebook(from, to) {
    notebooks[notebooks.indexOf(from)] = to;
    localStorage.setItem('notebooks', JSON.stringify(notebooks));

    let newNotebook = {
        name: to,
        notes: JSON.parse(localStorage.getItem(from)).notes
    }
    localStorage.removeItem(from);
    localStorage.setItem(to, JSON.stringify(newNotebook));

    initNotebooks();
    return notes;
}

initNotebooks();
var notebookMenu = ReactDOM.render(<NotebookMenu items={notes}
                                                 onNotebookCreate={createNotebook}
                                                 onNotebookEdit={renameNotebook}
                                                 onNotebookDelete={deleteNotebook}
                                                 deleteNote={deleteNote}
                                                 edit={openNote} />, document.getElementById('nav'));
var editor = ReactDOM.render(<Editor notebooks={notes}
                                     save={saveNote} />, document.getElementById('editor'));
var message = ReactDOM.render(<Message />, document.getElementById('message-display'));
