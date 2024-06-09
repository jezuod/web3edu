'use client'
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import UserSVG from '../../assets/user.svg';
import UserM from '../../assets/userMP.svg';
import UserF from '../../assets/userFP.svg';
// ABIS
import ProfesoresABI from '../../utils/ProfesoresABI.json';
// config
import config from '../../utils/config.json';

export default function Profesor() {
    const [address, setAddress] = useState('');
    const [nombreProfesor, setNombreProfesor] = useState(null);
    const [Profesores, setProfesores] = useState(null);
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    useEffect(() => {
        const loadBlockchainData = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            const network = await provider.getNetwork();
            const address = config[network.chainId].Profesores.address;
            const Profesores = new ethers.Contract(address, ProfesoresABI, provider);
            setProfesores(Profesores);

            window.ethereum.on('accountsChanged', async () => {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = ethers.utils.getAddress(accounts[0]);
                setAccount(account);
            });
        };

        loadBlockchainData();
    }, []);

    const fetchProfesor = async () => {
        if (Profesores && address) {
            try {
                const nombreProfesor = await Profesores.obtenerProfesor(address);
                setNombreProfesor(nombreProfesor);
            } catch (error) {
                if (error.code === -32603) {
                    setNombreProfesor({ error: "Profesor no encontrado" });
                } else {
                    console.error("Error fetching profesor:", error);
                }
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
                <h1 className="text-2xl font-bold mb-4">Consulta de Profesores</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="string"
                        value={address}
                        onChange={handleAddressChange}
                        placeholder="Introduce el Address del profesor"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <button
                        onClick={fetchProfesor}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Buscar Profesor
                    </button>
                </div>
                {nombreProfesor && nombreProfesor.error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span>{nombreProfesor.error}</span>
                    </div>
                ) : (
                    nombreProfesor && (
                        <div className="mt-4 bg-gray-100 p-4 rounded-lg flex items-center">
                            <img src={getProfileImage(nombreProfesor[3]).src} alt="Profile" className="w-16 h-16 mr-4 rounded-full" />
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Datos del Profesor:</h3>
                                <p><strong>Dirección de Cartera:</strong> {nombreProfesor[0]}</p>
                                <p><strong>Nombre:</strong> {nombreProfesor[1]}</p>
                                <p><strong>Año de Nacimiento:</strong> {ethers.BigNumber.from(nombreProfesor[2]).toString()}</p>
                                <p><strong>Sexo:</strong> {nombreProfesor[3]}</p>
                                <p><strong>Primer Apellido:</strong> {nombreProfesor[4]}</p>
                                <p><strong>Segundo Apellido:</strong> {nombreProfesor[5]}</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
