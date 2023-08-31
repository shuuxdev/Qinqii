import { Text } from "./CommonComponent.jsx"

export const Reply = ({ comment, index, onClick }) => {

    return (

        <div onClick={onClick}>
            <Text>Reply</Text>
        </div>)
}
