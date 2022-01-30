const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./src/components/*.{js,jsx,ts,tsx}", "./public/index.html"],
	darkMode: "class", // or 'media' or 'class'
	plugins: [require("@tailwindcss/aspect-ratio")],
};
