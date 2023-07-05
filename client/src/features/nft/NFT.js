import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  setNRIC,
  setNFTName,
  setNFTDescription,
  setNFTImage,
  setMinting,
  selectMinting,
  setMintedToken,
  selectMintedToken,
  selectNFTName,
  selectNFTDescription,
  selectNFTImage,
} from './nftSlice';

import {
  selectWalletStatus,
  setWalletState,
  setWalletStatus
} from '../wallet/walletSlice';
import { mintNFT } from './web3functions';
import { getAccountBalance } from '../account/Account';

const onMintPressed = async (dispatch, {
  name, image, description
}) => { 
  dispatch(setMinting(true)); // Start loading at the beginning of the operation
  const {
    success,
    status,
    mintedToken,
  } = await mintNFT(image, name, description);

  if (success) {
    const address = window.ethereum.selectedAddress;
    const balance = await getAccountBalance(address);

    console.log(`new balance ${balance}`)

    dispatch(setWalletState({
      status,
      walletAddress: address,
      balance
    }));
  } else {
    dispatch(setWalletStatus('Opps, something wrong happened'));
  }

  dispatch(setMinting(false)); // End loading after the operation is performed
  if (success) {
    dispatch(setWalletStatus(status));
    dispatch(setMintedToken(mintedToken));
  } else {
    dispatch(setWalletStatus("Opps, some error occured."));
  }
};

export const NFT = () => {
  const minting = useSelector(selectMinting);
  const token = useSelector(selectMintedToken);

  const status = useSelector(selectWalletStatus);

  const name = useSelector(selectNFTName);
  const description = useSelector(selectNFTDescription);
  const image = useSelector(selectNFTImage);

  const dispatch = useDispatch();

  const handleOnMintPressed = () => {
    onMintPressed(dispatch, {
      name, description, image
    });
  };

  return (
    <>
      <form>
        <h2> 🚀 NRIC: </h2>
        <input
          type="text"
          placeholder="e.g. S1234567R "
          onChange={(event) => dispatch(setNRIC(event.target.value))}
        />

        <h2> 🚀 NFT Name: </h2>
        <input
          type="text"
          placeholder="e.g. NFT number #1!"
          onChange={(event) => dispatch(setNFTName(event.target.value))}
        />

        <h2> 🚀 NFT Description: </h2>
        <input
          type="text"
          placeholder="e.g. Type something cool here ;)"
          onChange={(event) => dispatch(setNFTDescription(event.target.value))}
        />

        <h2> 🚀 Link to Digital Asset (e.g, IPFS link): </h2>
        <input
          type="text"
          placeholder="e.g. http://localhost:8080/ipfs/QmSimUVgZxkQ4vK2Qh2kcMruebQ9kyWdWNBE88CyXRnu5n"
          onChange={(event) => dispatch(setNFTImage(event.target.value))}
        />
      </form>
      <button id="mintButton" onClick={handleOnMintPressed} disabled={minting}>
        {minting ? (
          <>
            <div className="spinner"></div>
            Minting NFT...
          </>
        ) : (
          "Mint NFT ⛏️"
        )}
      </button>
      <p id="status">
        {status}
      </p>

      <h2>Minted Token: </h2>
      <p>Token URL: {token.URL}</p>
      <p>Name: {token.name}</p>
      <p>Description: {token.description}</p>
      <img src={token.image} width="250" height="250" />
    </>
  );
}