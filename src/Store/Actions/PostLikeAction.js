import {POST_LIKE} from '../Types/actions_type';

const PostLikeAction = {
    postLike: data => {
    return {
      type: POST_LIKE,
      payload: data,
    };
  },
  
};

export default PostLikeAction;
