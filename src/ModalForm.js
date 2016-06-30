import React, {Component} from 'react';

/**
 * Component to show and render forms in modal window
 *
 * @props props.header Header for the modal form
 * @props props.inputs Array of JSX inputs
 * @props props.submit Callback when form is submitted
 * @props props.show Whether to show the modal form
 * @props
 * @props
 * @props
 * */
export default class ModalForm extends Component {
    constructor() {
        super();
    }

    handleSubmit() {
        this.props.submit();
    }

	componentDidUpdate() {
        $('#modal-form').modal({
            detachable: false,
            onHidden: () => {
                this.props.hidden();
            }
        });
        if(this.props.show) {
            $('#modal-form.modal').modal('show');
        }
    }

    render() {
        return (
            <div className='ui modal' id='modal-form'>
                <div className='header'>{this.props.header}</div>
                <div className='content'>{this.props.inputs}</div>
                <div className='actions'>
                    <button className='ui cancel red button'>Cancel</button>
                    <button className='ui approve green button' onClick={this.handleSubmit.bind(this)}>Submit</button>
                </div>
            </div>
        );
    }
}
