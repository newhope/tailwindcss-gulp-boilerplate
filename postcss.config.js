let config = {
	plugins: [
		require('postcss-import'),
		require('tailwindcss/nesting'),
		require('tailwindcss'),
		require('autoprefixer'),
	] 
};

if (process.env.NODE_ENV == 'production') {
	// Minify CSS + remove all comments
	config.plugins.push(require('cssnano')({
		preset: ["default", {
			discardComments: {
				removeAll: true
			}
		}],
	}));
}


module.exports = config
