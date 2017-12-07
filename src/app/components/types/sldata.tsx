import * as React from 'react';

import Date from '../date-fallback';

import { dataPaths } from '../../../forms/sldata';

export { dataPaths };

const villages = {
  AMB: 'Ambolomailake',
  AND: 'Andrevo',
  BE: 'Beravy',
  BL: 'Belitsake',
  IF: 'Ifaty'
};

export const SLData = ({ onChange, value }) => (
  <section>
    <label>
      What village is the data for?
      <div className="select">
        <select name="village" value={value.village} required onChange={onChange}>
          <option></option>
          {Object.keys(villages).map((village) => (
            <option value={village} key={village}>
              {villages[village]}
            </option>
          ))}
        </select>
      </div>
    </label>
    <label>
      What date is the data for?
      <Date name="date" required value={value.village} onChange={onChange} />
    </label>
  </section>
);

export default SLData;
