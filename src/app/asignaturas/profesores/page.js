'use client';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import UserSVG from '../../assets/user.svg';
import UserM from '../../assets/userMP.svg';
import UserF from '../../assets/userFP.svg';
// ABIS
import AsignaturasABI from '../../utils/AsignaturasABI.json';
import ProfesoresABI from '../../utils/ProfesoresABI.json';
// config
import config from '../../utils/config.json';

export default function GestionarProfesores() {
    const [idAsignatura, setIdAsignatura] = useState('');
    const [profesorAddress, setProfesorAddress] = useState('');
    const [asignaturaData, setAsignaturaData] = useState(null);
    const [asignaturasContract, setAsignaturasContract] = useState(null);
    const [profesoresContract, setProfesoresContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadBlockchainData = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            const network = await provider.getNetwork();
            const asignaturasAddress = config[network.chainId].Asignaturas.address;
            const profesoresAddress = config[network.chainId].Profesores.address;
            const asignaturasContract = new ethers.Contract(asignaturasAddress, AsignaturasABI, provider.getSigner());
            const profesoresContract = new ethers.Contract(profesoresAddress, ProfesoresABI, provider.getSigner());
            setAsignaturasContract(asignaturasContract);
            setProfesoresContract(profesoresContract);

            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = ethers.utils.getAddress(accounts[0]);
        };

        loadBlockchainData();
    }, []);

    const fetchAsignatura = async () => {
        if (asignaturasContract && profesoresContract && idAsignatura) {
            try {
                const asignatura = await asignaturasContract.obtenerAsignatura(idAsignatura);
                const filteredProfesores = asignatura[2].filter(direccion => direccion !== "0x0000000000000000000000000000000000000000");
                const profesoresPromises = filteredProfesores.map(async (direccion) => {
                    const profesor = await profesoresContract.obtenerProfesor(direccion);
                    return {
                        direccion,
                        nombre: profesor[1],
                        primerApellido: profesor[4],
                        segundoApellido: profesor[5],
                        sexo: profesor[3]
                    };
                });
                const profesores = await Promise.all(profesoresPromises);
                setAsignaturaData({
                    id: asignatura[0].toString(),
                    nombre: asignatura[1],
                    profesores
                });
                setMessage('');
            } catch (error) {
                setMessage('Asignatura no encontrada');
                console.error("Error fetching asignatura:", error);
            }
        }
    };

    const addProfesor = async () => {
        if (asignaturasContract && idAsignatura && profesorAddress) {
            try {
                const tx = await asignaturasContract.addProfesor(idAsignatura, profesorAddress);
                await tx.wait();
                fetchAsignatura();
                setMessage('Profesor agregado correctamente');
            } catch (error) {
                setMessage('Error agregando profesor');
                console.error("Error adding profesor:", error);
            }
        }
    };

    const deleteProfesor = async (address) => {
        if (asignaturasContract && idAsignatura && address) {
            try {
                const tx = await asignaturasContract.deleteProfesor(idAsignatura, address);
                await tx.wait();
                fetchAsignatura();
                setMessage('Profesor eliminado correctamente');
            } catch (error) {
                setMessage('Error eliminando profesor');
                console.error("Error deleting profesor:", error);
            }
        }
    };

    const getProfileImage = (sexo) => {
        if (sexo === 'Masculino') {
            return UserM;
        } else if (sexo === 'Femenino') {
            return UserF;
        } else {
            return UserSVG;
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Gestionar Profesores de Asignaturas</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="number"
                        value={idAsignatura}
                        onChange={(e) => setIdAsignatura(e.target.value)}
                        placeholder="Introduce el ID de la asignatura"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <button
                        onClick={fetchAsignatura}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Buscar Asignatura
                    </button>
                </div>
                {message && (
                    <div className={`bg-${message.includes('Error') ? 'red' : 'green'}-100 border border-${message.includes('Error') ? 'red' : 'green'}-400 text-${message.includes('Error') ? 'red' : 'green'}-700 px-4 py-3 rounded relative`}>
                        <span>{message}</span>
                    </div>
                )}
                {asignaturaData && (
                    <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">Asignatura: {asignaturaData.nombre}</h3>
                        <p><strong>ID:</strong> {asignaturaData.id}</p>
                        <p><strong>Profesores:</strong></p>
                        <ul className="list-disc list-inside mb-4">
                            {asignaturaData.profesores.map((profesor, index) => (
                                <li key={index} className="flex items-center mb-2">
                                    <img src={getProfileImage(profesor.sexo).src} alt="Profile" className="w-8 h-8 mr-2 rounded-full" />
                                    <span>{`${profesor.nombre} ${profesor.primerApellido} ${profesor.segundoApellido} (${profesor.direccion})`}</span>
                                    <button
                                        onClick={() => deleteProfesor(profesor.direccion)}
                                        className="ml-4 bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            value={profesorAddress}
                            onChange={(e) => setProfesorAddress(e.target.value)}
                            placeholder="Dirección del profesor"
                            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
                        />
                        <button
                            onClick={addProfesor}
                            className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
                        >
                            Agregar Profesor
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
