import React, { Component } from 'react';
import { i18n } from '../../utils';

class DateInput extends Component {
  componentDidMount = () => {};

  onKeyUp = (key, event) => {
    switch (key) {
      case 'day': {
        if (event.keyCode === 8 && event.target.value.length === 0) {
          this.monthEl.focus();
        }
        break;
      }
      case 'year': {
        if (event.keyCode === 8 && event.target.value.length === 0) {
          this.dayEl.focus();
        }
        break;
      }
      default:
    }
  }

  onFocus = event => event.target.select();

  setYearElement = (element) => {
    this.yearEl = element;
  };

  setMonthElement= (element) => {
    this.monthEl = element;
  };

  setDayElement = (element) => {
    this.dayEl = element;
  };


  render = () => {
    const { className, onChange, value } = this.props;
    return (
      <div className={className}>
        <div className="flex items-center ms-items-center">
          <input
            ref={element => this.setMonthElement(element)}
            onChange={e => onChange('month', e, this.dayEl)}
            onFocus={e => this.onFocus(e)}
            style={{ width: '1.85rem' }}
            className="bg-transparent text-center"
            value={value.month}
            aria-label={i18n('DOB_MONTH')}
            placeholder="MM"
            name="month"
            type="text"
            min={1}
            max={12}
            maxLength={2}
          />
          <span className="mx-1">/</span>
          <input
            ref={element => this.setDayElement(element)}
            onKeyUp={e => this.onKeyUp('day', e)}
            onChange={e => onChange('day', e, this.yearEl)}
            onFocus={e => this.onFocus(e)}
            style={{ width: '1.85rem' }}
            className="bg-transparent text-center"
            value={value.day}
            aria-label={i18n('DAY')}
            placeholder="DD"
            type="text"
            name="day"
            min={1}
            max={31}
          />
          <span className="mx-1">/</span>
          <input
            ref={element => this.setYearElement(element)}
            onChange={e => onChange('year', e)}
            onFocus={e => this.onFocus(e)}
            onKeyUp={e => this.onKeyUp('year', e)}
            style={{ width: '2.25rem' }}
            className="bg-transparent text-center"
            aria-label={i18n('YEAR')}
            placeholder="YYYY"
            maxLength={4}
            value={value.year}
            name="year"
            type="text"
          />
        </div>
      </div>
    );
  }
}

export default DateInput;
