import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthedUserContext } from '../../App';

import { Button } from '../../components/template/button'

import * as authService from '../../services/authService';

const SignupForm = (props) => {
  
  const user = useContext(AuthedUserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState(['']);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    passwordConf: '',
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUserResponse = await authService.signup(formData);
      props.setUser(newUserResponse.user);
      navigate('/dashboard');
    } catch (err) {
      updateMessage(err.message);
    }
  };

  const { username, password, passwordConf } = formData;

  const isFormInvalid = () => {
    return !(username && password && password === passwordConf);
  };

  return (
    <div class ="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
      <h1 class="text-center text-2xl">Sign Up</h1>
      <p class="mt-3 text-center text-lg text-gray-600">Have an account? <a onClick={props.handleFormSwap}>Sign in</a> to your account.</p>
      <div class="-mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:rounded-5xl sm:p-24">
        {/* <p>signUp comp{JSON.stringify(props)}</p> */}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              name="username"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              name="password"
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="confirm">Confirm Password:</label>
            <input
              type="password"
              id="confirm"
              value={passwordConf}
              name="passwordConf"
              onChange={handleChange}
            />
          </div>
          <div>
            {/* <button class = "btn-primary" disabled={isFormInvalid()}>Sign Up</button> */}
            <Button type="submit" color="green" className='w-full' disabled={isFormInvalid()}>Signup</Button>
            <p>{message}</p>
            {/* <Link to="/">
              <button onClick={props.handleFormSwap}>Back to Login</button>
            </Link> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
