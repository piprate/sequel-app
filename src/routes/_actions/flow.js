import * as fcl from '@onflow/fcl'
import { currentInstance, loggedInInstances } from '../_store/local'
import { populateDigitalArtPreviewURLs, populateExternalNFTPreviewURLs } from '../_api/nft'
import { get } from 'svelte/store'
import { accessToken, currentSparkId } from '../_store/instance'
import { confirmMintOnDemand, getMintOnDemandSignature, initialiseMintOnDemand } from '../_api/marketplace'
import * as types from '@onflow/types'

export function configureFlow (instanceName) {
  const instanceData = loggedInInstances.get()[instanceName]

  const cfg = fcl.config()
    .put('env', instanceData.flowEnv)
    .put('accessNode.api', instanceData.flowAccessNodeURI)
    .put('discovery.wallet', instanceData.flowDiscoveryWalletURI)
    .put('app.detail.title', instanceData.flowAppTitle)
    .put('app.detail.icon', instanceData.flowAppLogoURI)
    .put('fcl.warning.suppress.redir', true)  // this warning will be removed in future versions. Revisit.

  if (instanceData.flowAddresses) {
    for (const [alias, addr] of Object.entries(instanceData.flowAddresses)) {
      console.log('Setting Flow alias', alias, addr)
      cfg.put(alias, addr)
    }
  }
}

export function disconnectFromFlow () {
  fcl.unauthenticate()
}

export async function getFlowBalance (addr) {
  return await fcl.query({
    cadence: `
        import FungibleToken from 0xFungibleToken
        import FlowToken from 0xFlowToken

        pub fun main(address: Address): UFix64 {
          let account = getAccount(address)

          let vaultRef = account
            .getCapability(/public/flowTokenBalance)
            .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
            ?? panic("Cannot borrow FlowToken vault from account storage")

          return vaultRef.balance
        }
      `,
    args: (arg, t) => [
      arg(addr, t.Address)
    ]
  })
}

export async function getFUSDBalance (addr) {
  return await fcl.query({
    cadence: `
        import FungibleToken from 0xFungibleToken
        import FUSD from 0xFUSD

        pub fun main(address: Address): UFix64 {
            let account = getAccount(address)

            let vaultRef = account.getCapability(/public/fusdBalance)!
                .borrow<&FUSD.Vault{FungibleToken.Balance}>()

            if vaultRef !=  nil {
                return vaultRef!.balance
            } else {
                return 0.0
            }
        }
      `,
    args: (arg, t) => [
      arg(addr, t.Address)
    ]
  })
}

export async function getRoyaltyVaultTypes (addr) {
  return await fcl.query({
    cadence: `
import FungibleTokenSwitchboard from 0xFungibleTokenSwitchboard
import FungibleToken from 0xFungibleToken

pub fun main(account: Address): [Type] {
    let acct = getAccount(account)
    // Get a reference to the switchboard conforming to SwitchboardPublic
    let switchboardRef = acct.getCapability(FungibleTokenSwitchboard.PublicPath)
        .borrow<&FungibleTokenSwitchboard.Switchboard{FungibleTokenSwitchboard.SwitchboardPublic}>()

    if switchboardRef == nil {
      return []
    }

    return switchboardRef!.getVaultTypes()
}
      `,
    args: (arg, t) => [
      arg(addr, t.Address)
    ]
  })
}

export async function setupRoyaltyReceiver (addr) {
  try {
    const txHash = await fcl.send([
      fcl.transaction(`
import FungibleTokenSwitchboard from 0xFungibleTokenSwitchboard
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import FUSD from 0xFUSD
import MetadataViews from 0xMetadataViews

transaction {

    let flowTokenVaultCap: Capability<&{FungibleToken.Receiver}>
    let fusdTokenVaultCap: Capability<&{FungibleToken.Receiver}>
    let switchboardRef:  &FungibleTokenSwitchboard.Switchboard

    prepare(acct: AuthAccount) {
        // Check if the account already has a Switchboard resource
        if acct.borrow<&FungibleTokenSwitchboard.Switchboard>
          (from: FungibleTokenSwitchboard.StoragePath) == nil {

            // Create a new Switchboard resource and put it into storage
            acct.save(
                <- FungibleTokenSwitchboard.createSwitchboard(),
                to: FungibleTokenSwitchboard.StoragePath)

            // Create a public capability to the Switchboard exposing the deposit
            // function through the {FungibleToken.Receiver} interface
            acct.link<&FungibleTokenSwitchboard.Switchboard{FungibleToken.Receiver}>(
                FungibleTokenSwitchboard.ReceiverPublicPath,
                target: FungibleTokenSwitchboard.StoragePath
            )

            // Create a public capability to the Switchboard exposing both the
            // deposit function and the getVaultCapabilities function through the
            // {FungibleTokenSwitchboard.SwitchboardPublic} interface
            acct.link<&FungibleTokenSwitchboard.Switchboard{FungibleTokenSwitchboard.SwitchboardPublic}>(
                FungibleTokenSwitchboard.PublicPath,
                target: FungibleTokenSwitchboard.StoragePath
            )
        }

        // Get a reference to the signers switchboard
        self.switchboardRef = acct.borrow<&FungibleTokenSwitchboard.Switchboard>
            (from: FungibleTokenSwitchboard.StoragePath)
            ?? panic("Could not borrow reference to switchboard")

        if acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
            // Create a new flowToken Vault and put it in storage
            acct.save(<-FlowToken.createEmptyVault(), to: /storage/flowTokenVault)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            acct.link<&FlowToken.Vault{FungibleToken.Receiver}>(
                /public/flowTokenReceiver,
                target: /storage/flowTokenVault
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            acct.link<&FlowToken.Vault{FungibleToken.Balance}>(
                /public/flowTokenBalance,
                target: /storage/flowTokenVault
            )
        }

        self.flowTokenVaultCap =
            acct.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)

        if(acct.borrow<&FUSD.Vault>(from: /storage/fusdVault) == nil) {
            // Create a new FUSD Vault and put it in storage
            acct.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            acct.link<&FUSD.Vault{FungibleToken.Receiver}>(
                /public/fusdReceiver,
                target: /storage/fusdVault
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            acct.link<&FUSD.Vault{FungibleToken.Balance}>(
                /public/fusdBalance,
                target: /storage/fusdVault
            )
        }

        self.fusdTokenVaultCap =
            acct.getCapability<&{FungibleToken.Receiver}>(/public/fusdReceiver)
    }

    execute {
      self.switchboardRef.addNewVault(capability: self.flowTokenVaultCap)
      self.switchboardRef.addNewVault(capability: self.fusdTokenVaultCap)
    }
}`),
      fcl.payer(fcl.currentUser),
      fcl.proposer(fcl.currentUser),
      fcl.authorizations([fcl.authz]),
      fcl.limit(99),
    ])

    console.log({ txHash })

    let tx = fcl.tx(txHash)

    tx.subscribe(console.log)

    tx.subscribe((txStatus) => {
      if (txStatus.status === 3) {
        console.log('tx executed')
      } else if (txStatus.status === 4) {
        console.log('tx sealed')
      }
    })

    const result = await tx.onceSealed()
    console.log('TX result', { result })

    if (result.errorMessage) {
      return {
        result: 'failed',
        error: result.errorMessage
      }
    } else {
      return {
        result: 'completed'
      }
    }
  } catch (e) {
    if (e === 'Declined: Externally Halted'  // Dev Wallet
      || (e.message && e.message.includes('User rejected signature')) // Blocto
    ) {
      return {
        result: 'cancelled'
      }
    } else {
      // Other errors
      return {
        result: 'failed',
        error: e
      }
    }
  }
}

export async function mintOnDemand (listingId, numEditions, minterAddress, statusCallback) {
  const _currentInstance = currentInstance.get()
  const _token = get(accessToken)
  const asSpark = get(currentSparkId)

  statusCallback('init_mod')

  try {
    const modParams = await initialiseMintOnDemand(_currentInstance, _token, listingId, minterAddress, 0, numEditions, asSpark)

    console.log('MOD Params', modParams)

    const serverSigner = serverAuthorization(_currentInstance, _token, listingId, minterAddress, numEditions,
      asSpark, modParams.adminAddr, modParams.adminKeyIndex, statusCallback)

    let payer = fcl.authz
    if (modParams.gasPaidByAdmin) {
      payer = serverSigner
    }

    statusCallback('open_wallet')

    const txHash = await fcl.send([
      fcl.transaction(modParams.script),
      fcl.args([
        fcl.arg(modParams.asset, types.String),
        fcl.arg(String(numEditions), types.UInt64),
        fcl.arg(modParams.unitPrice, types.UFix64),
        fcl.arg(String(listingId), types.UInt64),
      ]),
      fcl.payer(payer),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz, serverSigner]),
      fcl.limit(modParams.gasLimit),
    ])

    console.log({ txHash })

    let tx = fcl.tx(txHash)

    statusCallback('wait_seal')

    tx.subscribe(console.log)

    tx.subscribe((txStatus) => {
      if (txStatus.status === 3) {
        statusCallback('tx_executed')
      } else if (txStatus.status === 4) {
        statusCallback('tx_sealed')
      }
    })

    const result = await tx.onceSealed()
    console.log({ result })

    statusCallback('confirm_sale')

    const tokens = extractMintedTokens(result)

    await confirmMintOnDemand(_currentInstance, _token, listingId, tokens, asSpark)
  } catch (e) {
    if (e === 'Declined: Externally Halted'  // Dev Wallet
      || (e.message && e.message.includes('User rejected signature')) // Blocto
    ) {
      return {
        result: 'cancelled'
      }
    } else {
      // Other errors
      return {
        result: 'failed',
        error: e
      }
    }
  }

  return {
    result: 'completed'
  }
}

function extractMintedTokens (result) {
  let tokens = []

  result.events.forEach((event) => {
    if (event.type.endsWith('DigitalArt.Minted')) {
      tokens.push({
        id: parseInt(event.data.id),
        type: 'MintedToken',
        tokenType: 'DigitalArt',
        asset: event.data.asset,
        edition: parseInt(event.data.edition)
      })
    } else if (event.type.endsWith('DigitalArt.Deposit')) {
      if (tokens.length > 0) {
        tokens[tokens.length - 1].owner = event.data.to
      }
    }
  })

  return tokens
}

// this function is inspired by https://github.com/jacob-tucker/multi-sign/blob/master/frontend/src/serverSigner.js
const serverAuthorization = (instanceName, accessToken, id, buyerAddress, numEditions, asSpark, sequelAdminAddress, sequelAdminKeyID, statusCallback) => async (account) => {
  // authorization function need to return an account
  return {
    ...account, // bunch of defaults in here, we want to overload some of them though
    tempId: `${sequelAdminAddress}-${sequelAdminKeyID}`, // tempIds are more of an advanced topic, for 99% of the times where you know the address and keyId you will want it to be a unique string per that address and keyId
    addr: fcl.sansPrefix(sequelAdminAddress), // the address of the signatory, currently it needs to be without a prefix right now
    keyId: Number(sequelAdminKeyID), // this is the keyId for the accounts registered key that will be used to sign, make extra sure this is a number and not a string
    signingFunction: async (signable) => {
      statusCallback('tx_signing')
      // Signing functions are passed a signable and need to return a composite signature
      // signable.message is a hex string of what needs to be signed.
      let signature
      try {
        signature = await getMintOnDemandSignature(instanceName, accessToken, id, buyerAddress, numEditions, signable, asSpark)
      } catch (e) {
        console.error(e)
        return
      }

      return {
        addr: fcl.withPrefix(sequelAdminAddress), // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
        keyId: Number(sequelAdminKeyID), // needs to be the same as account.keyId, once again make sure its a number and not a string
        signature, // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
      }
    },
  }
}

export async function readNFTCollection (source, account) {
  const _currentInstance = currentInstance.get()
  const _accessToken = get(accessToken)

  let col
  switch (source) {
    case 'sequel':
      col = await getSequelDigitalArtCollection(account)
      break
    case 'versus':
      col = await getVersusCollection(account)
      break
    default:
      console.log('NFT source not supported: ', source)
      col = []
  }

  console.log('Collection: ', col)

  let list

  if (source === 'sequel') {
    list = Array.from(Object.entries(col)).map(([id, meta]) => (
      {
        token: parseInt(id),
        name: meta.name,
        source: source,
        account: account,
        asset: meta.asset,
        avatar: populateDigitalArtPreviewURLs({}, _currentInstance, meta.asset)
      }))
  } else {
    list = Array.from(Object.entries(col)).map(([id, name]) => (
      {
        token: parseInt(id),
        name,
        source: source,
        account: account,
        avatar: populateExternalNFTPreviewURLs({}, _currentInstance, _accessToken, source, account, id)
      }))
  }

  console.log('NFT list: ', list)

  return list
}

async function getSequelDigitalArtCollection (addr) {
  return await fcl.query({
    cadence: `
        import DigitalArt from 0xDigitalArt

        pub fun main(address: Address): { UInt64: DigitalArt.Metadata } {
          let acct = getAccount(address)

          let res : { UInt64: DigitalArt.Metadata } = {}
          if let collection = acct.getCapability(DigitalArt.CollectionPublicPath).borrow<&{DigitalArt.CollectionPublic}>()  {
            for id in collection.getIDs() {
              var da = collection.borrowDigitalArt(id: id)!
              if let view = da.resolveView(Type<DigitalArt.Metadata>()) {
                res[id] = view as! DigitalArt.Metadata
              }
            }
          }

          return res
      }`,
    args: (arg, t) => [
      arg(addr, t.Address)
    ]
  })
}

async function getVersusCollection (addr) {
  return await fcl.query({
    cadence: `
        import Art from 0xArt

        pub fun main(address: Address): { UInt64: String } {
          let account = getAccount(address)

          let art = Art.getArt(address: address)

          let res : { UInt64: String } = {}
          for a in art {
              res[a.id] = a.metadata.name
          }

          return res
      }`,
    args: (arg, t) => [
      arg(addr, t.Address)
    ]
  })
}