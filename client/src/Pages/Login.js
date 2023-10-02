import React, {  useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login (){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);


  async function handleLogin(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:4000/login', {
        email,
        password,
      });
      // setUser(data);
      setRedirect(true);
      alert('Login successful');
    } catch (e) {
      alert('Login failed');
    }
  }

  // if (redirect || user) {
  //   // Redirect if user is logged in or redirected is set
  //   return <Navigate to={'/'} />;
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className='text-4xl text-center mb-4'>Login</h1>
        <form className='max-w-md mx-auto' onSubmit={handleLogin}>
        <label className="flex items-start text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Email
                </label>
          <input
            type='email'
            placeholder='your@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
            required
          />
          <div className="mb-4"></div>
           <label className="flex items-start text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
          <input
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-orange-200"
            required
          />
          <button className="bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded-md focus:outline-none focus:ring focus:ring-orange-300">Login</button>
          <div className='text-center py-2 text-gray-500'>
            Don't have an account yet?{' '}
            <Link className='text-black underline' to={'/register'}>
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
