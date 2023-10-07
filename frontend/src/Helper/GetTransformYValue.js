export const GetTransformYValue = (transformString) => {
    if (transformString.includes('translateY')) {
        const match = transformString.match(/translateY\((-?\d+\.?\d*)px\)/);
        if (match) {
            return parseFloat(match[1]);
        }
    }
    return null;
}
