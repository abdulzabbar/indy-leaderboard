require('dotenv').config()
const bip39 = require('bip39')
const hdkey = require('hdkey')
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
  const mnemonic = bip39.generateMnemonic()
  const seed = bip39.mnemonicToSeedSync(mnemonic)
  const root = hdkey.fromMasterSeed(seed)
  const privateKey = root.privateKey.toString('hex')

  console.log(`
  ####################################
        _           _
       | |         | |
    ___| |__   __ _| | ___   _ ___
   / _ \\ '_ \\ / _\` | |/ / | | / __|
  |  __/ |_) | (_| |   <| |_| \\__ \\
   \\___|_.__/ \\__,_|_|\\_\\\\__,_|___/

  ####################################


  Please set your wallet mnemonic or private_key in '.env' file!

  In case you don't have one, we have generated a new wallet for you that you can use.
  Just copy the below text in your '.env' file.

  """
  WALLET_MNEMONIC=${mnemonic}
  WALLET_PRIVATE_KEY=0x${privateKey}
  """

  After you have correctly set your '.env' file, please re-run the command.

  """
  truffle compile && truffle migrate
  """
  `)

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
