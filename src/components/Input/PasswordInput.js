/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from 'react';
import './Input.scss';

class PasswordInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'password',
      icon: 'icon-visibility-off',
    };
  }

  componentDidMount = () => {};

  changType = () => {
    const { type } = this.state;
    let valueKey;
    let valueIcon;
    if (type === 'text') {
      valueKey = 'password';
      valueIcon = 'icon-visibility-off';
    } else {
      valueKey = 'text';
      valueIcon = 'icon-visibility-on';
    }
    this.setState({ type: valueKey, icon: valueIcon });
  }

  render = () => {
    const {
      id,
      name,
      value,
      onClick,
      onChange,
      disabled,
      className,
      minLength,
      maxLength,
      placeholder,
      checked,
      error,
      passwordStrength,
    } = this.props;
    const { type, icon } = this.state;
    const { changType } = this;

    return (
      <>
        <div className="w-full relative">
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
          <div className="tooltip absolute right-1/20 top-1/4">
            <i onClick={changType} className={`${icon} text-xl`} />
          </div>
        </div>
        {(
            passwordStrength
            && (
              <div className="flex mt-1">
                <div className={`${passwordStrength} text-xs mr-2 font-bold`}>{passwordStrength}</div>
                <div className="flex-1 my-auto bar">
                  <div className={`bar-${passwordStrength} flex-1`} />
                </div>
              </div>
            )
          )}
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
}

export default PasswordInput;
