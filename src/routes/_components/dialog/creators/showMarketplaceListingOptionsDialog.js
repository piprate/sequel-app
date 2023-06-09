import MarketplaceListingOptionsDialog from '../components/MarketplaceListingOptionsDialog.svelte'
import { showDialog } from './showDialog'

export default function showMarketplaceListingOptionsDialog(listing, relationship, ourSpark) {
  return showDialog(MarketplaceListingOptionsDialog, {
    label: 'intl.marketplaceListingOptions',
    title: '',
    listing: listing,
    relationship: relationship,
    ourSpark: ourSpark
  })
}
