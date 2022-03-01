import { InjectedConnector } from '@web3-react/injected-connector'

export const ConnectorNames = {
  Injected: 'injected',
}
const chainIds = [97]
export const injected = new InjectedConnector({ supportedChainIds: chainIds })

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
}

export const getLibrary = (provider) => provider
