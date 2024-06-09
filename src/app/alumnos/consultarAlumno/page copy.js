'use client'
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import UserSVG from '../../assets/user.svg';
import UserM from '../../assets/userM.svg';
import UserF from '../../assets/userF.svg';
// ABIS
import AlumnosABI from '../../utils/AlumnosABI.json';
// config
import config from '../../utils/config.json';

export default function Alumno() {
    const [niu, setNiu] = useState('');
    const [nombreAlumno, setNombreAlumno] = useState(null);
    const [Alumnos, setAlumnos] = useState(null);
    const [provider, setProvider] = useState(null);

    const handleNiuChange = (e) => {
        setNiu(e.target.value);
    };

    useEffect(() => {
        const loadBlockchainData = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            const network = await provider.getNetwork();
            const address = config[network.chainId].Alumnos.address;
            const Alumnos = new ethers.Contract(address, AlumnosABI, provider);
            setAlumnos(Alumnos);

            window.ethereum.on('accountsChanged', async () => {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = ethers.utils.getAddress(accounts[0]);
                setAccount(account);
            });
        };

        loadBlockchainData();
    }, []);

    const fetchAlumno = async () => {
        if (Alumnos && niu) {
            try {
                const nombreAlumno = await Alumnos.obtenerAlumno(niu);
                setNombreAlumno(nombreAlumno);
            } catch (error) {
                if (error.code === -32603) {
                    setNombreAlumno({ error: "Alumno no encontrado" });
                } else {
                    console.error("Error fetching alumno:", error);
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
                <h1 className="text-2xl font-bold mb-4">Consulta de Alumnos</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="number"
                        value={niu}
                        onChange={handleNiuChange}
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
                {nombreAlumno && nombreAlumno.error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span>{nombreAlumno.error}</span>
                    </div>
                ) : (
                    nombreAlumno && (
                        <div className="mt-4 bg-gray-100 p-4 rounded-lg flex items-center">
                            <img src={getProfileImage(nombreAlumno.sexo).src} alt="Profile" className="w-16 h-16 mr-4 rounded-full" />
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Datos del Alumno:</h3>
                                <p><strong>NIU:</strong> {ethers.BigNumber.from(nombreAlumno.niu).toString()}</p>
                                <p><strong>Nombre:</strong> {nombreAlumno.nombre}</p>
                                <p><strong>Primer Apellido:</strong> {nombreAlumno.primerApellido}</p>
                                <p><strong>Segundo Apellido:</strong> {nombreAlumno.segundoApellido}</p>
                                <p><strong>Año de Nacimiento:</strong> {ethers.BigNumber.from(nombreAlumno.anioNacimiento).toString()}</p>
                                <p><strong>Sexo:</strong> {nombreAlumno.sexo}</p>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
