import {create} from 'ipfs-http-client';

const ipfs = create({
    host: 'localhost', // IPFS daemon address
    port: 5001, // IPFS daemon port
    protocol: 'http' // IPFS protocol
});

export const uploadToIPFS = async (jsonData) => {
    try {
        const data = JSON.stringify(jsonData);
        const file = await ipfs.add(data);
        console.log('Successfully uploaded, CID:', file.path);

        // IPFS gateway URL to access the data
        const url = `http://localhost:8080/ipfs/${file.path}`;
        console.log('Access your data at:', url);

        return url;
    } catch (error) {
        console.error('Error uploading data: ', error);
    }
}
