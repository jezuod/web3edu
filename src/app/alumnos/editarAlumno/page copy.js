'use client';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
// ABIS
import AlumnosABI from '../../utils/AlumnosABI.json';
// config
import config from '../../utils/config.json';

export default function EditarAlumno() {
    const [niu, setNiu] = useState('');
    const [alumnoData, setAlumnoData] = useState(null);
    const [nombre, setNombre] = useState('');
    const [anioNacimiento, setAnioNacimiento] = useState('');
    const [sexo, setSexo] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [alumnosContract, setAlumnosContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [message, setMessage] = useState('');

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

    const fetchAlumno = async () => {
        if (alumnosContract && niu) {
            try {
                const alumno = await alumnosContract.obtenerAlumno(niu);
                setAlumnoData(alumno);
                setNombre(alumno.nombre);
                setAnioNacimiento(ethers.BigNumber.from(alumno.anioNacimiento).toString());
                setSexo(alumno.sexo);
                setPrimerApellido(alumno.primerApellido);
                setSegundoApellido(alumno.segundoApellido);
                setMessage('');
            } catch (error) {
                setMessage('Alumno no encontrado');
                console.error("Error fetching alumno:", error);
            }
        }
    };

    const updateAlumno = async () => {
        if (alumnosContract && niu) {
            try {
                if (nombre !== alumnoData.nombre) {
                    const tx = await alumnosContract.modificarNombre(niu, nombre);
                    await tx.wait();
                }
                if (anioNacimiento !== ethers.BigNumber.from(alumnoData.anioNacimiento).toString()) {
                    const tx = await alumnosContract.modificarAnioNacimiento(niu, anioNacimiento);
                    await tx.wait();
                }
                if (sexo !== alumnoData.sexo) {
                    const tx = await alumnosContract.modificarSexo(niu, sexo);
                    await tx.wait();
                }
                if (primerApellido !== alumnoData.primerApellido) {
                    const tx = await alumnosContract.modificarPrimerApellido(niu, primerApellido);
                    await tx.wait();
                }
                if (segundoApellido !== alumnoData.segundoApellido) {
                    const tx = await alumnosContract.modificarSegundoApellido(niu, segundoApellido);
                    await tx.wait();
                }

                setMessage('Datos del alumno actualizados correctamente');
            } catch (error) {
                setMessage('Error actualizando los datos del alumno');
                console.error("Error updating alumno:", error);
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Editar Alumno</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="number"
                        value={niu}
                        onChange={(e) => setNiu(e.target.value)}
                        placeholder="Introduce el NIU"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <button
                        onClick={fetchAlumno}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Buscar Alumno
                    </button>
                </div>
                {message && (
                    <div className={`bg-${message.includes('Error') ? 'red' : 'green'}-100 border border-${message.includes('Error') ? 'red' : 'green'}-400 text-${message.includes('Error') ? 'red' : 'green'}-700 px-4 py-3 rounded relative`}>
                        <span>{message}</span>
                    </div>
                )}
                {alumnoData && (
                    <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-gray-700">Nombre:</label>
                                <input
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Año de Nacimiento:</label>
                                <input
                                    type="number"
                                    value={anioNacimiento}
                                    onChange={(e) => setAnioNacimiento(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Sexo:</label>
                                <input
                                    type="text"
                                    value={sexo}
                                    onChange={(e) => setSexo(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Primer Apellido:</label>
                                <input
                                    type="text"
                                    value={primerApellido}
                                    onChange={(e) => setPrimerApellido(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700">Segundo Apellido:</label>
                                <input
                                    type="text"
                                    value={segundoApellido}
                                    onChange={(e) => setSegundoApellido(e.target.value)}
                                    className="border border-gray-300 rounded-lg p-2 w-full"
                                />
                            </div>
                            <button
                                onClick={updateAlumno}
                                className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
                            >
                                Actualizar Alumno
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
