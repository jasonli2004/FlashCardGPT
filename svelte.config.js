import adapter from '@sveltejs/adapter-auto';
import sveltePreprocess from 'svelte-preprocess';

const config = {
	kit: {
		adapter: adapter()
	},
	preprocess: sveltePreprocess({
		typescript: true,
		// This is where you'd add configurations for preprocessors
		// For example, for SCSS support:
		// scss: {
		//   prependData: `@import 'src/variables.scss';`
		// },
	})
};

export default config;
