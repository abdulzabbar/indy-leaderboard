require('dotenv').config()
const HDWalletProvider = require('truffle-hdwallet-provider')

if (!process.env.WEB3_PROVIDER) {
  console.log('Please set a web3 provider to use!')
  process.exit(1)
}

let walletSecret
const mnemonic = process.env.WALLET_MNEMONIC
const privateKey = process.env.WALLET_PRIVATE_KEY

if (mnemonic && mnemonic.split(' ').length == 12) {
  walletSecret = mnemonic
} else if (privateKey) {
  walletSecret = privateKey
} else {
  console.log('Please set you wallet mnemonic or private_key in .env file!')
  process.exit(1)
}

module.exports = {
  networks: {
    development: {
      provider: () =>
        new HDWalletProvider(walletSecret, process.env.WEB3_PROVIDER),
      network_id: '*', // Any network (default: none)
      gas: 6000000,
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: '0.5.10',
    },
  },
}
