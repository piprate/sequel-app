import * as sapper from '@sapper/app';
import './routes/_utils/serviceWorkerClient'
import './routes/_utils/historyEvents'
import './routes/_utils/loadingMask'
import './routes/_utils/forceOnline'
import { mark, stop } from './routes/_utils/marks'
import { loadPolyfills } from './routes/_utils/polyfills/loadPolyfills'
import { loadNonCriticalPolyfills } from './routes/_utils/polyfills/loadNonCriticalPolyfills'

mark('loadPolyfills')
loadPolyfills().then(() => {
	stop('loadPolyfills')
	mark('sapperStart')
	sapper.start({
		target: document.querySelector('#sapper')
	});
	stop('sapperStart')
	/* no await */ loadNonCriticalPolyfills()
})

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
