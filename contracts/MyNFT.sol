// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  // Mapping to track the NFTs minted by each user
  mapping(address => string) private userMintedTokens;
  // Mapping to check if a token has already been minted
  mapping(string => bool) private tokenExists;

  // Mapping to track the receipt for each user
  mapping(address => string) private userReceipts;

  // Max mintable tokens
  uint public constant MAX_TOKENS = 5;

  // in seconds
  uint public mintStart;
  uint public mintEnd;

  constructor() ERC721("MyNFT", "NFT") {
    // Set mintStart to July 4th, 2023 at 00:00:00 UTC
    mintStart = 1688428800;
    // Set mintEnd to July 14th, 2023 at 00:00:00 UTC
    mintEnd = 1689292800;
  }

  function totalSupply() public view returns (uint) {
    return _tokenIds.current();
  }

  function mintNFT(address recipient, string calldata receipt, string calldata tokenURI) external returns (uint) {
    require(block.timestamp >= mintStart && block.timestamp <= mintEnd, "Minting is not currently allowed");
    require(totalSupply() < MAX_TOKENS, "Maximum number of tokens exceeded");
    require(bytes(userMintedTokens[recipient]).length == 0, "An address can only mint once");
    require(!tokenExists[tokenURI], "Token already exists");

    _tokenIds.increment();

    uint newItemId = _tokenIds.current();
    _safeMint(recipient, newItemId);
    _setTokenURI(newItemId, tokenURI);

    userMintedTokens[recipient] = tokenURI;
    userReceipts[recipient] = receipt; 
    tokenExists[tokenURI] = true;

    return newItemId;
  }

  // This function will allow the owner to withdraw all the remaining ETH.
  function withdrawETH() public onlyOwner {
    uint balance = address(this).balance;
    payable(owner()).transfer(balance);
  }

  function setMintPeriod(uint start, uint end) external onlyOwner {
    require(end > start, "End time must be later than start time");
    mintStart = start;
    mintEnd = end;
  }

  function getMintedToken(address user) external view returns (string memory) {
    return userMintedTokens[user];
  }

  function getReceipt(address user) external view returns (string memory) {
    return userReceipts[user];
  }
}
