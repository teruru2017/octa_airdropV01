// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "./IOctaWarrior.sol";
import "./IOctaBoxFac.sol";

contract OctaBoxFac is Initializable, ERC721Upgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable {

  struct BoxData {
    uint256 boxId;
    uint256 boxType;  // 0 ramdom, 1 common, 2 rare, 3 epic, 4 legendary, 5 black / character / option
    uint256 boxOpt;
  }
  struct WarrData { uint256 warrId; uint256[3] warrDet; }
  struct SignVrs { uint8 v; bytes32 r; bytes32 s; }

  using CountersUpgradeable for CountersUpgradeable.Counter;
  CountersUpgradeable.Counter private _boxIds;
  IOctaWarrior public octaWarr;

  bool public openBoxActive;
  mapping(uint256 => bool) public isBoxOpened;
  mapping(uint256 => BoxData) public boxDatas;
  mapping(uint256 => address) public bannedIds;
  string public baseURI;

  bytes32 public constant MINTER_ROLE = keccak256("OCTAWORLD_MINTER_ROLE");
  bytes32 public constant OPERATOR_ROLE = keccak256("OCTAWORLD_OPERATOR_ROLE");

  event evSetBaseURI(string baseURI);
  event evBoxMinted(address indexed player, uint256 indexed boxId, uint256 boxType, uint256 boxOpt);
  event evBoxOpened(address indexed receiver, WarrData warrData);
  event evSetOpenBoxActived(bool _openBoxActive);
  event evSetWarriorAddress(IOctaWarrior _octaWarr);
  event evBurnBannedIds(uint256[] _bannedIds);
  //event evSetALContract(address contractAddress, bool isWL);

  /// @custom:oz-upgrades-unsafe-allow constructor
  //constructor() initializer {}

  function initialize() initializer public {
    __ERC721_init("OctaBoxFac NFT", "OctaBoxFac");
    __ERC721Enumerable_init();
    __AccessControl_init();

    _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _grantRole(MINTER_ROLE, msg.sender);
  }

  function currentBoxId() external view returns (uint256) {
    return _boxIds.current();
  }

  function mint(address _to, uint256 _boxType, uint256 _boxOpt) external onlyRole(MINTER_ROLE) {
    _boxIds.increment();
    uint256 newBoxId = _boxIds.current();
    _safeMint(_to, newBoxId);
    BoxData memory boxDatas_ = BoxData({
      boxId: newBoxId,
      boxType: _boxType,
      boxOpt: _boxOpt
    });
    boxDatas[newBoxId] = boxDatas_;
    emit evBoxMinted(_to, newBoxId, _boxType, _boxOpt);
  }

  function setWarriorAddress(address _warr) external onlyRole(DEFAULT_ADMIN_ROLE) {
    require(_warr != address(0x0), "OctaBox: zero address");
    require(address(octaWarr) == address(0x0), "OctaBox: already set");
    octaWarr = IOctaWarrior(_warr);
    emit evSetWarriorAddress(octaWarr);
  }

  function boxOpen(WarrData memory _warrData, SignVrs memory _SignVrs) external {
    require(openBoxActive, "OctaBox: Function not active yet");
    require(!isBoxOpened[_warrData.warrId], "OctaBox: Box already Opened" );
    require(ownerOf(_warrData.warrId) == msg.sender, "OctaBox: wrong id");

    require(verifySignature(keccak256(abi.encodePacked(_warrData.warrId, _warrData.warrDet)), _SignVrs), "OctaBox: Wrong proof");

    isBoxOpened[_warrData.warrId] = true;
    _burn(_warrData.warrId);
    octaWarr.born(msg.sender, _warrData.warrId, _warrData.warrDet);
    emit evBoxOpened(msg.sender, _warrData);
  }

  function setOpenBoxActive(bool _active) external onlyRole(DEFAULT_ADMIN_ROLE) {
    openBoxActive = _active;
    emit evSetOpenBoxActived(_active);
  }

  function verifySignature(bytes32 mh, SignVrs memory _signVrs) internal view returns (bool) {
    bytes memory pp = "\x19Ethereum Signed Message:\n32";
    bytes32 digest = keccak256(abi.encodePacked(pp, mh));
    address signer = ecrecover(digest, _signVrs.v, _signVrs.r, _signVrs.s);
    //return hasRole(OPERATOR_ROLE, signer);
    return (msg.sender == signer);
  }

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
    require(!isBoxOpened[tokenId] || to == address(0x0), "OctaBox: Box is locked" ); 
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function burnBannedIds(uint256[] memory _bannedIds) external onlyRole(DEFAULT_ADMIN_ROLE) {
    for (uint256 i = 0; i < _bannedIds.length; i++) {
      bannedIds[_bannedIds[i]] = ownerOf(_bannedIds[i]);
      _burn(_bannedIds[i]);
    }
    emit evBurnBannedIds(_bannedIds);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return baseURI;
  }

  function setBaseURI(string memory _uri) public onlyRole(DEFAULT_ADMIN_ROLE) {
    baseURI = _uri;
    emit evSetBaseURI(baseURI);
  }

  function supportsInterface(bytes4 interfaceId) public view
    override(ERC721Upgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable) returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }

}