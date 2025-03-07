import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet } from 'lucide-react';

interface WalletConnectProps {
  onConnect: (address: string) => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("No Ethereum wallet found. Please install MetaMask.");
      return;
    }

    try {
      setConnecting(true);
      setError(null);
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
      
      setAddress(walletAddress);
      onConnect(walletAddress);
    } catch (err) {
      console.error("Error connecting wallet:", err);
      setError("Failed to connect wallet. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          onConnect(accounts[0]);
        }
      }
    };
    
    checkConnection();
  }, [onConnect]);

  return (
    <div className="flex flex-col items-center">
      {!address ? (
        <button
          onClick={connectWallet}
          disabled={connecting}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <Wallet size={20} />
          {connecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="flex items-center gap-2 bg-gray-800 text-white py-2 px-4 rounded-lg">
          <Wallet size={20} />
          <span className="font-mono">
            {address.substring(0, 6)}...{address.substring(address.length - 4)}
          </span>
        </div>
      )}
      
      {error && (
        <p className="text-red-500 mt-2 text-sm">{error}</p>
      )}
    </div>
  );
};

export default WalletConnect;
