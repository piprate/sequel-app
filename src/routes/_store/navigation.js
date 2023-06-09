import { derived } from 'svelte/store'
import { lists, pinnedPage } from './instance'
import { transientStore } from './base'

export const currentPage = transientStore('home')

export const pinnedListTitle = derived([lists, pinnedPage], ([$lists, $pinnedPage]) => {
  if (!$pinnedPage.startsWith('/lists')) {
    return
  }
  const listId = $pinnedPage.split('/').slice(-1)[0]
  const list = $lists.find((_) => _.id === listId)
  return list ? list.title : ''
})

export const navPages = derived([pinnedPage, pinnedListTitle], ([$pinnedPage, $pinnedListTitle]) => {
  let pinnedPageObject
  if ($pinnedPage === '/subscriptions') {
    pinnedPageObject = {
      name: 'subscriptions',
      href: '/subscriptions',
      svg: '#fa-newspaper-o',
      label: 'intl.subscriptions'
    }
  } else if ($pinnedPage === '/worlds') {
    pinnedPageObject = {
      name: 'worlds',
      href: '/worlds',
      svg: '#fa-globe',
      label: 'intl.worlds'
    }
  } else if ($pinnedPage === '/bubbles') {
    pinnedPageObject = {
      name: 'bubbles',
      href: '/bubbles',
      svg: '#fa-comments',
      label: 'intl.bubbles'
    }
  } else if ($pinnedPage === '/sparks') {
    pinnedPageObject = {
      name: 'sparks',
      href: '/sparks',
      svg: '#fa-star',
      label: 'intl.sparks'
    }
  } else if ($pinnedPage === '/marketplace') {
    pinnedPageObject = {
      name: 'marketplace',
      href: '/marketplace',
      svg: '#nft-diamond',
      label: 'intl.marketplace'
    }
  } else if ($pinnedPage === '/assets') {
    pinnedPageObject = {
      name: 'assets',
      href: '/assets',
      svg: '#fa-bicycle',
      label: 'intl.assets'
    }
  } else if ($pinnedPage === '/studio') {
    pinnedPageObject = {
      name: 'studio',
      href: '/studio',
      svg: '#fa-paint-brush',
      label: 'intl.studio'
    }
  } else if ($pinnedPage === '/bookmarks') {
    pinnedPageObject = {
      name: 'bookmarks',
      href: '/bookmarks',
      svg: '#fa-bookmark',
      label: 'intl.bookmarks'
    }
  } else if ($pinnedPage.startsWith('/lists/')) {
    pinnedPageObject = {
      name: `lists/${pinnedPage.split('/').slice(-1)[0]}`,
      href: pinnedPage,
      svg: '#fa-bars',
      label: $pinnedListTitle
    }
  }

  return [
    {
      name: 'home',
      href: '/',
      svg: '#sequel-logo',
      label: 'intl.home'
    },
    {
      name: 'notifications',
      href: '/notifications',
      svg: '#fa-bell',
      label: 'intl.notifications'
    },
    pinnedPageObject,
    {
      name: 'community',
      href: '/community',
      svg: '#fa-folder-open',
      label: 'intl.community'
    },
    {
      name: 'search',
      href: '/search',
      svg: '#fa-search',
      label: 'intl.search'
    },
    {
      name: 'settings',
      href: '/settings',
      svg: '#fa-gear',
      label: 'intl.settings'
    }
  ]
})
