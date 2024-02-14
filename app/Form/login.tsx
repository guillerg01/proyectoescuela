'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export default function Login(){
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState('Inicia Session');
  const [cookies, setCookie] = useCookies(['x-token']);

  const handleSubmitLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios.post(`https://cronometro.onrender.com/api/auth/`, {
      name: user,
      password: password,
    }, {
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        if (response.data.ok) {
          setCookie('x-token', response.data.token, { path: '/' });
          console.log(cookies['x-token']);
          setUser('');
          setPassword('');
        } else {
          console.error(response.data.msg);
        }
      }).catch(()=>console.error());
  };

  const handleSubmitRegister = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    axios.post(`https://cronometro.onrender.com/api/auth/new`, {
      name: user,
      password: password,
    }, {
      headers: { "Content-Type": "application/json" }
    })
      .then((response) => {
        if (response.data.ok) {
          setCookie('x-token', response.data.token, { path: '/' });
          console.log(cookies['x-token']);
          setUser('');
          setPassword('');
        } else {
          console.error(response.data.msg);
        }
      }).catch(()=>console.error());
  };

  const handleClickRegister = () => {
    setEstado(estado === 'Inicia Session' ? 'Registrarse' : 'Inicia Session');
  };

  return (
    <form onSubmit={estado === 'Inicia Session' ? handleSubmitLogin : handleSubmitRegister} className="max-w-xs mx-auto mt-10">
      <h3 className="text-2xl font-semibold mb-6 text-center">{estado}</h3>
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Tu Usuario</label>
        <input
          id="username"
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Tu Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        {estado}
      </button>
      <div className="mt-4 text-center">
        No Tiene Cuenta?&nbsp;
        <span onClick={handleClickRegister} className="cursor-pointer text-blue-500 hover:text-blue-700">
          {estado === 'Inicia Session' ? 'Registrarse' : 'Inicia Session'}
        </span>
      </div>
    </form>
  );
};