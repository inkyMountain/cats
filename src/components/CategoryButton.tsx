import React from "react";
type ButtonProps = {
  icon: string;
  onChooseCategory: Function;
};

function CategoryButton({ icon, onChooseCategory }: ButtonProps) {
  return (
    <svg className="icon" onClick={() => onChooseCategory()}>
      <use xlinkHref={`#${icon}`}></use>
    </svg>
  );
}

export default CategoryButton;
