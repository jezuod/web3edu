'use client'
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Logo } from "../assets";
import { Dropdown, Avatar, Navbar } from "flowbite-react";
import Link from 'next/link';

// ABIS
import AlumnosABI from '../utils/AlumnosABI.json';
// config
import config from '../utils/config.json';

const Navigation = () => {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [Alumnos, setAlumnos] = useState(null);


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

    return (
        <nav className="bg-white dark:bg-gray-900 w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={Logo.src} className="h-8" alt="Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap text-gray-900">WEB3EDU</span>
                </Link>

                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li key="Alumnos" className="flex relative group">
                            <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                Alumnos
                            </span>
                            <div className="absolute hidden group-hover:block mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
                                <Link href="/alumnos/crearAlumno" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Crear
                                </Link>
                                <Link href="/alumnos/consultarAlumno" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Consultar
                                </Link>
                                <Link href="/alumnos/editarAlumno" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Editar
                                </Link>
                            </div>
                        </li>
                        <li key="Asignaturas" className="flex relative group">
                            <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                Asignaturas
                            </span>
                            <div className="absolute hidden group-hover:block mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
                                <Link href="/asignaturas/crearAsignatura" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Crear
                                </Link>
                                <Link href="/asignaturas/consultarAsignatura" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Consultar
                                </Link>
                                <Link href="/asignaturas/profesores" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Profesores
                                </Link>
                            </div>
                        </li>
                        <li key="Profesores" className="flex relative group">
                            <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                Profesores
                            </span>
                            <div className="absolute hidden group-hover:block mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
                                <Link href="/profesores/crearProfesor" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Crear
                                </Link>
                                <Link href="/profesores/consultarProfesor" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Consultar
                                </Link>
                                <Link href="/profesores/editarProfesor" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Editar
                                </Link>
                            </div>
                        </li>
                        <li key="Matriculas" className="flex relative group">
                            <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                Matriculas
                            </span>
                            <div className="absolute hidden group-hover:block mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
                                <Link href="/matriculas/crearMatricula" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Crear
                                </Link>
                                <Link href="/matriculas/consultarMatricula" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Consultar
                                </Link>
                                <Link href="/matriculas/administrarMatricula" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Gestionar
                                </Link>
                            </div>
                        </li>
                        <li key="NFT" className="flex relative group">
                            <span className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">
                                NFT
                            </span>
                            <div className="absolute hidden group-hover:block mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-lg">
                                <Link href="/nft/mint" className="block py-2 px-3 text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:hover:text-blue-500">
                                    Mint
                                </Link>
                            </div>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navigation;
