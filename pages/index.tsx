import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { tokenCA, contractABI } from '../src/components/Constant';
import styles from '../styles/Home.module.css';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useIsMounted } from '../src/components/useIsMounted';

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const mounted = useIsMounted();
  const { data: hash, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: isZero } =
    useWaitForTransactionReceipt({
      hash,
    });

  const handleTransfer = async (e: any) => {
    writeContract({
      address: tokenCA,
      abi: contractABI,
      functionName: 'claim',
    });
  };

  if (!mounted) {
    return null;
  } else {
    return (
      <div>
        <h1>Web3 DApp</h1>

        <main className={styles.main}>
          <ConnectButton />
          <div className={styles.card}>

            <button
              disabled={isPending || isConfirming || !address}
              type="submit"
              onClick={handleTransfer}
            >
              <p>
                {isPending ? 'Confirming...' : isConfirming ? 'Waiting for confirmation...' : isConfirmed ? 'Claim' : 'Claim'}
              </p>
            </button>
            <div>
              {hash && isConfirmed && (
                <div>
                  <a href={`https://testnet.bscscan.com/tx/${hash}`}>Burn Success, Agent. <br /> Click here to view Txn </a>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

}

export default Home;
