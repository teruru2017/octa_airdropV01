export const RPC_URL = {
  56: 'https://solitary-snowy-river.bsc.quiknode.pro/16b4e8d1466a4e5c06c88145a2faed83b3661fd9/',
  88: 'https://rpc.tomochain.com',
  89: 'https://testnet.tomochain.com',
  97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
}

const getNodeUrl = (chainId) => (RPC_URL[chainId] ? RPC_URL[chainId] : RPC_URL[88])

export default getNodeUrl
