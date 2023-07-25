const Color = require('./src/Enums/Color.js');
const colors = require('tailwindcss/colors.js');
/** @type {import('tailwindcss').Config} */
var colorSaveList = [];
for (const key in Color) {
    colorSaveList.push(`text-[${Color[key]}]`);
    colorSaveList.push(`bg-[${Color[key]}]`);
    colorSaveList.push(`hover:bg-[${Color[key]}]`);
    colorSaveList.push(`border-l-[${Color[key]}]`);
    colorSaveList.push(`border-r-[${Color[key]}]`);
    colorSaveList.push(`border-b-[${Color[key]}]`);
    colorSaveList.push(`border-t-[${Color[key]}]`);
}
const safeClass = ['qinqii-thin-shadow'];
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    safelist: [...colorSaveList, ...safeClass],
    theme: {
        extend: {},
    },
    plugins: [],
};
