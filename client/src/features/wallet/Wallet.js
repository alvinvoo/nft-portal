import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAccountBalance } from '../account/Account';
import { 
  selectWalletAddress, 
  selectWalletBalance, 
  setWalletState, 
  setWalletStatus,
} from './walletSlice';

const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const obj = {
                status: "👆🏽 Write a message in the text-field above.",
                address: addressArray[0],
            };
            return obj;
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
            };
        }
    } else {
        return {
            address: "",
            status: (
                <span>
                    <p>
                        {" "}
                        🦊{" "}
                        <a target="_blank" href={`https://metamask.io/download.html`}>
                            You must install Metamask, a virtual Ethereum wallet, in your
                            browser.
                        </a>
                    </p>
                </span>
            ),
        };
    }
};

const connectWalletPressed = async (dispatch) => { 
  const walletResponse = await connectWallet();
  // Fetch and update the account balance
  const balance = await getAccountBalance(walletResponse.address);

  dispatch(setWalletState({
    status: walletResponse.status,
    walletAddress: walletResponse.address,
    balance
  }));
};

const addWalletListener = (dispatch) => {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", async (accounts) => {
      if (accounts.length > 0) {
        // Fetch and update the account balance
        const balance = await getAccountBalance(accounts[0]);

        dispatch(setWalletState({
          walletAddress: accounts[0],
          status: "👆🏽 Write a message in the text-field above.",
          balance,
        }));
      } else {
        dispatch(setWalletState({
          walletAddress: "",
          status: "🦊 Connect to Metamask using the top right button.",
          balance: ""
        }));
      }
    });
  } else {
    dispatch(setWalletStatus(
      <p>
        {" "}
        🦊{" "}
        <a target="_blank" href={`https://metamask.io/download.html`}>
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    ));
  }
}

export const Wallet = () =>  {
  const walletAddress = useSelector(selectWalletAddress);
  const balance = useSelector(selectWalletBalance);

  const dispatch = useDispatch();

  addWalletListener(dispatch);

  const handleButtonClick = () => {
    connectWalletPressed(dispatch);
  };

  return (
    <button id="walletButton" onClick={handleButtonClick}>
      {walletAddress.length > 0 ? (
        <>
          <span>
            Account 🦊: {String(walletAddress).substring(0, 6)}...
            {String(walletAddress).substring(38)}
          </span>
          <br />
          <span>💰 Balance: {balance} ETH</span> {/* Display account balance */}
        </>
      ) : (
        <span>Connect Wallet</span>
      )}
    </button>
  )
};

