import React, {useState} from "react";
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import UsersAPI from "../services/UsersAPI";


const RegisterPage = ({history}) => {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const handleChange = event => {
        const name = event.currentTarget.name;
        const value = event.currentTarget.value;
        setUser({...user, [name]: value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const apiErrors = {};

        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Password doesn't matched!";
            setErrors(apiErrors);
            return;
        }

        try{
            await UsersAPI.add(user);
            setErrors({});
            history.replace('/login');

        }catch ({response}) {
            const {violations} = response.data;
            if(violations){
                violations.map(v => {
                    apiErrors[v.propertyPath] = v.message;
                });
                setErrors(apiErrors);
            }
        }
    }


  return (
      <>
        <h1>Subscribe</h1>
          <hr/>
          <form onSubmit={handleSubmit}>
              <Field
                  name={"firstName"}
                  label={"First name"}
                  placeholder={"First name"}
                  error={errors.firstName}
                  onChange={handleChange}
                  value={user.firstName}
              />
              <Field
                  name={"lastName"}
                  label={"Last name"}
                  placeholder={"Last name"}
                  error={errors.lastName}
                  onChange={handleChange}
                  value={user.lastName}
              />
              <Field
                  name={"email"}
                  label={"E-mail"}
                  type={"email"}
                  placeholder={"E-mail"}
                  error={errors.email}
                  onChange={handleChange}
                  value={user.email}
              />
              <Field
                  name={"password"}
                  label={"Password"}
                  type={"password"}
                  placeholder={"Password"}
                  error={errors.password}
                  onChange={handleChange}
                  value={user.password}
              />
              <Field
                  name={"passwordConfirm"}
                  label={"Confirm password"}
                  type={"password"}
                  placeholder={"Confirm password"}
                  error={errors.passwordConfirm}
                  onChange={handleChange}
                  value={user.passwordConfirm}
              />

              <div className={'form-group mt-3'}>
                  <button type="submit" className="btn btn-primary">Subscribe</button>
                  <Link to={"/login"} className={"btn btn-link"} >I have an account</Link>
              </div>

          </form>
      </>
  );
}

export default RegisterPage;