import { createSlice } from '@reduxjs/toolkit';
import { ENTITY } from '../Enums/Entity.js';
import { Severity } from '../Enums/FetchState.js';
import {
    CREATE_Comment,
    DELETE_Comment,
    DELETE_Post,
    EDIT_Comment,
    GET_Posts,
    POST_CreateNewPost,
    SEND_React,
    UNDO_REACT,
    UPLOAD_Attachments,
} from '../Helper/Axios.js';
import {
    CloseDialog,
    ShowNotification,
} from './UI.js';

export const FETCH_POSTS = 'FETCH_POSTS';




const postSlice = createSlice({
     name: 'posts',
     initialState: [],
     reducers:{
            fetchPosts: (state, action) => {
                return action.payload;
            },
            addComment: (state, action) => {
                    state.map((post) => {
                        if (post.id == action.payload.post_id) {
                            post.comments = [...post.comments, action.payload];
                        }
                        return post;
                    })
            },
            removeComment: (state, action) => {
                state.map((post) => {
                        if (post.id == action.payload.post_id) {
                            post.comments = [
                                ...post.comments.filter(
                                    (comment) =>
                                        comment.id != action.payload.comment_id
                                ),
                            ];
                        }
                        return post;
                    })
               
            },
            updateComment: (state, action) => {
                state.map((post) => {
                        if (post.id == action.payload.post_id) {
                            post.comments = [
                                ...post.comments.map((comment) => {
                                    if (comment.id == action.payload.id)
                                        comment = action.payload;
                                    return comment;
                                }),
                            ];
                        }
                        return post;
                    })
                
            },
            updatePost: (state, action) => {
                state.map((post) => {
                        if (post.id == action.payload.id) {
                            post.reactions = action.payload.reactions;
                        }
                        return post;
                    })
                
            }
     }
})
const findParentComment = (comment, parent_id) => {
    if (!comment) return null;

    if (comment.id == parent_id) {
        return comment;
    }
    if (!comment.childrens) return null;
    for (let i = 0; i < comment.childrens.length; i++) {
        let ans = findParentComment(comment.childrens[i], parent_id)
        if (ans) {
            return ans;
        };
    }
    return null;
}

const toNestedComments =(comments) => {
    let dict = {} // dictionary
    let sorted = [...comments];
    if (comments.length > 0) {
        sorted.sort((a, b) => a.id - b.id);
        sorted.forEach((comment) => {
            comment = { ...comment, childrens: [] };
            let parent = null;
            Object.keys(dict).some((key) => {
                parent = findParentComment(dict[key], comment.parent_id);
                if (parent) return true;
                //break the loop when parent is found
            })

            if (parent == null) {
                // comment is root
                dict[comment.id] = comment
            }
            else {
                // comment is child
                parent.childrens.push(comment);
            }

        })
    }
    return Object.values(dict) ?? [];
}

const getCascadeComments = (comment) => {
    let cascadeComments = [];
    if (comment.childrens.length > 0) {
        comment.childrens.forEach((child) => {
            cascadeComments = [
                ...cascadeComments,
                child,
                ...getCascadeComments(child),
            ];
        });
    }
    return cascadeComments;
}
export const fetchPostsThunk = () => async (dispatch) => {
    const response = await GET_Posts(FETCH_POSTS);
    // response.data.forEach((post) => {
    //     post.comments = toNestedComments(post.comments);
    // })
    // console.log(response.data[0]);
    if(response.status === 200)
    dispatch(fetchPosts(response.data));
}
export const undoReactThunk =
    (entity, reaction_id) => async (dispatch, getState) => {
        const [statusCode, err] = await UNDO_REACT(reaction_id);
        if (!err && statusCode === 200) {
            if (entity.type == ENTITY.POST) {
                const p = getState().posts.find(post => post.id == entity.id);
                const post = {...p, reactions: p.reactions.filter(reaction => reaction.id != reaction_id)}
                dispatch(updatePost(post));
            }
            if (entity.type == ENTITY.COMMENT) {
                const post = getState().posts.find(
                    (post) => post.id == entity.post_id
                ); //entity.id is comment.id
                console.log(post);
                if (post != null) {
                    const comment = {...post.comments.find(
                        (comment) => comment.id == entity.id
                    )};
                    comment.reactions = comment.reactions.filter(
                        (reaction) => reaction.id != reaction_id
                    );
                    dispatch(updateComment(comment));
                }
            }
        }
    };
export const reactToPostThunk = (post, reaction) => async (dispatch) => {
    let [reaction, err] = await SEND_React(reaction);
    if (!err) {
        post.reactions = [...post.reactions, reaction]
        dispatch(updatePost(post));
    }
};
export const reactToCommentThunk =
    (comment, sendReactionDTO) => async (dispatch) => {
        const [reaction, err] = await SEND_React(sendReactionDTO);
        if (!err) {
            comment.reactions = [...comment.reactions, reaction]
            dispatch(updateComment(comment));
        }
    };
export const deletePostThunk = (post_id) => async (dispatch) => {
    const [statusCode, err] = await DELETE_Post(post_id);
    dispatch(fetchPostsThunk());
    if (statusCode === 200)
        dispatch(
            ShowNotification({
                content: 'Xóa bài viết thành công',
                severity: Severity.SUCCESS,
            })
        );
    else {
        dispatch(
            ShowNotification({
                content: 'Xóa bài viết không thành công',
                severity: Severity.ERROR,
            })
        );
    }
};
export const uploadAttachmentsThunk = (files) => async (dispatch) => {
    let [attachments, err] = await UPLOAD_Attachments(files);
    if (err)
        dispatch(
            ShowNotification({
                content:
                    'Có lỗi xảy ra trong quá trình xử lí, vui lòng thử lại!',
                severity: Severity.ERROR,
            })
        );
    return [attachments, err];
};
export const commentThunk = (comment) => async (dispatch) => {
    let response = await CREATE_Comment(comment);
    console.log(response.data)
    let _comment = response.data;
    //for finding which post to udpate in reducer
    _comment.post_id = comment.post_id;
    _comment.parent_id = comment.parent_id;
    console.log(_comment);
    if (response.status === 200) dispatch(addComment(_comment));
    else
        dispatch(
            ShowNotification({
                content:
                    'Có lỗi xảy ra trong quá trình xử lí, vui lòng thử lại!',
                severity: Severity.ERROR,
            })
        );
};
export const deleteCommentThunk = (comment, post) => async (dispatch) => {
    const [statusCode, err] = await DELETE_Comment(comment.id);
    if (err) {
        dispatch(
            ShowNotification({
                content: 'Không thể xóa bình luận, vui lòng thử lại!',
                severity: Severity.ERROR,
            })
        );
        return;
    } else {
        dispatch(
            ShowNotification({
                content: 'Xóa bình luận thành công !',
                severity: Severity.SUCCESS,
            })
        );
        console.log(getCascadeComments(comment));
        [comment,...getCascadeComments(comment)].forEach((c) => {
            dispatch(removeComment({ comment_id: c.id,post_id:  post.id }));
        })
    }
};
export const editCommentThunk = (comment) => async (dispatch) => {
    const [newComment, err] = await EDIT_Comment(comment);
    if (err) {
        dispatch(
            ShowNotification({
                content: 'Không thể chỉnh sửa bình luận, vui lòng thử lại!',
                severity: Severity.ERROR,
            })
        );
        return;
    } else {
        dispatch(updateComment(newComment));
        dispatch(
            ShowNotification({
                content: 'Chỉnh sửa bình luận thành công !',
                severity: Severity.SUCCESS,
            })
        );
    }
};

export const createNewPostThunk = (post) => async (dispatch, getState) => {
    var res = (await POST_CreateNewPost(post)).status;
    dispatch(CloseDialog());
    dispatch(fetchPostsThunk())
    if (res === 200) {
        dispatch(
            ShowNotification({
                content: 'Post đã tạo thành công',
                severity: Severity.SUCCESS,
            })
        );
    } else
        dispatch(
            ShowNotification({
                content: 'Tạo post không thành công',
                severity: Severity.ERROR,
            })
        );
};

export const { fetchPosts, addComment, removeComment, updateComment, updatePost } = postSlice.actions;
export default postSlice.reducer;
