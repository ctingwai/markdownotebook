import React, {Component} from 'react';

/**
 * Component to create semantic ui accordion content
 * @props props.id The id attribute for this component container
 * @props props.content The content for the accordion
 * */
export default class AccordionContent extends Component {
    render() {
        return (
            <div className='content' id={this.props.id}>
                <div className='transition hidden'>
                    {this.props.content}
                </div>
            </div>
        );
    }
}
