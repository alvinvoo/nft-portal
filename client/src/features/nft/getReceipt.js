import Web3 from 'web3';

export const getReceipt = async (nric, address) => {
  const web3 = new Web3('http://localhost:8545');
  address = web3.utils.toChecksumAddress(address);

  try {
    // first get the NRIC and wallet address receipt
    const response = await fetch('http://localhost:4008/receipt',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "nric": nric,
          "wallet_address": address
        }),
      });
    const data = await response.json();
    if (response.status !== 200) {
      return {
        success: false,
        status: "😥 " + data['message'],
      }
    }

    if (data['receipt']) {
      return {
        success: true,
        receipt: data['receipt'],
      }
    } else {
      return {
        success: false,
        status: "😥 Something is wrong: receipt returned is empty",
      }
    }

  } catch (error) {
    return {
      success: false,
      status: "😥 Could not get receipt from server: " + error.message,
    }
  }
}
