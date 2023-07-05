import Web3 from 'web3';
import { uploadToIPFS } from '../ipfs/IPFS';
const contractInterface = require('../../MyNFT.json')

const getMintedToken = async (userAddress) => {
  // needs to connect directly to the blockchain for instant read operation
  const web3 = new Web3('http://localhost:8545'); 

  // Get the contract instance
  const contractAddress = contractInterface.networks['1337'].address
  const contract = new web3.eth.Contract(contractInterface.abi, contractAddress);
  try {
    const tokenUri = await contract.methods.getMintedToken(userAddress).call();

    // Fetch the image URL from the token's JSON
    const response = await fetch(tokenUri);
    const data = await response.json();

    return {
      ...data,
      URL: tokenUri,
    };
  } catch (error) {
    console.error('Error retrieving minted token:', error);
    return {};
  }
}

export const mintNFT = async ({
  image, name, description }, 
  receipt
  ) => {
  // Create a new web3 instance and connect to metamask for write operation 
  const web3 = new Web3(window.ethereum);

  // Get the contract instance`
  let contractAddress = contractInterface.networks['1337'].address
  contractAddress = web3.utils.toChecksumAddress(contractAddress);
  const contract = new web3.eth.Contract(contractInterface.abi, contractAddress);

  const metadata = {
    name, image, description
  }

  let tokenURI;
  try {
    tokenURI = await uploadToIPFS(metadata);
  } catch (error) {
    console.error("Error uploading metadata to IPFS", error);
    return {
      success: false,
      status: "Could not upload metadata to IPFS",
    };
  }

  const address = window.ethereum.selectedAddress;
  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    'data': contract.methods.mintNFT(address, receipt, tokenURI).encodeABI(), //make call to NFT smart contract 
  };

  console.log(transactionParameters)
  //sign transaction via Metamask
  try {
    const txHash = await window.ethereum
      .request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

    // Fetch and update the minted token
    const token = await getMintedToken(address);

    return {
      success: true,
      status: "✅ Check out your transaction on Etherscan: https://sepolia.etherscan.io/tx/" + txHash,
      mintedToken: token,
    }
  } catch (error) {
    return {
      success: false,
      status: "😥 Something went wrong: " + error.message
    }
  }
}
