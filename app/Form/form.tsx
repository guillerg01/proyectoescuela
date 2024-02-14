'use client'

import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import jwt from 'jsonwebtoken';


type TrabajadorData = {
    nombre: string;
    ci: number;
    direccion: {
      provincia: string;
      municipio: string;
      calle: string;
      numero: number;
    };
    docente: boolean;

    categoriaDocente?: string;
    categoriaCientifica?: string;
    escolaridad?: string;
    ocupacion?: string;
    user:string
  };
  



export default function Form() {
  const [formData, setFormData] = useState({
    role: '', // Nuevo campo para determinar si es docente o no docente
    name: '',
    identityCard: '',
    address: '',
    province: '',
    municipality: '',
    street: '',
    number: '',
    educationalLevel: '',
    occupation: '',
    teacherCategory: '',
    scientificCategory: ''
  });

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      role: event.target.value
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = cookies['x-token'];
    if (!token) {
      console.error('No se encontró el token JWT.');
      return;
    }
    // Verificar que los campos requeridos tengan valores

  
    // Crear un objeto base para la dirección
    const direccionBase = {
      provincia: formData.province,
      municipio: formData.municipality,
      calle: formData.street,
      numero: parseInt(formData.number) // Convertir a número
    };
  
    // Crear un objeto base para los datos del trabajador
    let trabajadorBase: TrabajadorData = {
      nombre: formData.name,
      ci: parseInt(formData.identityCard), // Convertir a número
      direccion: direccionBase,
      docente: formData.role === 'teacher',
    user:""
    };
  
    // Agregar campos específicos dependiendo del rol
    if (formData.role === 'teacher') {
      trabajadorBase = {
        ...trabajadorBase,
        categoriaDocente: formData.teacherCategory,
        categoriaCientifica: formData.scientificCategory
      };
    } else if (formData.role === 'nonTeacher') {
      trabajadorBase = {
        ...trabajadorBase,
        escolaridad: formData.educationalLevel,
        ocupacion: formData.occupation
      };
    }
  
  
    // Enviar los datos al backend
    try {
        
        const decodedToken = jwt.decode(token);
        let userId = '';
    
        // Verificar si el token decodificado es un objeto y tiene la propiedad 'userId'
        if (typeof decodedToken === 'object' && decodedToken !== null && 'uid' in decodedToken) {
          userId = decodedToken.uid;
        } else {
          console.error('El token JWT no contiene la propiedad userId.');
          return;
        }
    
        // Agregar el ID del usuario al objeto trabajadorBase
        trabajadorBase.user = userId;
    
      const response = await fetch('https://cronometro.onrender.com/api/trabajadores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-token': cookies['x-token'] || '' // Agrega el header x-token aquí
        },
        body: JSON.stringify(trabajadorBase)
      });
  
      // Manejar la respuesta del backend
      if (response.ok) {
        // Aquí puedes manejar la respuesta exitosa, por ejemplo, redirigir al usuario o mostrar un mensaje
        console.log('Datos enviados con éxito.');
      } else {
        // Aquí puedes manejar la respuesta de error, por ejemplo, mostrar un mensaje al usuario
        console.error('Error al enviar los datos:', await response.text());
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };
  const [cookies, setCookie, removeCookie] = useCookies(['x-token']);

  const handleLogout = () => {
    removeCookie('x-token');
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <button
      onClick={handleLogout}
      style={{
        position: 'absolute',
        top:  0,
        right:  0,
        backgroundColor: 'red',
        color: 'white',
        border: 'none',
        padding: '5px  10px',
        cursor: 'pointer',
      }}
    >
      Logout
    </button>

      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Rol:</label>
          <select id="role" name="role" value={formData.role} onChange={handleRoleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Seleccione...</option>
            <option value="teacher">Docente</option>
            <option value="nonTeacher">No Docente</option>
          </select>
        </div>
        {/* Resto de los campos comunes */}
        <div className="mb-4">
  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Ingrese su nombre" />
</div>
<div className="mb-4">
  <label htmlFor="identityCard" className="block text-gray-700 text-sm font-bold mb-2">Carné de Identidad:</label>
  <input type="text" id="identityCard" name="identityCard" value={formData.identityCard} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Ingrese su carné de identidad" />
</div>
<div className="mb-4">
  <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Dirección:</label>
  <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Ingrese su dirección" />
</div>
<div className="mb-4">
  <label htmlFor="province" className="block text-gray-700 text-sm font-bold mb-2">Provincia:</label>
  <input type="text" id="province" name="province" value={formData.province} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Ingrese la provincia" />
</div>
<div className="mb-4">
  <label htmlFor="municipality" className="block text-gray-700 text-sm font-bold mb-2">Municipio:</label>
  <input type="text" id="municipality" name="municipality" value={formData.municipality} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none " placeholder="Ingrese el municipio" />
</div>
<div className="mb-4">
  <label htmlFor="street" className="block text-gray-700 text-sm font-bold mb-2">Calle:</label>
  <input type="text" id="street" name="street" value={formData.street} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Ingrese la calle" />
</div>
<div className="mb-4">
  <label htmlFor="number" className="block text-gray-700 text-sm font-bold mb-2">Número:</label>
  <input type="text" id="number" name="number" value={formData.number} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Ingrese el número" />
</div>
        {/* ... */}
        {/* Campos específicos para docentes */}
        {formData.role === 'teacher' && (
  <>
    <div className="mb-4">
      <label htmlFor="teacherCategory" className="block text-gray-700 text-sm font-bold mb-2">Categoría Docente:</label>
      <select id="teacherCategory" name="teacherCategory" value={formData.teacherCategory} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <option value="">Seleccione...</option>
        <option value="instructor">Instructor</option>
        <option value="assistant">Asistente</option>
        <option value="auxiliary">Auxiliar</option>
        <option value="titular">Titular</option>
      </select>
    </div>
    <div className="mb-4">
      <label htmlFor="scientificCategory" className="block text-gray-700 text-sm font-bold mb-2">Categoría Científica:</label>
      <select id="scientificCategory" name="scientificCategory" value={formData.scientificCategory} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <option value="">Seleccione...</option>
        <option value="master">Máster</option>
        <option value="doctor">Doctor</option>
      </select>
    </div>
  </>
)}
        {/* Campos específicos para no docentes */}
        {formData.role === 'nonTeacher' && (
  <>
    <div className="mb-4">
      <label htmlFor="educationalLevel" className="block text-gray-700 text-sm font-bold mb-2">Nivel de Escolaridad:</label>
      <select id="educationalLevel" name="educationalLevel" value={formData.educationalLevel} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
        <option value="">Seleccione...</option>
        <option value="highSchool">9no grado</option>
        <option value="technicalMiddle">Técnico Medio</option>
        <option value="twelfthGrade">12mo grado</option>
        <option value="university">Universitario</option>
      </select>
    </div>
    <div className="mb-4">
      <label htmlFor="occupation" className="block text-gray-700 text-sm font-bold mb-2">Ocupación:</label>
      <input type="text" id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Ingrese la ocupación" />
    </div>
  </>
)}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Enviar
        </button>
      </form>
    </main>
  );
}