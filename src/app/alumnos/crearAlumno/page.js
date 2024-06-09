'use client'
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
// ABIS
import AlumnosABI from '../../utils/AlumnosABI.json';
// config
import config from '../../utils/config.json';

export default function CrearAlumno() {
    const [niu, setNiu] = useState('');
    const [nombre, setNombre] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [anioNacimiento, setAnioNacimiento] = useState('');
    const [sexo, setSexo] = useState('');
    const [alumnosContract, setAlumnosContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);

    const [notification, setNotification] = useState({ show: false, message: '', type: '' });

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    useEffect(() => {
        const loadBlockchainData = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            const network = await provider.getNetwork();
            const address = config[network.chainId].Alumnos.address;
            const alumnosContract = new ethers.Contract(address, AlumnosABI, provider.getSigner());
            setAlumnosContract(alumnosContract);

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = ethers.utils.getAddress(accounts[0]);
            setAccount(account);

            window.ethereum.on('accountsChanged', async () => {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = ethers.utils.getAddress(accounts[0]);
                setAccount(account);
            });
        };

        loadBlockchainData();
    }, []);

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: '' }), 3000);
    };

    const agregarAlumno = async () => {
        if (alumnosContract && niu && nombre && primerApellido && segundoApellido && anioNacimiento && sexo) {
            try {
                const tx = await alumnosContract.agregarAlumno(
                    ethers.BigNumber.from(niu),
                    nombre,
                    ethers.BigNumber.from(anioNacimiento),
                    sexo,
                    primerApellido,
                    segundoApellido
                );
                await tx.wait();
                showNotification('Alumno agregado exitosamente!', 'success');
                setNiu('');
                setNombre('');
                setPrimerApellido('');
                setSegundoApellido('');
                setAnioNacimiento('');
                setSexo('');
            } catch (error) {
                console.error('Error agregando alumno:', error);
                showNotification('Error agregando alumno.', 'error');
            }
        } else {
            showNotification('Por favor, complete todos los campos.', 'error');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Agregar Alumno</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="number"
                        value={niu}
                        onChange={handleInputChange(setNiu)}
                        placeholder="Introduce el NIU"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        type="text"
                        value={nombre}
                        onChange={handleInputChange(setNombre)}
                        placeholder="Introduce el nombre"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        type="text"
                        value={primerApellido}
                        onChange={handleInputChange(setPrimerApellido)}
                        placeholder="Introduce el primer apellido"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        type="text"
                        value={segundoApellido}
                        onChange={handleInputChange(setSegundoApellido)}
                        placeholder="Introduce el segundo apellido"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        type="number"
                        value={anioNacimiento}
                        onChange={handleInputChange(setAnioNacimiento)}
                        placeholder="Introduce el año de nacimiento"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <select
                        value={sexo}
                        onChange={handleInputChange(setSexo)}
                        className="border border-gray-300 rounded-lg p-2"
                    >
                        <option value="">Selecciona el sexo</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>
                    <button
                        onClick={agregarAlumno}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Agregar Alumno
                    </button>
                </div>
            </div>
            {notification.show && (
                <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
}
