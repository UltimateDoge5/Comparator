/** @type {import("tailwindcss").Config} */
module.exports = {
	content: [
		"./src/pages/**/*.tsx",
		"./src/components/**/*.tsx"
	],
	theme: {
		extend: {
			backgroundImage: {
				"gradient": "linear-gradient(153deg, rgba(3,105,161,1) 0%, rgba(0,8,13,1) 41%, rgba(0,0,0,1) 53%, rgba(109,40,217,1) 100%)"
			}
		}
	},
	plugins: []
};