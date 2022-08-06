import React from "react";

const Field = ({name, label, value, onChange, placeholder, type = "text", error = ""}) => {

    return (
        <div className="form-group">
            <label htmlFor={name} className="form-label mt-4">{label}</label>
            <input type={type}
                   id={name}
                   placeholder={placeholder || label}
                   name={name}
                   value={value}
                   onChange={onChange}
                   className={"form-control " + (error ? "is-invalid" : "")}
            />
            { error && <div className="invalid-feedback">{error}</div> }
        </div>
    );
}


export default Field;