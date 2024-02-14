import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const ListaTrabajadores = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(['x-token']);
  useEffect(() => {
    const fetchData = async () => {
      try {
     
        const token = cookies['x-token'];
        const response = await fetch('https://cronometro.onrender.com/api/trabajadores', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-token': token || '',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los trabajadores');
        }

        const data = await response.json();
        setTrabajadores(data.trabajadores);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`${loading ? 'hidden' : ''}  w-full pt-20 pl-4`}>
        <h1 className='text-xl font-semibold mb-4'>Trabajadores</h1>
      <ul className="list-none">
        {trabajadores.map((trabajador:any, index) => (
          <li key={trabajador.id} className="p-2 bg-gray-100 rounded mb-2 flex justify-between items-center">
            <div className='flex flex-col'>
              <span className="font-bold">{trabajador.nombre}</span>
              <span className="text-sm text-gray-500">{trabajador.direccion.calle}, {trabajador.direccion.numero}</span>
              {/* Aquí puedes agregar más detalles del trabajador */}
            </div>
            <div className='flex flex-col'>
              <span className="text-sm text-gray-500">CI: {trabajador.ci}</span>
              <span className="text-sm text-gray-500">Categoría Docente: {trabajador.categoriaDocente}</span>
              {/* Aquí puedes agregar más detalles del trabajador */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaTrabajadores;