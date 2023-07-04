

export const addWalletListener = ({
  setWallet, setStatus, setBalance
}) => {
  if (window.ethereum) {
    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length > 0) {
        setWallet(accounts[0]);
        setStatus("👆🏽 Write a message in the text-field above.");
        // Fetch and update the account balance
        const balance = getAccountBalance(accounts[0]);
        setBalance(balance);
      } else {
        setWallet("");
        setStatus("🦊 Connect to Metamask using the top right button.");
        setBalance("");
      }
    });
  } else {
    setStatus(
      <p>
        {" "}
        🦊{" "}
        <a target="_blank" href={`https://metamask.io/download.html`}>
          You must install Metamask, a virtual Ethereum wallet, in your
          browser.
        </a>
      </p>
    );
  }
}
