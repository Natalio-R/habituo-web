import React from "react";

const ColumnHeader = (props) => {
  return (
    <div className="column__header">
      <div className="header__title">
        <h2>{props.title}</h2>
      </div>
      <div className="header__buttons"></div>
    </div>
  );
};

export default ColumnHeader;
