<script>
	import Nav from './_components/Nav.svelte';
	import InformationalFooter from './_components/InformationalFooter.svelte'
	import { isUserLoggedIn} from './_store/local'
	import { currentPage } from './_store/navigation'

	export let segment = 'home';

	let infiniteScrollPage;
	$: infiniteScrollPage = $isUserLoggedIn && segment && !segment.startsWith('settings');

	$: {
		segment = segment || 'home';
		currentPage.set(segment)
	}
</script>

<style>
	/* this avoids a flash of the background color when switching timelines */
	.infinite-scroll-page {
		min-height: 100vh;
	}
</style>

<Nav {segment}/>

<div class="main-content">
	<main class="{infiniteScrollPage ? 'infinite-scroll-page' : ''}">
		<slot></slot>
	</main>
	{#if !$isUserLoggedIn && segment === 'home'}
		<InformationalFooter />
	{/if}
</div>