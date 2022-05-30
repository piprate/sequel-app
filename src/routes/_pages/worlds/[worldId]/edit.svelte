<script>
  import WorldEdit from "../../../_components/world/WorldEdit.svelte";
  import DynamicPageBanner from "../../../_components/DynamicPageBanner.svelte";
  import RestrictedPageWarning from '../../../_components/RestrictedPageWarning.svelte'
  import { onMount } from "svelte";
  import { clearComposeData, isAuthenticated, setComposeData } from "../../../_store/local";
  import { loadWorld } from "../../../_actions/worlds";

  export let params;

  // suppress warnings
  const intl = {};

  let realm = `world/${params.worldId}`;
  let template;

  function setComposeImage (world, field) {
    const obj = {
      data: world[field],
      url: world[field].url,
      previewUrl: world[field].previewUrl,
      description: ''
    };
    setComposeData(realm, {
      [field]: obj
    });
  }

  onMount(async () => {
    if (!$isAuthenticated) {
      return
    }

    const world = await loadWorld(params.worldId);
    console.log("LOADED WORLD", world);

    template = {
      name: world.name,
      summary: world.summary,
    };

    clearComposeData(realm);

    if (world.avatar) {
      setComposeImage(world, 'avatar');
      setComposeData(realm, { avatarPresent: true });
    }

    if (world.header) {
      setComposeImage(world, 'header');
      setComposeData(realm, { headerPresent: true });
    }
  });
</script>
<DynamicPageBanner title="{intl.editWorld}" />
{#if $isAuthenticated }
    {#if template}
        <WorldEdit {realm} newWorld={false} worldId={params.worldId} {template} />
    {/if}
{:else}
    <RestrictedPageWarning />
{/if}