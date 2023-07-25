
import { PostContainer } from '../Components/Post.jsx'
import { CreatePost } from '../Components/PostTool.jsx'
import { Stories } from '../Components/Story.jsx'
export const HomePage = () => {
    return (
        <div>
            <Stories></Stories>
            <CreatePost></CreatePost>
            <PostContainer></PostContainer>
        </div>
    )
}