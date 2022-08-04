import React, {useContext, useState} from "react";
import authAPI from "../services/AuthAPI";
import AuthContext from "../contexts/AuthContext";

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
            history.replace('/customers');
        }catch (error) {
            setError("You have entered an invalid username or password");
        }
    }

  return (
      <>
        <h1>Login page</h1>
          <form onSubmit={handleSubmit}>
                  <div className="form-group">
                      <label htmlFor="username" className="form-label mt-4">Email address</label>
                      <input type="email" className={"form-control " + (error ? "is-invalid" : "")} id="username" placeholder="Enter email"
                             name={'username'} value={credentials.username} onChange={handleChange}
                      />
                      { error && <div className="invalid-feedback">{error}</div> }
                  </div>

                  <div className="form-group">
                      <label htmlFor="password" className="form-label mt-4">Password</label>
                      <input type="password" className="form-control" id="password"
                             placeholder="Password" name={'password'} value={credentials.password}
                             onChange={handleChange}
                      />
                  </div>

                  <div className={'form-group mt-3'}>
                      <button type="submit" className="btn btn-primary">Submit</button>
                  </div>

          </form>
      </>
  )
}


export default LoginPage;