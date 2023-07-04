import { NFT } from "./features/nft/NFT";
import { Wallet } from "./features/wallet/Wallet";

const Portal = () => {
  return (
    <div className="Portal">
      <Wallet></Wallet>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <h1 id="title">NFT Portal</h1>
      <p>
        This is a simple application to mint NFT.
        Input your NRIC to get started!
      </p>
      <NFT></NFT>
    </div>
  );
}

export default Portal;
