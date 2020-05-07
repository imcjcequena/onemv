import React from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
import DateInput from './DateInput';
import Text from '../Text';
import './Input.scss';
import { i18n } from '../../utils';

// TODO: if input has custom props, do not spread props

const Input = (props) => {
  const {
    id,
    max,
    type,
    name,
    value,
    defaultValue,
    onClick,
    onChange,
    disabled,
    className,
    minLength,
    maxLength,
    placeholder,
    checked,
    error,
  } = props;

  if (type === 'select') {
    return (
      <>
        <div className="selectField text-gray-900 rounded shadow-md">
          <select
            id={id}
            name={name}
            onChange={onChange}
            onClick={onClick}
            disabled={disabled}
            className={error !== null ? `border border-solid border-red ${className}` : className}
            defaultValue={defaultValue}
            placeholder={placeholder}
            {...props}
          >
            {props.children}
          </select>
        </div>
        {(
          error
          && (
            <div className="text-white text-lg text-left p-2 flex items-center leading-none">
              <i className="icon-error self-center text-lg mr-2" />
              <span>{error}</span>
            </div>
          )
        )}
      </>
    );
  }
  if (type === 'textarea') {
    return (
      <textarea
        id={id}
        name={name}
        className={className}
        onChange={onChange}
        onClick={onclick}
        disabled={disabled}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        {...props}
      >
        {value}
      </textarea>
    );
  }
  if (type === 'dateinput') {
    return (
      <>
        <DateInput
          className={error !== null ? `border border-solid border-red datepicker ${className}` : `datepicker ${className}`}
          value={value}
          onChange={onChange}
        />
        {(
          error
          && (
            <div className="text-red text-lg text-left p-2 flex items-center leading-none">
              <i className="icon-error self-center text-lg mr-2" />
              <span>{error}</span>
            </div>
          )
        )}
      </>
    );
  }
  if (type === 'datepicker') {
    return (
      <>
        <input
          type="date"
          className={error !== null ? `border border-solid border-red datepicker ${className}` : `datepicker ${className}`}
          name={name}
          id={id}
          placeholder={placeholder}
          onChange={onChange}
          onClick={onClick}
          max={max}
        />
        {(
          error
          && (
            <div className="text-red text-lg text-left p-2 flex items-center leading-none">
              <i className="icon-error self-center text-lg mr-2" />
              <span>{error}</span>
            </div>
          )
        )}
      </>
    );
  }
  if (id === 'clientId') {
    return (
      <>
        <div className="w-full relative">
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            onClick={onClick}
            className={error !== null ? `border border-solid border-red ${className}` : className}
            minLength={minLength}
            maxLength={maxLength}
            placeholder={placeholder}
          />
          <div role="button" aria-label={i18n('HELP_BUTTON')} className="tooltip absolute right-1/20 top-1/4">
            <i className="icon-help text-xl" />
            <span className="tooltiptext"><Text text="YOUR_CLIENT_ID" /></span>
          </div>
          {(
            error
            && (
              <div className="text-red text-lg text-left p-2 flex items-center leading-none">
                <i className="icon-error self-center text-lg mr-2" />
                <span>{error}</span>
              </div>
            )
          )}
        </div>
      </>
    );
  }
  return (
    <>
      {/* props to be spread {...props} */}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={onChange}
        onClick={onClick}
        className={error !== null ? `border border-solid border-red ${className}` : className}
        minLength={minLength}
        maxLength={maxLength}
        placeholder={placeholder}
      />
      {(
        error
        && (
          <div className="text-red text-lg text-left p-2 flex items-center leading-none">
            <i className="icon-error self-center text-lg mr-2" />
            <span>{error}</span>
          </div>
        )
      )}
    </>
  );
};

export default Input;
