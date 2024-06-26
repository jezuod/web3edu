'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NFTABI from '../../utils/NFTABI.json';
import config from '../../utils/config.json';

export default function MintNFT() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [nftContract, setNftContract] = useState(null);
    const [toAddress, setToAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [tokenURI, setTokenURI] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const handleToAddressChange = (e) => {
        setToAddress(e.target.value);
    };

    const handleTokenIdChange = (e) => {
        setTokenId(e.target.value);
    };

    const handleTokenURIChange = (e) => {
        setTokenURI(e.target.value);
    };

    const connectHandler = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
    };

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => {
            setNotification({ message: '', type: '' });
        }, 3000);
    };

    useEffect(() => {
        const loadBlockchainData = async () => {
            if (window.ethereum) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                setProvider(provider);

                const accounts = await provider.send("eth_requestAccounts", []);
                const account = ethers.utils.getAddress(accounts[0]);
                setAccount(account);

                const network = await provider.getNetwork();
                const nftAddress = config[network.chainId].NFT.address;
                const nftContract = new ethers.Contract(nftAddress, NFTABI, provider.getSigner());
                setNftContract(nftContract);

                const owner = await nftContract.owner();
                if (owner.toLowerCase() === account.toLowerCase()) {
                    setIsOwner(true);
                }

                window.ethereum.on('accountsChanged', async () => {
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const account = ethers.utils.getAddress(accounts[0]);
                    setAccount(account);
                    const owner = await nftContract.owner();
                    if (owner.toLowerCase() === account.toLowerCase()) {
                        setIsOwner(true);
                    } else {
                        setIsOwner(false);
                    }
                });
            }
        };

        loadBlockchainData();
    }, [account]);

    const mintNFT = async () => {
        if (nftContract && toAddress && tokenId && tokenURI && isOwner) {
            try {
                const tx = await nftContract.mint(toAddress, tokenId, tokenURI);
                await tx.wait();
                showNotification('NFT minteado exitosamente', 'success');
                setToAddress('');
                setTokenId('');
                setTokenURI('');
            } catch (error) {
                console.error('Error minteando el NFT:', error);
                showNotification('Error minteando el NFT', 'error');
            }
        } else {
            showNotification('No tienes permiso para mintear NFTs o faltan datos.', 'error');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h1 className="text-2xl font-bold mb-4">Mintear NFT</h1>
                <div className="flex flex-col gap-4 mb-4">
                    <input
                        type="text"
                        value={toAddress}
                        onChange={handleToAddressChange}
                        placeholder="Dirección del destinatario"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        type="number"
                        value={tokenId}
                        onChange={handleTokenIdChange}
                        placeholder="ID del token"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <input
                        type="text"
                        value={tokenURI}
                        onChange={handleTokenURIChange}
                        placeholder="URI del token"
                        className="border border-gray-300 rounded-lg p-2"
                    />
                    <button
                        onClick={mintNFT}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
                    >
                        Mintear NFT
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
