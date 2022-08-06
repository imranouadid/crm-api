import React, {useContext, useState} from "react";
import authAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import {toast} from "react-toastify";

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext);
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
    })
    const [error, setError] = useState("");

    // Handle fields of authentication form
    const handleChange = (event) => {
        const value = event.currentTarget.value;
        const name = event.currentTarget.name;
        setCredentials({...credentials, [name]: value});
    }

    // handle form submit
    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            await authAPI.authenticate(credentials);
            setError("");
            setIsAuthenticated(true);
            toast.success("You are connected !");
            history.replace('/customers');
        }catch (error) {
            setError("You have entered an invalid username or password");
            setCredentials({...credentials, ['password']: ""});
            toast.error("Authentification failed");
        }
    }

  return (
      <>
        <h1>Login page</h1>
          <form onSubmit={handleSubmit}>
            <Field
                name={"username"}
                onChange={handleChange}
                value={credentials.username}
                placeholder={"E-mail"}
                label={"Email address"}
                error={error}
                type={"email"}
            />

              <Field
                  name={"password"}
                  onChange={handleChange}
                  value={credentials.password}
                  placeholder={"Password"}
                  label={"Password"}
                  error={""}
                  type={"password"}
              />


              <div className={'form-group mt-3'}>
                  <button type="submit" className="btn btn-primary">Submit</button>
              </div>

          </form>
      </>
  )
}


export default LoginPage;