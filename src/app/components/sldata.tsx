import * as React from 'react';

import Date from './date-fallback';

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
        <select name="village" value={value} required>
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
      <Date name="date" required onChange={onChange} />
    </label>
  </section>
);

export default SLData;
