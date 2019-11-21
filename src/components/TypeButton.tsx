import React from "react";
type ButtonProps = {
  icon: string;
  onChooseType: Function;
};

function TypeButton({ icon, onChooseType }: ButtonProps) {
  return (
    <svg className="icon" onClick={() => onChooseType()}>
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  );
}

export default TypeButton;
