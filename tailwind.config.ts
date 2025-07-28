/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        // Add other folders as needed
    ],
    theme: {
        extend: {
            colors: {
                custom: {
                    primary: "rgb(var(--custom-primary) / <alpha-value>)",
                    hover: "rgb(var(--custom-primary-hover) / <alpha-value>)",
                    custom_white: "rgb(var(--custom-white) / <alpha-value>)",
                    greenBoreal:
                        "rgb(var(--custom-green-boreal) / <alpha-value>)",
                },
            },
        },
    },
    plugins: [],
};
