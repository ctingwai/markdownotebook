import React, {Component} from 'react';

/**
 * Component for editor's footer
 * @props props.createFn Function called when the create button is clicked
 * @props props.saveFn Function called when the save button is clicked
 * */
export default class EditorFooter extends Component {
    render() {
        return (
            <div className='editor-footer'>
                <button className='ui button labeled icon' onClick={this.props.createFn}>
                    <i className='icon add square'></i> New Note
                </button>
                <button className='ui button labeled icon' onClick={this.props.saveFn}>
                    <i className='icon save'></i>Save
                </button>
            </div>
        );
    }
}
