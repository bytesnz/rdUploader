import * as React from 'react';

import { SLData, dataPaths } from './types/sldata';

const dataTypes = {
  catch: {
    label: 'Fisheries catch data',
    render: SLData,
    destination: `//data.rd/${dataPaths.catch}`
  },
  effort: {
    label: 'Fisheries effort data',
    render: SLData,
    destination: `//data.rd/${dataPaths.effort}`
  }
};

export class UploadForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      complete: false
    };

    // Check for name in local storage
    if (window.localStorage) {
      this.state.name = localStorage.getItem('name') || '';
    }

    this.updateUploadType = this.updateUploadType.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  updateUploadType(event) {
    this.setState({
      type: event.target.value,
      name: this.state.name,
      complete: false
    });
  }

  renderForm() {
    if (this.state.type) {
      return dataTypes[this.state.type].render({ onChange: this.handleChange });
    }

    return null;
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });

    if (target.validity && !target.validity.valid) {
      return;
    }

    if (target.name === 'name') {
      localStorage.setItem('name', value);
    }
  }

  render() {
    return (
      <form method="POST" encType="multipart/form-data">
        <h1>Data Upload</h1>
        <p>Use this form to upload your entered data</p>
        <label>
          What's your name?
          <input type="text" name="name" onChange={this.handleChange} pattern="[A-Z][-a-zA-Z]+ [A-Z]" value={this.state.name} required />
          <span>Enter your first name and the first letter of your last name</span>
        </label>
        <label>
          What type of data are you uploading?
          <div className="select">
            <select name="type" value={this.state.type} onChange={this.updateUploadType} required>
              <option></option>
              {Object.keys(dataTypes).map((dataType) => {
                return (
                  <option value={dataType} key={dataType}>{dataTypes[dataType].label}</option>
                );
              })}
            </select>
          </div>
        </label>
        {this.state.type ? React.createElement(dataTypes[this.state.type].render, {
          onChange: this.handleChange.bind(this),
          value: this.state
        }) : null}
        <label>
          Choose the file to upload
          <input type="file" name="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=binary" required />
          <span>The file must be in the Microsoft Excel 2007+ format (.xlsx)</span>
        </label>
        <input type="hidden" name="destination" value={this.state.type ? dataTypes[this.state.type].destination : ''} />
        <input type="submit" value="Upload" />
      </form>
    );
  }
}

export default UploadForm;
