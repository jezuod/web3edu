'use client';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
// ABIS
import ProfesoresABI from '../../utils/ProfesoresABI.json';
// config
import config from '../../utils/config.json';

export default function EditarProfesor() {
    const [direccion, setDireccion] = useState('');
    const [profesor, setProfesor] = useState(null);
    const [profesoresContract, setProfesoresContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        anioNacimiento: '',
        sexo: '',
        primerApellido: '',
        segundoApellido: ''
    });
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleDireccionChange = (e) => {
        setDireccion(e.target.value);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000);
    };

    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);

                const network = await provider.getNetwork();
                const profesoresAddress = config[network.chainId].Profesores.address;
                const profesoresContract = new ethers.Contract(profesoresAddress, ProfesoresABI, provider);
                setProfesoresContract(profesoresContract);

                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = ethers.utils.getAddress(accounts[0]);
                setAccount(account);

                window.ethereum.on('accountsChanged', async () => {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const account = ethers.utils.getAddress(accounts[0]);
                    setAccount(account);
                });
            } catch (error) {
                console.error("Error loading blockchain data:", error);
                showNotification("Error loading blockchain data: " + error.message, 'error');
            }
        };

        loadBlockchainData();
    }, []);

    const fetchProfesor = async () => {
        if (profesoresContract && direccion) {
            try {
                const profesorData = await profesoresContract.obtenerProfesor(direccion);
                setProfesor(profesorData);
                setFormData({
                    nombre: profesorData[1],
                    anioNacimiento: ethers.BigNumber.from(profesorData[2]).toString(),
                    sexo: profesorData[3],
                    primerApellido: profesorData[4],
                    segundoApellido: profesorData[5]
                });
            } catch (error) {
                console.error("Error fetching profesor:", error);
                setProfesor({ error: "Profesor no encontrado" });
                showNotification("Profesor no encontrado", 'error');
            }
        }
    };

    const actualizarProfesor = async () => {
        if (profesoresContract && direccion && account) {
            const signer = provider.getSigner();
            const profesoresContractWithSigner = profesoresContract.connect(signer);

            try {
                const tx = await profesoresContractWithSigner.editarProfesor(
                    direccion,
                    formData.nombre,
                    ethers.BigNumber.from(formData.anioNacimiento),
                    formData.sexo,
                    formData.primerApellido,
                    formData.segundoApellido
                );
                await tx.wait();
                showNotification("Profesor actualizado exitosamente.", 'success');
            } catch (error) {
                console.error("Error actualizando profesor:", error);
                showNotification("Error actualizando los datos del profesor: " + error.message, 'error');
            }
        } else {
            showNotification("No se ha cargado el contrato o la dirección del profesor.", 'error');
            console.log("Contract:", profesoresContract);
            console.log("Direccion:", direccion);
            console.log("Account:", account);
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Editar Profesor</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="text"
                        value={direccion}
                        onChange={handleDireccionChange}
                        placeholder="Introduce la Dirección del Profesor"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <button
                        onClick={fetchProfesor}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Buscar Profesor
                    </button>
                </div>
                {notification.message && (
                    <div
                        className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-md text-white
                        ${notification.type === 'success' ? 'bg-green-500' : ''}
                        ${notification.type === 'error' ? 'bg-red-500' : ''}
                        ${notification.type === 'warning' ? 'bg-yellow-500' : ''}`}
                    >
                        {notification.message}
                    </div>
                )}
                {profesor && profesor.error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span>{profesor.error}</span>
                    </div>
                ) : (
                    profesor && (
                        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Datos del Profesor:</h3>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                    placeholder="Nombre"
                                    className="border border-gray-300 rounded-lg p-2"
                                />
                                <input
                                    type="number"
                                    name="anioNacimiento"
                                    value={formData.anioNacimiento}
                                    onChange={handleInputChange}
                                    placeholder="Año de Nacimiento"
                                    className="border border-gray-300 rounded-lg p-2"
                                />
                                <input
                                    type="text"
                                    name="sexo"
                                    value={formData.sexo}
                                    onChange={handleInputChange}
                                    placeholder="Sexo"
                                    className="border border-gray-300 rounded-lg p-2"
                                />
                                <input
                                    type="text"
                                    name="primerApellido"
                                    value={formData.primerApellido}
                                    onChange={handleInputChange}
                                    placeholder="Primer Apellido"
                                    className="border border-gray-300 rounded-lg p-2"
                                />
                                <input
                                    type="text"
                                    name="segundoApellido"
                                    value={formData.segundoApellido}
                                    onChange={handleInputChange}
                                    placeholder="Segundo Apellido"
                                    className="border border-gray-300 rounded-lg p-2"
                                />
                                <button
                                    onClick={actualizarProfesor}
                                    className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600"
                                >
                                    Actualizar Profesor
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
