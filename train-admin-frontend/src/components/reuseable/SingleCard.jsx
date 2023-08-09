import React from "react";

const Singlecard = (props) => {
  const { title, totalNumber, icon } = props.item;
  return (
    <div className="single__traind">
      <div className="traind__content">
        <h4>{title}</h4>
        <span>{totalNumber}+</span>
      </div>

      <span className="traind__icon">
        <i class={icon}></i>
      </span>
    </div>
  );
};

export default Singlecard;
