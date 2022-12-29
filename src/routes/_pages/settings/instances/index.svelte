<script>
  import { isUserLoggedIn, loggedInInstancesAsList } from '../../../_store/local'
  import { switchToInstance } from '../../../_actions/instances'
  import SettingsLayout from '../../../_components/settings/SettingsLayout.svelte'
  import SettingsList from '../../../_components/settings/SettingsList.svelte'
  import SettingsListRow from '../../../_components/settings/SettingsListRow.svelte'
  import SettingsListButton from '../../../_components/settings/SettingsListButton.svelte'
  import SvgIcon from '../../../_components/SvgIcon.svelte'
  import RadioGroup from '../../../_components/radio/RadioGroup.svelte'
  import RadioGroupButton from '../../../_components/radio/RadioGroupButton.svelte'
  import { formatIntl } from '../../../_utils/formatIntl'

  // suppress warnings
  export let params
  params = undefined

  function onSwitchToThisInstance (e, instanceName) {
    e.preventDefault();
    e.stopPropagation();
    switchToInstance(instanceName);
  }

  $: instanceStates = ( (list) => list.map(({ name, current, access_token }, index) => ({
            index,
            current,
            name,
            displayName: access_token ? name : `${name} (visitor)`,
            label: formatIntl('intl.currentInstanceLabel', { instance: name, current }),
            switchLabel: formatIntl('intl.switchToNameOfInstance', { instance: name })
          }))
  )($loggedInInstancesAsList)
</script>

<SettingsLayout page='settings/instances' label="{intl.instances}">
  <h1>{intl.instances}</h1>

  {#if $isUserLoggedIn}
    <p>{intl.instancesYouveLoggedInTo}</p>
    <RadioGroup id="instance-switch" label="{intl.switchToInstance}" length={$loggedInInstancesAsList.length}>
      <SettingsList label="{intl.instances}">
        {#each instanceStates as instance}
        <SettingsListRow>
          <SettingsListButton className="instance-switcher-instance-name"
                              href="/settings/instances/{instance.name}"
                              label={instance.displayName}
                              ariaLabel={instance.label} />
          <div class="instance-switcher-button-wrapper">
            <RadioGroupButton
                    id="instance-switch"
                    className="instance-switcher-button"
                    label={instance.switchLabel}
                    checked={instance.current}
                    index={instance.index}
                    on:click="{ (event) => onSwitchToThisInstance(event, instance.name) }">
              <SvgIcon className="instance-switcher-button-svg"
                       href={instance.current ? '#fa-star' : '#fa-star-o'} />
            </RadioGroupButton>
          </div>
        </SettingsListRow>
        {/each}
      </SettingsList>
    </RadioGroup>
    <p>
      <a data-sveltekit-preload-data href="/settings/instances/add" id="log-in-link-1">{intl.addAnotherInstance}</a>
    </p>
  {:else}
    <p>{intl.youreNotLoggedIn}</p>
    <p>
      {intl.logInToAnInstancePre}
      <a data-sveltekit-preload-data href="/settings/instances/register" id="log-in-link-2">{intl.signUpToAnInstanceText}</a>
      {intl.logInToAnInstanceOr}
      <a data-sveltekit-preload-data href="/settings/instances/add" id="log-in-link-3">{intl.logInToAnInstanceText}</a>
      {intl.logInToAnInstancePost}
    </p>
  {/if}
</SettingsLayout>
<style>
  :global(.instance-switcher-instance-name) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .instance-switcher-button-wrapper {
    position: relative;
    border: 1px solid var(--settings-list-item-border);
    min-width: 44px;
  }
  :global(.instance-switcher-button) {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    border: none;
    background: none;
    align-items: center;
    justify-content: center;
    margin: 1px;
  }
  :global(.instance-switcher-button-svg) {
    width: 24px;
    height: 24px;
    display: inline-block;
    fill: var(--svg-fill);
  }
</style>
