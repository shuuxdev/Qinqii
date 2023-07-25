const { useEffect } = require("react");
const { useState } = require("react")

export const useFetch = ({src = null, option = null}) => {
    const [state, setState] = useState();
    useEffect(() => {
        fetch(src, option).then(res => res.json())
        .then(data => setState(data));
    },[src,option])
    return state;
}
export default useFetch