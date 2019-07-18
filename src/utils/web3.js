import Web3 from 'web3'
import ebakus from 'web3-ebakus'

let _web3
let _promisesToResolve = []
let promisesResolve = web3 =>
  _promisesToResolve.forEach(resolve => resolve(web3))

const initWeb3Ebakus = () => {
  window.removeEventListener('ebakusLoaded', initWeb3Ebakus)

  return window.ebakusWallet.getCurrentProviderEndpoint().then(provider => {
    _web3 = ebakus(new Web3())
    _web3.setProvider(provider)
    promisesResolve(_web3)
  })
}

const getWeb3 = () => {
  return new Promise(function(resolve) {
    if (_web3) {
      promisesResolve(_web3)
    }

    _promisesToResolve.push(resolve)

    if (
      typeof window !== 'undefined' &&
      typeof window.ebakusWallet !== 'undefined' &&
      window.ebakusWallet.isConnected()
    ) {
      initWeb3Ebakus()
    } else {
      window.addEventListener('ebakusLoaded', initWeb3Ebakus)
    }
  })
}

export { getWeb3 }
