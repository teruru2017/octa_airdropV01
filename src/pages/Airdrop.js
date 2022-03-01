import classes from './Airdrop.module.scss';
import Claim from '../Claim';
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
//import { BscscanProvider } from "@ethers-ancillary/bsc";
import NFTBox from '../contracts/THTESTNFT1155.json'
function Airdrop() {
    const [nfts, setNFts] = useState([])
    const [loadingState, setLoadingState] = useState('not-loaded')
    const [loadingClaim, setLoadingClaim] = useState(false)

    const [userAddr, setUserAddr] = useState(null)
    const [balanceNft, setBalanceNft] = useState(null)
    const [isUWhitelist, setIsUWhitelist] = useState(null)
    const [boxType, setBoxType] = useState(null)
    const [boxQuota, setBoxQuota] = useState(null)
    const [isClaimed, setIsClaimed] = useState(null)

    async function loadWhilelist() {
        // what we want to load:
        // ***provider, tokenContract, marketContract, data for our marketItems***

        //const provider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545", 97)
        //const provider = new ethers.providers.JsonRpcProvider("bsc-testnet")
        //const [address] = await provider.send("eth_requestAccounts", []);
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("------------start---------------")
        setLoadingState('loaded');

        // start web3modal
        const address = await window.ethereum.request({ method: "eth_requestAccounts" });
        //userAddr = address[0];
        console.log(address)
        console.log(address[0])
        const web3Modal = new Web3Modal({
            network: "bsc-testnet", // optional
            cacheProvider: true, // optional
            // disableInjectedProvider: true, // optional
            // providerOptions: {}, // required
        });
        const connection = await web3Modal.connect();
        // end web3modal

        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(NFTBox.TcontractAddress, NFTBox.abi, signer);
        // const provider = new ethers.providers.JsonRpcProvider()
        // const tokenContract = new ethers.Contract(NFTBox.TcontractAddress, NFTBox.abi, provider)
        //const marketContract = new ethers.Contract(nftmarketaddress, KBMarket.abi, provider)
        //const data = await marketContract.fetchMarketTokens()
        //const data = await tokenContract.isWhitelistClaim(address)
        console.log("provider : ", provider)
        console.log(tokenContract)
        console.log("contract address : ", tokenContract.address)

        const data = await tokenContract.balanceOf(address[0], 0);
        console.log("balanceOf 1 : ", data.toString())
        const data2 = await tokenContract.getWhitelistByAccount(address[0]);
        console.log("data2 : ", data2)
        console.log("whitelist : ", data2[0])
        console.log("claim : ", data2[1])
        console.log("box type : ", data2[2].toNumber())
        console.log("box quota : ", data2[3].toNumber())
        const data3 = await tokenContract.balanceOf(address[0], data2[2].toNumber());
        console.log("balanceOf 2 : ", data3.toNumber())

        // const transaction = await tokenContract.claimedAirdropWhitelist();
        // console.log("--1--")
        // let tx = await transaction.wait();
        // console.log("--2--")
        // let event = tx.events[0];
        // console.log("--3--")

        // try {
        //   const response = await tokenContract.balanceOf(address[0], 0);
        //   // if(!response.ok) {
        //   //   throw new Error('Something went wrong');
        //   // }
        //   const data = await response  //.json();
        //   console.log("data : ", data)
        //   let bb = data.toString()
        //   console.log("balanceOf : ", bb)
        // } catch (err) {
        //     console.log("Error: ", err)
        // }
        // //let aa = ethers.utils.parseEther(data)
        // //console.log(aa)
        // try {
        //   const data2 = await tokenContract.isWhitelistClaim(address[0]);
        //   console.log("data2 : ", data2)
        // } catch (err) {
        //   console.log("Error: ", err)
        // }


        //////////////////*************************** */
        // let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
        // let transaction = await contract.createToken(url);
        // let tx = await transaction.wait();
        // let event = tx.events[0];
        // let value = event.args[2];
        // let tokenId = value.toNumber();

        // async function buyCharacter(){
        //   if (typeof window.ethereum !== 'undefined') {
        //     const provider = new ethers.providers.Web3Provider(window.ethereum)
        //     console.log({ provider })
        //     const signer = provider.getSigner()
        //     const contract = new ethers.Contract(Gtokenaddress, Gtoken.abi, signer)
        //     try {
        //       await contract.buyCharacter();

        //     } catch (err) {
        //       console.log("Error: ", err)
        //     }
        //   }    
        // }
        //////////////////*************************** */

        console.log("------------end---------------")
        // const items = await Promise.all(data.map(async i => {
        //   const tokenUri = await tokenContract.tokenURI(i.tokenId)
        //   // we want get the token metadata - json 
        //   const meta = await axios.get(tokenUri)
        //   let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        //   let item = {
        //     price,
        //     tokenId: i.tokenId.toNumber(),
        //     seller: i.seller,
        //     owner: i.owner,
        //     image: meta.data.image, 
        //     name: meta.data.name,
        //     description: meta.data.description
        //   }
        //   return item
        // }
        // ))
        setBalanceNft(data3.toNumber())
        setUserAddr(address[0]);
        setIsUWhitelist(data2[0]);
        setBoxType(data2[2].toNumber());
        setBoxQuota(data2[3].toNumber());
        setIsClaimed(data2[1]);
        //setNFts(items)
        setLoadingState('not-loaded');
    }


    async function claimWhilelist() {

        setLoadingClaim(true)
        console.log("---start-claimWhilelist---")
        const address = await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log(address)
        console.log(address[0])
        const web3Modal = new Web3Modal({
            network: "bsc-testnet", // optional
            cacheProvider: true, // optional
        });
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(NFTBox.TcontractAddress, NFTBox.abi, signer);
        console.log("provider : ", provider)
        console.log(tokenContract)
        console.log("contract address : ", tokenContract.address)
        const transaction = await tokenContract.claimedAirdropWhitelist();
        let tx = await transaction.wait();
        let event = tx.events[0];
        console.log(event)
        console.log("---end-claimWhilelist---")
        setLoadingClaim(false)
    }
    return <div className="container">

        <section>
            <h1 className={classes.airdropTitle}>OCTA HUNTER WORLD</h1>

            <div className={classes.airdropHero}>

                <div className={classes.airdropHeroStage}>
                    <img src='https://public.nftstatic.com/static/nft/zipped/ce966710304b40d1839de1fc0920d2af_zipped.png' alt='' />
                </div>

                <div className={classes.airdropHeroInfo}>
                    <h2>Airdrop</h2>

                    <div className={classes.airdropHeroInfoContent}>
                        <h5>
                            {userAddr === null
                                ? "Address"
                                : userAddr
                                    ? `Address :  ${userAddr.substring(0, 6)}...${userAddr.substring(userAddr.length - 4)}`
                                    : ""}
                        </h5>
                        <h5>
                            {isUWhitelist === null
                                ? "Whitelist"
                                : isUWhitelist
                                    ? `Whitelist :  ${isUWhitelist}`
                                    : `Whitelist :  ${isUWhitelist}`}
                        </h5>
                        <h5>
                            {isClaimed === null
                                ? "Claimed"
                                : isClaimed
                                    ? `Claimed :  ${isClaimed}`
                                    : `Claimed :  ${isClaimed}`}
                        </h5>
                        <h5>
                            {boxType === null
                                ? "Box Type"
                                : `Box Type :  ${boxType}`}
                        </h5>
                        <h5>
                            {boxType === null
                                ? "Box Quota"
                                : `Box Quota :  ${boxQuota}`}
                        </h5>
                        <h5>
                            {balanceNft === null
                                ? "Owner NFT balance"
                                : `Owner NFT balance :  ${balanceNft}`}
                        </h5>
                        <div>
                            <button className="btn btn btn-light me-2 px-2 btn-sm" onClick={loadWhilelist}>
                                {loadingState === 'not-loaded'
                                    ? "Check Whitelist"
                                    : <span><div className='spinner-border spinner-border-sm text-primary'></div> Loading ...</span>
                                }
                            </button>
                            {isUWhitelist
                                ? <button className="btn btn btn-light me-2 px-2 btn-sm" onClick={claimWhilelist}>
                                    {loadingClaim === false
                                        ? "Claim Now"
                                        : <span><div className='spinner-border spinner-border-sm text-primary'></div> Loading ...</span>
                                    }
                                </button>
                                : ""
                            }

                        </div>
                        <p>Embarking on the gamified metaverse, players will pilot their own spaceship and conquer new planets, defeat oppositions, form guilds and capture new and unique NFTs that can either be built on or sold on the open markets.</p>
                    </div>

                    <Claim />
                </div>


            </div>
        </section>

        <section>
            <div className='tab-product'></div>
        </section>
    </div>
}

export default Airdrop;