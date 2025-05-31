import config from 'eslint-config-xo';
import { defineConfig } from 'eslint/config';

export default defineConfig([
	config,
	[
		{
			rules: {
				camelcase: ["error", { properties: "never" }],
				semi: ["error", "always"],
			},
			parser: '@typescript-eslint/parser',
		},
	]
]);
