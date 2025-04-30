import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ onClick, children, disabled = false }) => {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      data-testid="button"
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

export default Button;
