'use client';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
// ABIS
import MatriculasABI from '../../utils/MatriculasABI.json';
// config
import config from '../../utils/config.json';

export default function MatricularAlumno() {
    const [niu, setNiu] = useState('');
    const [idAsignaturas, setIdAsignaturas] = useState('');
    const [matriculasContract, setMatriculasContract] = useState(null);
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
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
                const address = config[network.chainId].Matricula.address;
                const matriculasContract = new ethers.Contract(address, MatriculasABI, provider.getSigner());
                setMatriculasContract(matriculasContract);

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
                showNotification("Error loading blockchain data.", 'error');
            }
        };

        loadBlockchainData();
    }, []);

    const matricularAlumno = async () => {
        if (matriculasContract && niu && idAsignaturas) {
            try {
                const asignaturasArray = idAsignaturas.split(',').map(id => ethers.BigNumber.from(id.trim()));
                const totalCost = ethers.utils.parseEther((asignaturasArray.length).toString());

                console.log("Datos antes de enviar la transacción:", {
                    niu,
                    asignaturasArray,
                    totalCost: totalCost.toString()
                });

                const tx = await matriculasContract.matricularAlumno(
                    ethers.BigNumber.from(niu),
                    asignaturasArray,
                    { value: totalCost }
                );
                await tx.wait();
                showNotification("Alumno matriculado exitosamente!", 'success');
                setNiu('');
                setIdAsignaturas('');
            } catch (error) {
                console.error("Error matriculando alumno:", error);

                if (error.message.includes("Alumno no encontrado")) {
                    showNotification("No existe alumno", 'error');
                } else if (error.message.includes("Asignatura no encontrada")) {
                    showNotification("No existe asignatura/s", 'error');
                } else {
                    showNotification(`Error matriculando alumno: ${error.message}`, 'error');
                }
            }
        } else {
            showNotification("Por favor, complete todos los campos.", 'error');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Matricular Alumno</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="number"
                        value={niu}
                        onChange={handleInputChange(setNiu)}
                        placeholder="Introduce el NIU del alumno"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        type="text"
                        value={idAsignaturas}
                        onChange={handleInputChange(setIdAsignaturas)}
                        placeholder="Introduce los IDs de las asignaturas, separados por comas"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <button
                        onClick={matricularAlumno}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Matricular Alumno
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
            </div>
        </div>
    );
}
