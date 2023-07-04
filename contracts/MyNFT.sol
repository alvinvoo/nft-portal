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

  constructor() ERC721("MyNFT", "NFT") {}

  function mintNFT(address recipient, string calldata tokenURI) external returns (uint) {
    require(bytes(userMintedTokens[recipient]).length > 0, "An address can only mint once");
    require(!tokenExists[tokenURI], "Token already exists");

    _tokenIds.increment();

    uint newItemId = _tokenIds.current();
    _safeMint(recipient, newItemId);
    _setTokenURI(newItemId, tokenURI);

    userMintedTokens[recipient] = tokenURI;
    tokenExists[tokenURI] = true;

    return newItemId;
  }

  // This function will allow the owner to withdraw all the remaining ETH.
  function withdrawETH() public onlyOwner {
    uint balance = address(this).balance;
    payable(owner()).transfer(balance);
  }

  function getMintedToken(address user) external view returns (string memory) {
    return userMintedTokens[user];
  }
}
