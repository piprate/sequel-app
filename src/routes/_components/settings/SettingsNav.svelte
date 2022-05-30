<script>
  import SettingsNavItem from './SettingsNavItem.svelte'
  import { isUserLoggedIn } from '../../_store/local'

  export let page;
  export let label;

  $: navItemLabels = ({
    settings: 'intl.settings',
    'settings/about': 'intl.aboutApp',
    'settings/general': 'intl.general',
    'settings/instances': 'intl.instances',
    'settings/instances/add': $isUserLoggedIn ? 'intl.addInstance' : 'intl.logIn'
  })

  $: navItems = ((page, navItemLabels) => {
    const res = []
    const breadcrumbs = page.split('/')
    let path = ''
    for (let i = 0; i < breadcrumbs.length - 1; i++) {
      const currentPage = breadcrumbs[i]
      path += currentPage
      res.push({
        label: navItemLabels[path],
        href: `/${path}`,
        name: path
      })
      path += '/'
    }
    return res
  })(page, navItemLabels)
</script>

<nav class="settings-nav">
  <ul>
    {#each navItems as navItem}
    <li>
      <SettingsNavItem {page} name={navItem.name} href={navItem.href} label={navItem.label} />
    </li>
    {/each}
    <li>
      <SettingsNavItem {page} name={page} href="/{page}" {label} />
    </li>
  </ul>
</nav>

<style>
  .settings-nav ul {
    margin: 20px 20px;
    padding: 0;
    list-style: none;
  }

  .settings-nav li {
    margin: 5px 0;
    font-size: 1em;
    display: inline-block;
  }

  .settings-nav li::after {
    content: '>';
    margin: 0 15px;
    color: var(--anchor-text);
  }

  .settings-nav li:last-child::after {
    content: '';
    margin-left: 0;
    font-size: 1em;
  }

</style>
