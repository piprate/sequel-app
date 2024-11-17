import * as fcl from '@onflow/fcl'
import { currentInstance, loggedInInstances } from '../_store/local'
import { populateDigitalArtPreviewURLs } from '../_api/nft'
import { get } from 'svelte/store'
import { accessToken, currentSparkId } from '../_store/instance'
import { confirmMintOnDemand, getMintOnDemandSignature, initialiseMintOnDemand } from '../_api/marketplace'
import * as types from '@onflow/types'

export async function configureFlow(instanceName) {
  const instanceData = loggedInInstances.get()[instanceName]

  let currentAccessNodeAPI = await fcl.config().get('accessNode.api', 'not configured')
  const newAccessNodeAPI = instanceData?.flowAccessNodeURI

  if (currentAccessNodeAPI === newAccessNodeAPI) {
    // already configured
    return
  }

  const cfg = fcl
    .config()
    .put('accessNode.api', newAccessNodeAPI)
    .put('flow.network', instanceData?.flowEnv)
    .put('discovery.wallet', instanceData.flowDiscoveryWalletURI)
    .put('app.detail.title', instanceData.flowAppTitle)
    .put('app.detail.icon', instanceData.flowAppLogoURI)
    .put('fcl.warning.suppress.redir', true) // this warning will be removed in future versions. Revisit.

  if (instanceData?.flowAddresses) {
    for (const [alias, addr] of Object.entries(instanceData.flowAddresses)) {
      console.log('Setting Flow alias', alias, addr)
      cfg.put(alias, addr)
    }
  }
}

export function disconnectFromFlow() {
  fcl.unauthenticate()
}

export async function getFlowBalance(addr) {
  return await fcl.query({
    cadence: `
        import FungibleToken from 0xFungibleToken
        import FlowToken from 0xFlowToken

        access(all) fun main(account: Address): UFix64 {
            let vaultRef = getAccount(account)
                .capabilities.borrow<&FlowToken.Vault>(/public/flowTokenBalance)
                ?? panic("Could not borrow Balance reference to the Vault")

            return vaultRef.balance
        }
      `,
    args: (arg, t) => [arg(addr, t.Address)]
  })
}

export async function getUSDCBalance(addr) {
  return await fcl.query({
    cadence: `
import FungibleToken from 0xFungibleToken
import USDCFlow from 0xUSDCFlow

access(all) fun main(address: Address): UFix64 {
    let account = getAccount(address)
    let vaultRef = account.capabilities.get<&USDCFlow.Vault>
        (USDCFlow.VaultPublicPath)
        .borrow()

    if vaultRef != nil {
        return vaultRef!.balance
    } else {
        return 0.0
    }
}
      `,
    args: (arg, t) => [arg(addr, t.Address)]
  })
}

export async function getRoyaltyVaultTypes(addr) {
  return await fcl.query({
    cadence: `
import FungibleTokenSwitchboard from 0xFungibleTokenSwitchboard
import FungibleToken from 0xFungibleToken

access(all) fun main(account: Address): [Type] {
    let acct = getAccount(account)
    // Get a reference to the switchboard conforming to SwitchboardPublic
    let switchboardRef = acct.capabilities.borrow<&{FungibleToken.Receiver}>(FungibleTokenSwitchboard.ReceiverPublicPath)

    if switchboardRef == nil {
      return []
    }

    return switchboardRef!.getSupportedVaultTypes().keys
}
      `,
    args: (arg, t) => [arg(addr, t.Address)]
  })
}

export async function setupRoyaltyReceiver(addr) {
  try {
    const txHash = await fcl.send([
      // source: account_royalty_receiver_setup.cdc
      fcl.transaction(`
import FungibleTokenSwitchboard from 0xFungibleTokenSwitchboard
import FungibleToken from 0xFungibleToken
import FungibleTokenMetadataViews from 0xFungibleTokenMetadataViews
import FlowToken from 0xFlowToken
import MetadataViews from 0xMetadataViews

transaction(extraTokenContractAddresses: [Address], extraTokenContractNames: [String]) {

    let tokenVaultCapabilities: [Capability<&{FungibleToken.Receiver}>]
    let switchboardRef:  auth(FungibleTokenSwitchboard.Owner) &FungibleTokenSwitchboard.Switchboard

    prepare(signer: auth(BorrowValue, SaveValue, IssueStorageCapabilityController, PublishCapability, UnpublishCapability) &Account) {
        assert(extraTokenContractAddresses.length == extraTokenContractNames.length, message: "lengths of extraTokenContractAddresses and extraTokenContractNames should be equal")

        // Check if the account already has a Switchboard resource
        if signer.storage.borrow<&FungibleTokenSwitchboard.Switchboard>(from: FungibleTokenSwitchboard.StoragePath) == nil {
            // Create a new Switchboard and save it in storage
            signer.storage.save(<-FungibleTokenSwitchboard.createSwitchboard(), to: FungibleTokenSwitchboard.StoragePath)
            // Clear existing Capabilities at canonical paths
            signer.capabilities.unpublish(FungibleTokenSwitchboard.ReceiverPublicPath)
            signer.capabilities.unpublish(FungibleTokenSwitchboard.PublicPath)
            // Issue Receiver & Switchboard Capabilities
            let receiverCap = signer.capabilities.storage.issue<&{FungibleToken.Receiver}>(
                    FungibleTokenSwitchboard.StoragePath
                )
            let switchboardPublicCap = signer.capabilities.storage.issue<&{FungibleTokenSwitchboard.SwitchboardPublic, FungibleToken.Receiver}>(
                    FungibleTokenSwitchboard.StoragePath
                )
            // Publish Capabilities
            signer.capabilities.publish(receiverCap, at: FungibleTokenSwitchboard.ReceiverPublicPath)
            signer.capabilities.publish(switchboardPublicCap, at: FungibleTokenSwitchboard.PublicPath)
        }

        // Get a reference to the account's switchboard
        self.switchboardRef = signer.storage.borrow<auth(FungibleTokenSwitchboard.Owner) &FungibleTokenSwitchboard.Switchboard>(
                from: FungibleTokenSwitchboard.StoragePath)
            ?? panic("Could not borrow reference to switchboard")

        if signer.storage.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault) == nil {
            // Create a new flowToken Vault and put it in storage
            signer.storage.save(<-FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>()), to: /storage/flowTokenVault)

            // Create a public capability to the Vault that only exposes
            // the deposit function through the Receiver interface
            let vaultCap = signer.capabilities.storage.issue<&FlowToken.Vault>(
                /storage/flowTokenVault
            )

            signer.capabilities.publish(
                vaultCap,
                at: /public/flowTokenReceiver
            )

            // Create a public capability to the Vault that only exposes
            // the balance field through the Balance interface
            let balanceCap = signer.capabilities.storage.issue<&FlowToken.Vault>(
                /storage/flowTokenVault
            )

            signer.capabilities.publish(
                balanceCap,
                at: /public/flowTokenBalance
            )
        }

        self.tokenVaultCapabilities = [signer.capabilities.get<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)]

        var i = 0
        for contractAddress in extraTokenContractAddresses {
            let contractName = extraTokenContractNames[i]

            // Borrow a reference to the vault stored on the passed account at the passed publicPath
            let resolverRef = getAccount(contractAddress)
                .contracts.borrow<&{FungibleToken}>(name: contractName)
                    ?? panic("Could not borrow FungibleToken reference to the contract. Make sure the provided contract name ("
                              .concat(contractName).concat(") and address (").concat(contractAddress.toString()).concat(") are correct!"))

            // Use that reference to retrieve the FTView
            let ftVaultData = resolverRef.resolveContractView(resourceType: nil, viewType: Type<FungibleTokenMetadataViews.FTVaultData>()) as! FungibleTokenMetadataViews.FTVaultData?
                ?? panic("Could not resolve FTVaultData view. The ".concat(contractName)
                    .concat(" contract needs to implement the FTVaultData Metadata view in order to execute this transaction."))

            if signer.storage.borrow<&{FungibleToken.Vault}>(from: ftVaultData.storagePath) == nil {
                // Create a new empty vault using the createEmptyVault function inside the FTVaultData
                let emptyVault <-ftVaultData.createEmptyVault()

                // Save it to the account
                signer.storage.save(<-emptyVault, to: ftVaultData.storagePath)

                // Create a public capability for the vault which includes the .Resolver interface
                let vaultCap = signer.capabilities.storage.issue<&{FungibleToken.Vault}>(ftVaultData.storagePath)
                signer.capabilities.publish(vaultCap, at: ftVaultData.metadataPath)

                // Create a public capability for the vault exposing the receiver interface
                let receiverCap = signer.capabilities.storage.issue<&{FungibleToken.Receiver}>(ftVaultData.storagePath)
                signer.capabilities.publish(receiverCap, at: ftVaultData.receiverPath)
            }

            let cap = signer.capabilities.get<&{FungibleToken.Receiver}>(ftVaultData.receiverPath)
            self.tokenVaultCapabilities.append(cap)

            i = i + 1
        }
    }

    execute {
        for cap in self.tokenVaultCapabilities {
            self.switchboardRef.addNewVault(capability: cap)
        }

    }
}`),
      fcl.args([fcl.arg([], types.Array(types.Address)), fcl.arg([], types.Array(types.String))]),
      fcl.payer(fcl.currentUser),
      fcl.proposer(fcl.currentUser),
      fcl.authorizations([fcl.authz]),
      fcl.limit(999)
    ])

    console.log({ txHash })

    const tx = fcl.tx(txHash)

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
    if (
      e === 'Declined: Externally Halted' || // Dev Wallet
      (e.message && e.message.includes('User rejected signature')) // Blocto
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

export async function mintOnDemand(listingId, numEditions, minterAddress, statusCallback) {
  const _currentInstance = currentInstance.get()
  const _token = get(accessToken)
  const asSpark = get(currentSparkId)

  statusCallback('init_mod')

  try {
    const modParams = await initialiseMintOnDemand(
      _currentInstance,
      _token,
      listingId,
      minterAddress,
      0,
      numEditions,
      asSpark
    )

    console.log('MOD Params', modParams)

    const serverSigner = serverAuthorization(
      _currentInstance,
      _token,
      listingId,
      minterAddress,
      numEditions,
      asSpark,
      modParams.adminAddr,
      modParams.adminKeyIndex,
      statusCallback
    )

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
        fcl.arg(modParams.ftContractAddress, types.Address),
        fcl.arg(modParams.ftContractName, types.String),
        fcl.arg(String(listingId), types.UInt64)
      ]),
      fcl.payer(payer),
      fcl.proposer(fcl.authz),
      fcl.authorizations([fcl.authz, serverSigner]),
      fcl.limit(modParams.gasLimit)
    ])

    console.log({ txHash })

    const tx = fcl.tx(txHash)

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
    if (
      e === 'Declined: Externally Halted' || // Dev Wallet
      (e.message && e.message.includes('User rejected signature')) // Blocto
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

function extractMintedTokens(result) {
  const tokens = []

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
// see also https://github.com/onflow/fcl-js/blob/d8b2a8e33ce0ec60ef5d36073dab99c949564167/packages/fcl-core/src/wallet-provider-spec/authorization-function.md
const serverAuthorization =
  (
    instanceName,
    accessToken,
    id,
    buyerAddress,
    numEditions,
    asSpark,
    sequelAdminAddress,
    sequelAdminKeyID,
    statusCallback
  ) =>
  async (account) => {
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
          signature = await getMintOnDemandSignature(
            instanceName,
            accessToken,
            id,
            buyerAddress,
            numEditions,
            signable,
            asSpark
          )
        } catch (e) {
          console.error(e)
          return
        }

        return {
          addr: fcl.withPrefix(sequelAdminAddress), // needs to be the same as the account.addr but this time with a prefix, eventually they will both be with a prefix
          keyId: Number(sequelAdminKeyID), // needs to be the same as account.keyId, once again make sure its a number and not a string
          signature // this needs to be a hex string of the signature, where signable.message is the hex value that needs to be signed
        }
      }
    }
  }

export async function readNFTCollections(addr) {
  const res = await fcl.query({
    // source: nft_catalog/get_collections.cdc
    cadence: `
import MetadataViews from 0xMetadataViews
import NFTCatalog from 0xNFTCatalog
import ViewResolver from 0xViewResolver

access(all) struct NFTCollection {
    access(all) let id: String
    access(all) let name: String
    access(all) let description: String
    access(all) let squareImage: String
    access(all) let bannerImage: String
    access(all) let externalURL: String
    access(all) let count: Number

    init(
        id: String,
        name: String,
        description: String,
        squareImage: String,
        bannerImage: String,
        externalURL: String,
        count: Number
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.squareImage = squareImage
        self.bannerImage = bannerImage
        self.externalURL = externalURL
        self.count = count
    }
}

access(all) fun main(ownerAddress: Address): {String: NFTCollection} {
    let account = getAccount(ownerAddress)
    let collections: {String: NFTCollection} = {}

    fun hasMultipleCollectionsFn(nftTypeIdentifier : String): Bool {
        let typeCollections = NFTCatalog.getCollectionsForType(nftTypeIdentifier: nftTypeIdentifier)!
        var numberOfCollections = 0
        for identifier in typeCollections.keys {
            let existence = typeCollections[identifier]!
            if existence {
                numberOfCollections = numberOfCollections + 1
            }
            if numberOfCollections > 1 {
                return true
            }
        }
        return false
    }

    NFTCatalog.forEachCatalogKey(fun (collectionIdentifier: String):Bool {
        // skip the Catalog entry for pre-Crescendo contract
        if collectionIdentifier == "SequelDigitalArt" {
          return true
        }

        let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!

        let collectionCap = account.capabilities.get<&{ViewResolver.ResolverCollection}>(value.collectionData.publicPath)

        if !collectionCap.check() {
            return true
        }

        // Check if we have multiple collections for the NFT type...
        let hasMultipleCollections = hasMultipleCollectionsFn(nftTypeIdentifier : value.nftType.identifier)

        var count : UInt64 = 0
        let collectionRef = collectionCap.borrow()!
        if !hasMultipleCollections {
            count = UInt64(collectionRef.getIDs().length)
        } else {
            for id in collectionRef.getIDs() {
                let nftResolver = collectionRef.borrowViewResolver(id: id)
                let nftViews = MetadataViews.getNFTView(id: id, viewResolver: nftResolver!)
                if nftViews.display!.name == value.collectionDisplay.name {
                    count = count + 1
                }
            }
        }

        if count != 0 {
            collections[collectionIdentifier] = NFTCollection(
                id: collectionIdentifier,
                name: value.collectionDisplay.name,
                description: value.collectionDisplay.description,
                squareImage: value.collectionDisplay.squareImage.file.uri(),
                bannerImage: value.collectionDisplay.bannerImage.file.uri(),
                externalURL: value.collectionDisplay.externalURL.url,
                count: count
            )
        }
        return true
    })

    return collections
}`,
    args: (arg, t) => [arg(addr, t.Address)]
  })

  return Array.from(Object.entries(res)).map(([id, col]) => ({
    id: id,
    name: col.name,
    type: 'source',
    summary: col.description,
    loaded: false,
    nftList: [],
    nftCount: parseInt(col.count)
  }))
}

export async function readNFTCollection(source, account) {
  const _currentInstance = currentInstance.get()

  let col
  let list
  switch (source) {
    case 'sequel':
      col = await getSequelDigitalArtCollection(account)
      list = Array.from(Object.entries(col)).map(([id, meta]) => ({
        token: parseInt(id),
        name: meta.name,
        source,
        account,
        asset: meta.asset,
        avatar: populateDigitalArtPreviewURLs({}, _currentInstance, meta.asset)
      }))
      break
    default:
      col = await getNFTCatalogCollection(account, source)
      list = col.map((item) => {
        return {
          token: parseInt(item.id),
          name: item.name,
          source,
          account,
          avatar: {
            url: item.thumbnail,
            previewUrl: item.thumbnail,
            staticUrl: item.thumbnail
          }
        }
      })
      break
  }

  console.log('NFT list: ', list)

  return list
}

export async function readSequelDigitalArtCollection(account) {
  const _currentInstance = currentInstance.get()

  const col = await getSequelDigitalArtCollection(account)

  return Array.from(Object.entries(col)).map(([id, meta]) => ({
    id: parseInt(id),
    name: meta.name,
    asset: meta.asset,
    content: populateDigitalArtPreviewURLs({}, _currentInstance, meta.asset)
  }))
}

async function getSequelDigitalArtCollection(addr) {
  return await fcl.query({
    cadence: `
      import DigitalArt from 0xDigitalArt

      access(all) fun main(address: Address): { UInt64: DigitalArt.Metadata } {
        let acct = getAccount(address)

        let res : { UInt64: DigitalArt.Metadata } = {}
        if let collection = acct.capabilities.borrow<&{DigitalArt.CollectionPublic}>(DigitalArt.CollectionPublicPath) {
          for id in collection.getIDs() {
            var da = collection.borrowDigitalArt(id: id)!
            if let view = da.resolveView(Type<DigitalArt.Metadata>()) {
              res[id] = view as! DigitalArt.Metadata
            }
          }
        }

        return res
      }`,
    args: (arg, t) => [arg(addr, t.Address)]
  })
}

async function getNFTCatalogCollection(addr, collectionID) {
  return await fcl.query({
    // source: nft_catalog/get_collection_tokens.cdc
    cadence: `
import MetadataViews from 0xMetadataViews
import NFTCatalog from 0xNFTCatalog

access(all) struct NFT {
    access(all) let id: UInt64
    access(all) let name: String
    access(all) let description: String
    access(all) let thumbnail: String
    access(all) let externalURL: String

    init(
        id: UInt64,
        name: String,
        description: String,
        thumbnail: String,
        externalURL: String
    ) {
        self.id = id
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.externalURL = externalURL
    }
}

access(all) fun main(ownerAddress: Address, collectionIdentifier: String): [NFT] {
    let account = getAuthAccount(ownerAddress)

    let value = NFTCatalog.getCatalogEntry(collectionIdentifier: collectionIdentifier)!
    let keyHash = String.encodeHex(HashAlgorithm.SHA3_256.hash(collectionIdentifier.utf8))
    let tempPathStr = "catalog".concat(keyHash)
    let tempPublicPath = PublicPath(identifier: tempPathStr)!

    let collectionCap = account.getCapability<&AnyResource{MetadataViews.ResolverCollection}>(tempPublicPath)

    if !collectionCap.check() {
        return []
    }

    fun hasMultipleCollectionsFn(nftTypeIdentifier : String): Bool {
        let typeCollections = NFTCatalog.getCollectionsForType(nftTypeIdentifier: nftTypeIdentifier)!
        var numberOfCollections = 0
        for identifier in typeCollections.keys {
            let existence = typeCollections[identifier]!
            if existence {
                numberOfCollections = numberOfCollections + 1
            }
            if numberOfCollections > 1 {
                return true
            }
        }
        return false
    }

    let views : [MetadataViews.NFTView] = []

    // Check if we have multiple collections for the NFT type...
    let hasMultipleCollections = self.hasMultipleCollections(nftTypeIdentifier : value.nftType.identifier)

    if collectionCap.check() {
        let collectionRef = collectionCap.borrow()!
        for id in collectionRef.getIDs() {
            let nftResolver = collectionRef.borrowViewResolver(id: id)
            let nftViews = MetadataViews.getNFTView(id: id, viewResolver: nftResolver!)
            if !hasMultipleCollections {
                views.append(nftViews)
            } else if nftViews.display!.name == value.collectionDisplay.name {
                views.append(nftViews)
            }

        }
    }

    let items: [NFT] = []

    for view in views {
        let displayView = view.display
        let externalURLView = view.externalURL

        if (displayView == nil || externalURLView == nil) {
            // Bad NFT. Skipping....
            continue
        }

        items.append(
            NFT(
                id: view.id,
                name: displayView!.name,
                description: displayView!.description,
                thumbnail: displayView!.thumbnail.uri(),
                externalURL: externalURLView!.url
            )
        )
    }

    return items
}
`,
    args: (arg, t) => [arg(addr, t.Address), arg(collectionID, t.String)]
  })
}
