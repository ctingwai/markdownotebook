import React, {Component} from 'react';

/**
 * Component to create the editor's menu
 *
 * @props props.onView Function called when the preview button is clicked
 * @props state.preview Whether it is previewing
 * */
export default class EditorMenu extends Component {
    constructor() {
        super();
        this.state = {
            preview: false
        };
    }
    view() {
        var preview = !this.state.preview;
        this.setState({preview: preview});
        this.props.onView(preview);
    }
    render() {
        return (
            <div className='editor-menu'>
                <button className='ui icon button' onClick={this.view.bind(this)}>
                    <i className={this.state.preview ? 'icon hide' : 'icon unhide'}></i>
                </button>
            </div>
        );
    }
}
