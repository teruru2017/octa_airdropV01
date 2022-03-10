// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./IOctaBoxFac.sol";

contract OctaBoxAirdropWL is Context, Ownable, AccessControl, Pausable {

  IOctaBoxFac public octaBox;

  address[] private whitelistAddress;
  mapping(address => uint256) private whitelistBoxTypeId;  // ownerWhitelist => box Type Id
  mapping(address => uint256) private whitelistBoxQuota;  // ownerWhitelist => box Quota
  mapping(address => bool) private isWhitelistAddress;  // ownerWhitelist => is whitelist
  mapping(address => bool) private isClaimed;  // ownerWhitelist => Claimed

  bytes32 public constant SETUP_ROLE = keccak256("OCTAWORLD_SETUP_ROLE");

  constructor() {
    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(SETUP_ROLE, msg.sender);
  }

  event evSetWhitelist(address[] _whitelistList, uint256[] _boxTypeIdList, uint256[] _boxQuotaList);
  event evRemoveWhitelist(address[] _whitelistList, uint256[] _boxTypeIdList);
  event evClaimedAirdropWhitelist(address indexed to, uint256 _boxType, uint256 _boxQuota);
  event evSetOctaBoxFacAddress(IOctaBoxFac octaBox);

  function setWhitelist(address[] memory _whitelistList, uint256[] memory _boxTypeIdList, uint256[] memory _boxQuotaList) external onlyRole(SETUP_ROLE) {
    uint256 _whitelistCount = _whitelistList.length;
    require(_whitelistCount > 0, "OctaAir: Whitelist address is Empty");
    uint256 _boxTypeIdListCount = _boxTypeIdList.length;
    require(_boxTypeIdListCount > 0, "OctaAir: Box type id is Empty");
    uint256 _boxQuotaListCount = _boxQuotaList.length;
    require(_boxQuotaListCount > 0, "OctaAir: Box Quota is Empty");
    require((_whitelistCount == _boxTypeIdListCount) && (_whitelistCount == _boxTypeIdListCount) && (_whitelistCount == _boxQuotaListCount), "OctaAir: All List missmatch");

    for (uint256 idx = 0; idx < _whitelistList.length; idx++) {
      whitelistAddress.push(_whitelistList[idx]);
      isWhitelistAddress[_whitelistList[idx]] = true;
      whitelistBoxTypeId[_whitelistList[idx]] = _boxTypeIdList[idx];
      whitelistBoxQuota[_whitelistList[idx]] = _boxQuotaList[idx];
    }
    emit evSetWhitelist(_whitelistList, _boxTypeIdList, _boxQuotaList);
  }

  function removeWhitelist(address[] memory _whitelistList, uint256[] memory _boxTypeIdList) external onlyRole(SETUP_ROLE) {
    uint256 _whitelistCount = _whitelistList.length;
    require(_whitelistCount > 0, "OctaAir: Whitelist address is Empty");
    uint256 _boxTypeIdListCount = _boxTypeIdList.length;
    require(_boxTypeIdListCount > 0, "OctaAir: Box type id is Empty");

    for (uint256 idx = 0; idx < _whitelistList.length; idx++) {
      delete isWhitelistAddress[_whitelistList[idx]];
      delete whitelistBoxTypeId[_whitelistList[idx]];
      delete whitelistBoxQuota[_whitelistList[idx]];
      delete isClaimed[_whitelistList[idx]];
    }
    emit evRemoveWhitelist(_whitelistList, _boxTypeIdList);
  }

  function getWhitelistByAccount(address _address) external view returns (bool _isWhl, bool _isClm, uint256 _boxType, uint256 _boxQuota) {
    _isWhl = isWhitelistAddress[_address];
    _isClm = isClaimed[_address];
    _boxType = whitelistBoxTypeId[_address];
    _boxQuota = whitelistBoxQuota[_address];
    return (_isWhl, _isClm, _boxType, _boxQuota);
  }

  function claimedAirdropWhitelist() public whenNotPaused {
    uint256 _boxType = whitelistBoxTypeId[msg.sender];
    uint256 _boxQuota = whitelistBoxQuota[msg.sender];

    require(isWhitelistAddress[msg.sender] == true, "OctaAir: Do not have whitelist");
    require(isClaimed[msg.sender] == false, "OctaAir: You have claimed all rights.");
    require(_boxQuota > 0 && _boxQuota <= 5, "OctaAir: Max 5 per transaction");

    for (uint256 i = 0; i < _boxQuota; i++) {
      octaBox.mint(msg.sender, _boxType, 0);
    }
    isClaimed[msg.sender] = true;

    emit evClaimedAirdropWhitelist(msg.sender, _boxType, _boxQuota);
  }

  function setOctaBoxFacAddress(address _box) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(_box != address(0x0), "OctaBox: zero address");
    require(address(octaBox) == address(0x0), "OctaBox: already set");
    octaBox = IOctaBoxFac(_box);
    emit evSetOctaBoxFacAddress(octaBox);
  }

  function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _pause();
  }

  function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
    _unpause();
  }

  function toBytes(uint256 x) private pure returns (bytes memory b) {
    b = new bytes(32);
    assembly { mstore(add(b, 32), x) }
  }

  function getBoxByAccount(address _address) external view returns (uint256[] memory)
  {
    uint256 _boxCount = octaBox.balanceOf(_address);
    uint256[] memory results = new uint256[](_boxCount);
    for (uint256 index = 0; index < _boxCount; index++) {
        results[index] = octaBox.tokenOfOwnerByIndex(_address, index);
    }
    return results;
  }
  
}
