// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

interface IOctaBoxFac {
  
  function currentBoxId() external view returns (uint256);
  function mint(address _to, uint256 boxType, uint256 boxOption) external;
  function balanceOf(address _owner) external view returns (uint256);
  function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256);

}
