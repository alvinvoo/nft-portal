import Web3 from 'web3';
import { uploadToIPFS } from '../ipfs/IPFS';
const contractInterface = require('../../MyNFT.json')

// Create a new web3 instance and connect to the blockchain
const web3 = new Web3(window.ethereum);

// Get the contract instance`
let contractAddress = contractInterface.networks['1337'].address
contractAddress = web3.utils.toChecksumAddress(contractAddress);
const contract = new web3.eth.Contract(contractInterface.abi, contractAddress);

const getMintedToken = async (userAddress) => {
  try {
    const tokenId = await contract.methods.getMintedToken(userAddress).call();
    console.log(`Token ${tokenId}`)

    // Call the contract's tokenURI 
    const tokenUri = await contract.methods.tokenURI(tokenId).call();

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

export const mintNFT = async (image, name, description) => {
  //error handling
  if (image.trim() === "" || (name.trim() === "" || description.trim() === "")) {
    return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
    }
  }

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

  //load smart contract
  const contract = new web3.eth.Contract(contractInterface.abi, contractAddress);

  const address = window.ethereum.selectedAddress;
  const nonce = await web3.eth.getTransactionCount(address);

  //set up your Ethereum transaction
  const transactionParameters = {
    to: contractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    'data': contract.methods.mintNFT(address, tokenURI).encodeABI(), //make call to NFT smart contract 
    nonce: nonce.toString()
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
