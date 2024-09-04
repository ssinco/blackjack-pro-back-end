import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthedUserContext } from '../../App';

import { Button } from '../../components/template/button'

import * as authService from '../../services/authService';


const SigninForm = (props) => {
  
  const user = useContext(AuthedUserContext);
  const navigate = useNavigate();
  const [message, setMessage] = useState(['']);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const updateMessage = (msg) => {
    setMessage(msg);
  };

  const handleChange = (e) => {
    updateMessage('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await authService.signin(formData);
      // console.log(user);
      props.setUser(user);
      navigate('/dashboard');
    } catch (err) {
      updateMessage(err.message);
    }
  };

  // console.log(props)

  return (
    <div class="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
      <h1 class="text-center text-2xl">Log In</h1>


      <p class="mt-3 text-center text-lg text-gray-600">Don’t have an account? <a onClick={props.handleFormSwap}>Sign up</a> for a free trial.</p>

      <div class="-mx-4 mt-10 flex-auto bg-white px-4 py-10 shadow-2xl shadow-gray-900/10 sm:mx-0 sm:flex-none sm:rounded-5xl sm:p-24"> 
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div class = "space-y-6">
            <div>
              <label htmlFor="username" >Username:</label>
              <input
                type="text"
                autoComplete="off"
                id="username"
                value={formData.username}
                name="username"
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                autoComplete="off"
                id="password"
                value={formData.password}
                name="password"
                onChange={handleChange}
              />
            </div>
            <div>
              {/* <button className="btn-primary">Log In</button> */}
              <Button type="submit" color="green" className='w-full mb-4'>Login</Button>
              <p className='text-gray-600'>{message}</p>
              {/* <Link to="/">
                <button>Cancel</button>
              </Link> */}
            </div>
          </div>
        </form>
        {/* <button onClick={props.handleFormSwap}> Sign Up</button>     */}
      </div>
    </div>
  );
};

export default SigninForm;
