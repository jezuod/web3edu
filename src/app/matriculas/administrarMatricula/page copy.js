'use client'
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
// ABIS
import MatriculasABI from '../../utils/MatriculasABI.json';
// config
import config from '../../utils/config.json';

export default function AdministrarMatriculas() {
    const [precio, setPrecio] = useState('');
    const [unidad, setUnidad] = useState('ether');
    const [provider, setProvider] = useState(null);
    const [matriculasContract, setMatriculasContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState('0');

    const handlePrecioChange = (e) => {
        setPrecio(e.target.value);
    };

    const handleUnidadChange = (e) => {
        setUnidad(e.target.value);
    };

    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
    };

    useEffect(() => {
        const loadBlockchainData = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            const network = await provider.getNetwork();
            const matriculasAddress = config[network.chainId].Matricula.address;
            const matriculasContract = new ethers.Contract(matriculasAddress, MatriculasABI, provider.getSigner());
            setMatriculasContract(matriculasContract);

            const balance = await provider.getBalance(matriculasAddress);
            setBalance(ethers.utils.formatEther(balance));

            window.ethereum.on('accountsChanged', async () => {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const account = ethers.utils.getAddress(accounts[0]);
                setAccount(account);
            });
        };

        loadBlockchainData();
    }, []);

    const cambiarPrecio = async () => {
        if (matriculasContract && precio) {
            try {
                const precioConvertido = ethers.utils.parseUnits(precio, unidad);
                const tx = await matriculasContract.cambiarPrecioAsignaturas(precioConvertido);
                await tx.wait();
                alert('Precio cambiado exitosamente');
            } catch (error) {
                console.error('Error cambiando el precio:', error);
                alert('Error cambiando el precio');
            }
        }
    };

    const retirarFondos = async () => {
        if (matriculasContract) {
            try {
                const tx = await matriculasContract.retirarFondos();
                await tx.wait();
                alert('Fondos retirados exitosamente');
                const balance = await provider.getBalance(matriculasContract.address);
                setBalance(ethers.utils.formatEther(balance));
            } catch (error) {
                console.error('Error retirando fondos:', error);
                alert('Error retirando fondos');
            }
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Administrar Matriculas</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="number"
                        value={precio}
                        onChange={handlePrecioChange}
                        placeholder="Introduce el nuevo precio"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <select
                        value={unidad}
                        onChange={handleUnidadChange}
                        className="border border-gray-300 rounded-lg p-2"
                    >
                        <option value="wei">Wei</option>
                        <option value="gwei">Gwei</option>
                        <option value="ether">ETH</option>
                    </select>
                    <button
                        onClick={cambiarPrecio}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Cambiar Precio
                    </button>
                </div>
                <div className="mt-4">
                    <p><strong>Balance del contrato:</strong> {balance} ETH</p>
                    <button
                        onClick={retirarFondos}
                        className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 mt-4"
                    >
                        Retirar Fondos
                    </button>
                </div>
            </div>
        </div>
    );
}
