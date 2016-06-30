import React, {Component} from 'react';

/**
 * Component to display a yes/no message
 *
 * @props props.modalId Message header
 * @props props.header Message header
 * @props props.icon Semantic ui icon
 * @props props.description Description of the confirmation
 * @props props.onConfirm Callback when user clicks 'Yes'
 * @props props.onCancel Callback when user clicks 'No'
 * */
export default class ConfirmationModal extends Component {
    constructor() {
        super();
        this.state = {
            show: false
        };
    }

    handleYes(e) {
        this.props.onConfirm();
    }

    handleNo(e) {
        this.props.onCancel();
    }

	componentDidUpdate() {
        $('#confirmation-modal').modal({
            onHidden: () => {
                this.props.hidden();
            },
            detachable: false
        });
        if(this.props.show) {
            $('#confirmation-modal').modal('show');
        }
    }

    render() {
        return (
            <div className='ui basic modal' id='confirmation-modal' ref='confirmation_modal'>
                <i className='close icon'></i>
                <div className='header'>{this.props.header}</div>
                <div className='image content'>
                    <div className='image'>
                        <i className={this.props.icon} />
                    </div>
                    <div className='description'>
                        <p>{this.props.description}</p>
                    </div>
                </div>
                <div className='actions'>
                    <div className='two fluid ui inverted buttons'>
                        <div className='ui cancel red basic inverted button'>
                            <i className='remove icon' onClick={this.handleNo.bind(this)} /> No
                        </div>
                        <div className='ui ok green basic inverted button' onClick={this.handleYes.bind(this)}>
                            <i className='checkmark icon' /> Yes
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
