export const GetTransformYValue = (transformString) => {
    if (transformString.includes('translateY')) {
        const match = transformString.match(/translateY\((-?\d+\.?\d*)px\)/);
        if (match) {
            return parseFloat(match[1]);
        }
    }
    return null;
}
export const GetTransformXValue = (transformString) => {
    if (transformString.includes('translateX')) {
        const match = transformString.match(/translateX\((-?\d+\.?\d*)px\)/);
        if (match) {
            return parseFloat(match[1]);
        }
    }
    return null;
}
