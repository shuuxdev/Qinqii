import { Severity } from '../Enums/FetchState.js';
import {
    CREATE_Comment,
    DELETE_Comment,
    DELETE_Post,
    EDIT_Comment,
    POST_CreateNewPost,
    SEND_React,
    UPLOAD_Attachments,
} from '../Helper/Axios.js';
import fetchDataThunk from '../Thunks/fetchDataThunk.js';
import {
    CLOSE_CREATE_POST_DIALOG,
    CloseDialog,
    ShowNotification,
} from './UI.js';

export const FETCH_POSTS = 'FETCH_POSTS';

const DELETE_POST = 'DELETE_POST';
const ADD_COMMENT = 'ADD_COMMENT';
const REMOVE_COMMENT = 'REMOVE_COMMENT';
const UPDATE_COMMENT = 'UPDATE_COMMENT';
const AddNewCommentAction = (comment) => ({
    type: ADD_COMMENT,
    payload: comment,
});
const RemoveCommentAction = ({ comment_id, post_id }) => ({
    type: REMOVE_COMMENT,
    payload: { comment_id, post_id },
});
const UpdateCommentAction = (comment) => ({
    type: UPDATE_COMMENT,
    payload: comment,
});
const Reducer = (state = [], action) => {
    switch (action.type) {
        case FETCH_POSTS:
            return action.payload;
        case ADD_COMMENT:
            return [
                ...state.map((post) => {
                    if (post.id == action.payload.post_id) {
                        post.comments = [...post.comments, action.payload];
                    }
                    return post;
                }),
            ];
        case REMOVE_COMMENT:
            return [
                ...state.map((post) => {
                    if (post.id == action.payload.post_id) {
                        post.comments = [
                            ...post.comments.filter(
                                (comment) =>
                                    comment.id != action.payload.comment_id
                            ),
                        ];
                    }
                    return post;
                }),
            ];
        case UPDATE_COMMENT:
            return [
                ...state.map((post) => {
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
                }),
            ];

        default:
            return state;
    }
};
export const undoReactTo = (reaction_id) => {};
export const reactToPostThunk =
    (post_id, sendReactionDTO) => async (dispatch) => {
        const [reaction, err] = await SEND_React(sendReactionDTO);
        if (!err) {
            dispatch(FETCH_POSTS);
        }
    };
export const reactToCommentThunk =
    (comment, sendReactionDTO) => async (dispatch) => {
        const [reaction, err] = await SEND_React(sendReactionDTO);
        if (!err) {
            comment.reactions.push(reaction);
            dispatch(UpdateCommentAction(comment));
        }
    };
export const deletePostThunk = (post_id) => async (dispatch) => {
    const [statusCode, err] = await DELETE_Post(post_id);
    dispatch(fetchDataThunk(FETCH_POSTS));
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
    let _comment = response.data;
    //for finding which post to udpate in reducer
    _comment.post_id = comment.post_id;
    if (response.status === 200) dispatch(AddNewCommentAction(_comment));
    else
        dispatch(
            ShowNotification({
                content:
                    'Có lỗi xảy ra trong quá trình xử lí, vui lòng thử lại!',
                severity: Severity.ERROR,
            })
        );
};
export const deleteCommentThunk = (comment_id, post_id) => async (dispatch) => {
    const [statusCode, err] = await DELETE_Comment(comment_id);
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
        dispatch(RemoveCommentAction({ comment_id, post_id }));
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
        dispatch(UpdateCommentAction(newComment));
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

export default Reducer;
