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

export default function Asignatura() {
    const [id, setID] = useState('');
    const [nombreAsignatura, setNombreAsignatura] = useState(null);
    const [profesores, setProfesores] = useState([]);
    const [asignaturasContract, setAsignaturasContract] = useState(null);
    const [profesoresContract, setProfesoresContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [message, setMessage] = useState('');
    const [showNotification, setShowNotification] = useState(false);
    const [notificationType, setNotificationType] = useState('success');

    const handleIDChange = (e) => {
        setID(e.target.value);
    };

    useEffect(() => {
        const loadBlockchainData = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            const network = await provider.getNetwork();
            const asignaturasAddress = config[network.chainId].Asignaturas.address;
            const asignaturasContract = new ethers.Contract(asignaturasAddress, AsignaturasABI, provider);
            setAsignaturasContract(asignaturasContract);

            const profesoresAddress = config[network.chainId].Profesores.address;
            const profesoresContract = new ethers.Contract(profesoresAddress, ProfesoresABI, provider);
            setProfesoresContract(profesoresContract);

            window.ethereum.on('accountsChanged', async () => {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = ethers.utils.getAddress(accounts[0]);
                setAccount(account);
            });
        };

        loadBlockchainData();
    }, []);

    const fetchAsignatura = async () => {
        if (asignaturasContract && id) {
            try {
                const nombreAsignatura = await asignaturasContract.obtenerAsignatura(id);
                setNombreAsignatura(nombreAsignatura);

                // Filtrar direcciones vacías y obtener los datos completos de los profesores
                const filteredProfesores = nombreAsignatura[2].filter(direccion => direccion !== "0x0000000000000000000000000000000000000000");
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
                setProfesores(profesores);

                showNotificationMessage('Asignatura encontrada', 'success');
            } catch (error) {
                showNotificationMessage('Asignatura no encontrada', 'error');
                console.error("Error fetching asignatura:", error);
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

    const showNotificationMessage = (message, type) => {
        setMessage(message);
        setNotificationType(type);
        setShowNotification(true);
        setTimeout(() => {
            setShowNotification(false);
        }, 3000);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Consulta de Asignaturas</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="number"
                        value={id}
                        onChange={handleIDChange}
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
                {showNotification && (
                    <div className={`bg-${notificationType === 'success' ? 'green' : 'red'}-100 border border-${notificationType === 'success' ? 'green' : 'red'}-400 text-${notificationType === 'success' ? 'green' : 'red'}-700 px-4 py-3 rounded relative`}>
                        <span>{message}</span>
                    </div>
                )}
                {nombreAsignatura && !nombreAsignatura.error && (
                    <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">Datos de la Asignatura:</h3>
                        <p><strong>ID:</strong> {ethers.BigNumber.from(nombreAsignatura[0]).toString()}</p>
                        <p><strong>Nombre:</strong> {nombreAsignatura[1]}</p>
                        <p><strong>Profesores:</strong></p>
                        <ul className="list-disc list-inside">
                            {profesores.map((profesor, index) => (
                                <li key={index} className="flex items-center mb-2">
                                    <img src={getProfileImage(profesor.sexo).src} alt="Profile" className="w-8 h-8 mr-2 rounded-full" />
                                    <span>{profesor.nombre} {profesor.primerApellido} {profesor.segundoApellido} ({profesor.direccion})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
