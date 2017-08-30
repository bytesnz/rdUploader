import * as React from 'react';
import * as ReactDOM from 'react-dom';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export class Date extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fallback: false,
      value: props.value
    };

    this.handleFallbackChange = this.handleFallbackChange.bind(this);
  }

  handleFallbackChange(date) {
    this.setState({
      value: date
    });

    // Create fake event
    if (this.props.onChange) {
      this.props.onChange({
        target: {
          type: 'date',
          name: this.props.name,
          validity: {
            valid: date.isValid()
          }
        }
      });
    }

    console.log('caught event', date, ReactDOM.findDOMNode(this));
  }

  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this);

    console.log('domNode is', domNode);
    if (domNode.type !== 'date') {
      this.setState({
        fallback: true
      });
    }
  }

  render() {
    if (this.state.fallback) {
      return (
        <DatePicker
            name={this.props.name}
            dateFormat="YYYY-MM-DD"
            selected={this.state.value}
            onChange={this.handleFallbackChange}
            required={this.props.required} />
      );
    } else {
      return (
        <input
            type="date"
            name={this.props.name}
            value={this.state.value && this.state.value.format('YYYY-MM-DD')
            onChange={this.handleFallbackChange}
            required={this.props.required} />
      );
    }
  }
}
export default Date;
