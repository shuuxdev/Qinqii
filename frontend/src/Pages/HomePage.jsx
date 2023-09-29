
import { CreatePost } from '../Components/Post/PostTool.jsx'
import { Stories } from '../Components/Story/StoryCard.jsx'
import { memo } from 'react';
import { PostContainer } from '../Components/Post/PostContainer';
export const HomePage = memo(() => {
    console.log('re-render the entire page');

    return (
        <div>
            <Stories></Stories>
            <CreatePost></CreatePost>
            <PostContainer></PostContainer>
        </div>
    )
})