import {
    CREATE_Comment,
    DELETE_Comment,
    DELETE_Post,
    EDIT_Comment,
    POST_CreateNewPost,
    SEND_React,
    UNDO_REACT,
} from '../Helper/Axios';
import { ENTITY } from '../Enums/Entity';
import { CloseDialog } from '../Reducers/UI';
import { GetAttachmentType } from '../Helper/GetAttachmentType';
import { getVideoFirstFrame } from '../Helper/GetVideoFirstFrame';
import { fetchPosts, fetchPostsThunk } from '../Reducers/Posts';

const findParentComment = (comment, parent_id) => {
    if (!comment) return null;

    if (comment.id === parent_id) {
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

export const undoReactThunk =
    ({entity, entity_type, reaction_id}, updateEntity) => async (dispatch, getState) => {

        const [statusCode, err] = await UNDO_REACT({id: reaction_id, entity_type} );
        if (!err && statusCode === 200) {
            if (entity_type === ENTITY.POST) {
                const post = {...entity, reactions: entity.reactions.filter(reaction => reaction.id !== reaction_id)}

                dispatch(updateEntity(post));
            }
            if (entity_type === ENTITY.COMMENT) {
                    const comment = {...entity};
                    comment.reactions = comment.reactions.filter(
                        (reaction) => reaction.id !== reaction_id
                    );
                    dispatch(updateEntity(comment));
            }
            if(entity_type === ENTITY.MESSAGE){

                const message = {...entity};
                message.reactions = message.reactions.filter(
                    (reaction) => reaction.id !== reaction_id
                );
                dispatch(updateEntity(message));
            }
        }
    };
export const reactToPostThunk = (post, ra, updatePost) => async (dispatch) => {
    let [reaction, err] = await SEND_React(ra);
    if (!err) {
        post.reactions = [...post.reactions, reaction]
        dispatch(updatePost(post));
    }
};
export const reactToCommentThunk =
    (comment, sendReactionDTO, updateComment) => async (dispatch) => {
        const [reaction, err] = await SEND_React(sendReactionDTO);
        if (!err) {
            comment.reactions = [...comment.reactions, reaction]
            dispatch(updateComment(comment));
        }
    };
export const deletePostThunk = (post_id, removePost, notify) => async (dispatch) => {
    const [statusCode, err] = await DELETE_Post(post_id);

    if (statusCode === 200)
    {
        dispatch(removePost(post_id));
        notify.open({
            message: 'Xóa bài viết thành công',
            type: 'success',
            placement: 'bottomLeft',
            duration: 5
        })
    }

    else {
        notify.open({
            message: err.response.data.Message,
            type: 'error',
            placement: 'bottomLeft',
            duration: 5
        })
    }
};

export const commentThunk = (comment, addComment, notify) => async (dispatch) => {
    let response = await CREATE_Comment(comment);
    let _comment = response.data;
    //for finding which post to udpate in reducer
    _comment.post_id = comment.post_id;
    _comment.parent_id = comment.parent_id;

    if (response.status === 200) dispatch(addComment(_comment));
    else
        notify.open({
            message: 'Bình luận không thành công',
            type: 'error',
            placement: 'bottomLeft',
            duration: 5
        })
};
export const deleteCommentThunk = (comment, post,removeComment, notify) => async (dispatch) => {
    const [statusCode, err] = await DELETE_Comment(comment.id);
    if (err) {
        notify.open({
            message: 'Xóa bình luận không thành công',
            type: 'error',
            placement: 'bottomLeft',
            duration: 5
        })
    } else {
        notify.open({
            message: 'Xóa bình luận thành công',
            type: 'success',
            placement: 'bottomLeft',
            duration: 5
        });

        [comment,...getCascadeComments(comment)].forEach((c) => {
            dispatch(removeComment({ comment_id: c.id,post_id:  post.id }));
        })
    }
};
export const editCommentThunk = (comment, updateComment, notify) => async (dispatch) => {
    const [newComment, err] = await EDIT_Comment(comment);
    if (err) {
        notify.open({
            message: 'Chỉnh sửa bình luận không thành công',
            type: 'error',
            placement: 'bottomLeft',
            duration: 5
        })
    } else {
        dispatch(updateComment(newComment));
        notify.open({
            message: 'Chỉnh sửa bình luận thành công',
            type: 'success',
            placement: 'bottomLeft',
            duration: 5
        })
    }
};

export const createNewPostThunk = ({content, attachments}, notify) => async (dispatch, getState) => {
    let _attachments = [...attachments];
    let videos = _attachments.filter((attachment) => GetAttachmentType(attachment) === "video");
    let images = _attachments.filter((attachment) => GetAttachmentType(attachment) === "image");
    let thumbnails = await Promise.all(videos.map(async (video) => {
        return await getVideoFirstFrame(video, "blob");
    }))
    let [statusCode,error] = await POST_CreateNewPost({content, videos, images, thumbnails})
    dispatch(CloseDialog());
    dispatch(fetchPostsThunk(fetchPosts))
    if (statusCode === 200) {
        notify.open({
            message: 'Tạo post thành công',
            type: 'success',
            placement: 'bottomLeft',
            duration: 5
        })
    } else
        notify.open({
            message: 'Tạo post không thành công',
            type: 'error',
            placement: 'bottomLeft',
            duration: 5
        })
};
