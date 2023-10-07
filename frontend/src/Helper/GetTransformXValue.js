export const GetTransformXValue = (transformString) => {
    if (transformString.includes('translateX')) {
        const match = transformString.match(/translateX\((-?\d+\.?\d*)px\)/);
        if (match) {
            return parseFloat(match[1]);
        }
    }
    return null;
};