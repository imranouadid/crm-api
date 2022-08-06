import React from "react";

const Select = ({name, label, value, children, error = "", onChange}) => {

    return (
        <div className="form-group">
            <label htmlFor={name} className="form-label mt-4">{label}</label>
            <select
                className={"form-select " + (error ? "is-invalid" : "")}
                id={name}
                name={name}
                onChange={onChange}
                value={value}
            >
                {children}
            </select>
            { error && <div className="invalid-feedback">{error}</div> }
        </div>
    );
}


export default Select;