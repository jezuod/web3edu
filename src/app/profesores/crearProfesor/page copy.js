'use client'
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
// ABIS
import ProfesoresABI from '../../utils/ProfesoresABI.json';
// config
import config from '../../utils/config.json';

export default function CrearProfesor() {
    const [direccionCartera, setDireccionCartera] = useState('');
    const [nombre, setNombre] = useState('');
    const [primerApellido, setPrimerApellido] = useState('');
    const [segundoApellido, setSegundoApellido] = useState('');
    const [anioNacimiento, setAnioNacimiento] = useState('');
    const [sexo, setSexo] = useState('');
    const [profesoresContract, setProfesoresContract] = useState(null);
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
                const address = config[network.chainId].Profesores.address;
                const profesoresContract = new ethers.Contract(address, ProfesoresABI, provider.getSigner());
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
                alert("Error loading blockchain data.");
            }
        };

        loadBlockchainData();
    }, []);

    const agregarProfesor = async () => {
        if (profesoresContract && direccionCartera && nombre && primerApellido && segundoApellido && anioNacimiento && sexo) {
            try {
                console.log("Datos antes de enviar la transacción:", {
                    direccionCartera,
                    nombre,
                    anioNacimiento: ethers.BigNumber.from(anioNacimiento),
                    sexo,
                    primerApellido,
                    segundoApellido
                });

                const tx = await profesoresContract.crearProfesor(
                    direccionCartera,
                    nombre,
                    ethers.BigNumber.from(anioNacimiento),
                    sexo,
                    primerApellido,
                    segundoApellido
                );
                await tx.wait();
                alert("Profesor agregado exitosamente!");
                setDireccionCartera('');
                setNombre('');
                setPrimerApellido('');
                setSegundoApellido('');
                setAnioNacimiento('');
                setSexo('');
            } catch (error) {
                console.error("Error agregando profesor:", error);
                alert(`Error agregando profesor: ${error.message}`);
            }
        } else {
            alert("Por favor, complete todos los campos.");
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Agregar Profesor</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="text"
                        value={direccionCartera}
                        onChange={handleInputChange(setDireccionCartera)}
                        placeholder="Introduce la dirección de la cartera"
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
                        onClick={agregarProfesor}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Agregar Profesor
                    </button>
                </div>
            </div>
        </div>
    );
}
