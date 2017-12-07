/** Reef Doctor Uploader
 *
 * A temporary file uploader for Reef Doctor on the LAN
 *
 * Created by Jack Farley (bytesnz) 2017-08-23
 */
import './style.scss';
import 'rd-base/dist/assets/style.css';

import * as React from 'react';
import * as ReactDom from 'react-dom';

import { RDHeader } from 'rd-base';

import UploadForm from './components/form';

const App = (props) => (
  <div>
    <RDHeader />
    <UploadForm />
  </div>
);

ReactDom.render(<App/>, document.getElementById('app'));
