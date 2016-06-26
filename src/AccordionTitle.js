import React, {Component} from 'react';

/**
 * Component to create accordion title
 * @props props.id The id attribute for this component's container
 * @props props.title The title for this accordion
 * */
export default class AccordionTitle extends Component {
    render() {
        return (
            <div className='title' id={this.props.id}>
                <i className="dropdown icon"></i>
                {this.props.title}
            </div>
        );
    }
}
