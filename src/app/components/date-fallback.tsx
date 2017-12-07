import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as moment from 'moment';

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
    this.handleChange = this.handleChange.bind(this);
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
          },
          value: date
        }
      });
    }
  }

  handleChange(event) {
    const target = event.target;
    const date = moment(target.value);

    this.setState({
      value: date
    });

    if (this.props.onChange) {
      this.props.onChange({
        target: {
          type: 'date',
          name: target.name,
          validity: {
            valid: date.isValid()
          },
          value: date
        }
      });
    }
  }

  componentDidMount() {
    const domNode = ReactDOM.findDOMNode(this);

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
            value={this.state.value ? this.state.value.format('YYYY-MM-DD') : ''}
            onChange={this.handleChange}
            required={this.props.required} />
      );
    }
  }
}
export default Date;
