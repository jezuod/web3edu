'use client';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import UserSVG from '../../assets/user.svg';
import UserM from '../../assets/userMP.svg';
import UserF from '../../assets/userFP.svg';
// ABIS
import MatriculasABI from '../../utils/MatriculasABI.json';
import AlumnosABI from '../../utils/AlumnosABI.json';
import AsignaturasABI from '../../utils/AsignaturasABI.json';
import ProfesoresABI from '../../utils/ProfesoresABI.json';
// config
import config from '../../utils/config.json';

export default function Alumno() {
    const [niu, setNiu] = useState('');
    const [nombreAlumno, setNombreAlumno] = useState(null);
    const [alumnosContract, setAlumnosContract] = useState(null);
    const [asignaturasContract, setAsignaturasContract] = useState(null);
    const [matriculasContract, setMatriculasContract] = useState(null);
    const [profesoresContract, setProfesoresContract] = useState(null);
    const [asignaturas, setAsignaturas] = useState([]);
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);

    const handleNiuChange = (e) => {
        setNiu(e.target.value);
    };

    useEffect(() => {
        const loadBlockchainData = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            setProvider(provider);

            const network = await provider.getNetwork();
            const matriculasAddress = config[network.chainId].Matricula.address;
            const matriculasContract = new ethers.Contract(matriculasAddress, MatriculasABI, provider);
            setMatriculasContract(matriculasContract);

            const alumnosAddress = config[network.chainId].Alumnos.address;
            const alumnosContract = new ethers.Contract(alumnosAddress, AlumnosABI, provider);
            setAlumnosContract(alumnosContract);

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

    const fetchAlumno = async () => {
        if (matriculasContract && alumnosContract && asignaturasContract && profesoresContract && niu) {
            try {
                // Obtener datos del alumno
                const alumnoData = await alumnosContract.obtenerAlumno(niu);
                const nombreCompletoAlumno = `${alumnoData[1]} ${alumnoData[4]} ${alumnoData[5]}`;
                setNombreAlumno(nombreCompletoAlumno);

                // Obtener IDs de asignaturas matriculadas
                const asignaturasIds = await matriculasContract.obtenerAsignaturasMatriculadas(niu);

                // Obtener detalles de las asignaturas y profesores
                const asignaturasPromises = asignaturasIds.map(async (id) => {
                    const asignatura = await asignaturasContract.obtenerAsignatura(id);
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
                    return { id: ethers.BigNumber.from(id).toString(), nombre: asignatura[1], profesores };
                });
                const asignaturas = await Promise.all(asignaturasPromises);
                setAsignaturas(asignaturas);

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
                <h1 className="text-2xl font-bold mb-4">Consulta de asignaturas matriculas de Alumnos</h1>
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
                        Buscar Matriculas
                    </button>
                </div>
                {nombreAlumno && nombreAlumno.error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <span>{nombreAlumno.error}</span>
                    </div>
                ) : (
                    nombreAlumno && (
                        <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                            <h3 className="text-xl font-semibold mb-2">Asignaturas Matriculadas del Alumno: {nombreAlumno}</h3>
                            {asignaturas.map((asignatura, index) => (
                                <div key={index} className="mb-4 p-4 bg-white shadow rounded-lg">
                                    <p><strong>ID de la Asignatura:</strong> {asignatura.id}</p>
                                    <p><strong>Nombre de la Asignatura:</strong> {asignatura.nombre}</p>
                                    <p><strong>Profesores:</strong></p>
                                    <ul className="list-disc list-inside">
                                        {asignatura.profesores.map((profesor, idx) => (
                                            <li key={idx} className="flex items-center mb-2">
                                                <img src={getProfileImage(profesor.sexo).src} alt="Profile" className="w-8 h-8 mr-2 rounded-full" />
                                                <span>{profesor.nombre} {profesor.primerApellido} {profesor.segundoApellido} ({profesor.direccion})</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
