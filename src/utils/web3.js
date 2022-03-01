import Web3 from 'web3'
import getRpcUrl from 'utils/getRpcUrl'

const getWeb3BasedOnChainId = (chainId) => {
  const RPC_URL = getRpcUrl(chainId)
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 })
  const web3 = new Web3(httpProvider)

  return web3
}

const getWeb3NoAccount = () => getWeb3BasedOnChainId()

export { getWeb3NoAccount, getWeb3BasedOnChainId }
