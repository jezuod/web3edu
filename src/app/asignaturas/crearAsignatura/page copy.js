'use client'
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
// ABIS
import AsignaturasABI from '../../utils/AsignaturasABI.json';
// config
import config from '../../utils/config.json';

export default function CrearAsignatura() {
    const [nombre, setNombre] = useState('');
    const [profesor, setProfesor] = useState('');
    const [asignaturasContract, setAsignaturasContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
    };

    useEffect(() => {
        const loadBlockchainData = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);

                const network = await provider.getNetwork();
                const asignaturasAddress = config[network.chainId].Asignaturas.address;
                const asignaturasContract = new ethers.Contract(asignaturasAddress, AsignaturasABI, provider.getSigner());
                setAsignaturasContract(asignaturasContract);

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
                alert("Error loading blockchain data.");
            }
        };

        loadBlockchainData();
    }, []);

    const agregarAsignatura = async () => {
        if (asignaturasContract && nombre && profesor) {
            try {
                console.log("Datos antes de enviar la transacción:", {
                    nombre,
                    profesor
                });

                // Obtener el contador de asignaturas antes de la transacción
                const contadorAntes = await asignaturasContract.contadorAsignaturas();

                const tx = await asignaturasContract.agregarAsignatura(nombre, profesor);
                await tx.wait();

                // Obtener el contador de asignaturas después de la transacción
                const contadorDespues = await asignaturasContract.contadorAsignaturas();
                const idAsignatura = contadorDespues.toNumber();

                if (idAsignatura > contadorAntes.toNumber()) {
                    alert(`Asignatura agregada exitosamente con ID: ${idAsignatura}`);
                } else {
                    alert("Asignatura agregada, pero no se pudo obtener el ID.");
                }

                setNombre('');
                setProfesor('');
            } catch (error) {
                console.error("Error agregando asignatura:", error);
                alert(`Error agregando asignatura: ${error.message}`);
            }
        } else {
            alert("Por favor, complete todos los campos.");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Agregar Asignatura</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="text"
                        value={nombre}
                        onChange={handleInputChange(setNombre)}
                        placeholder="Introduce el nombre de la asignatura"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        type="text"
                        value={profesor}
                        onChange={handleInputChange(setProfesor)}
                        placeholder="Introduce la dirección del profesor"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <button
                        onClick={agregarAsignatura}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Agregar Asignatura
                    </button>
                </div>
            </div>
        </div>
    );
}
