'use client'
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Login from './Form/login';
import Form from './Form/form';
import ListaTrabajadores from './Form/listar';

export default function Home() {
  const [cookies, setCookie] = useCookies(['x-token']);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Verifica si existe el token en las cookies
    if (cookies['x-token']) {
      setHasToken(true);
    } else {
      setHasToken(false);
    }
  }, [cookies]);

  return (
    <>
      {hasToken ? (
    <div className="grid grid-cols-2 gap-4">
    <div className="col-span-1">
      <ListaTrabajadores />
    </div>
    <div className="col-span-1">
      <Form />
    </div>
  </div>
      ) : (
        <Login />
      )}
    </>
  );
}