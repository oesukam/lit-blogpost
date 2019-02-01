import moment from 'moment';
import { Op } from 'sequelize';
import { Post, User } from '../database/models';

export default class PostController {
  static async viewPost(req, res) {
    const { currentUser = {} } = req.body;
    const { postId } = req.params;
    const protectedStatus = ['draft', 'unpublished'];
    const post = await Post.findOne({
      include: [{ model: User, attributes: { exclude: ['password'] } }],
      where: { id: postId },
      status: { [Op.not]: 'deleted' }
    });
    if (!post) {
      return res.status(404).json({ status: 404, message: 'The post does not exist' });
    }

    // Checks if the user is not admin and if the post is a draft or unpublished post from another user
    if (
      post.get().userId !== currentUser.id &&
      currentUser.userType !== 'admin' &&
      protectedStatus.indexOf(post.get().status) > -1
    ) {
      return res.status(404).json({ status: 404, message: 'Unauthorized access' });
    }

    return res.status(200).json({ status: 200, data: post.get() });
  }

  static async deletePost(req, res) {
    const { currentUser } = req.body;
    const { postId } = req.params;

    const post = await Post.findOne({ where: { id: postId } });
    if (!post) {
      return res.status(404).json({ status: 404, message: 'The post does not exist' });
    }

    if (post.get().userId !== currentUser.id) {
      return res.status(404).json({ status: 404, message: 'Unauthorized action' });
    }

    if (post.get().status === 'deleted') {
      return res.status(404).json({ status: 404, message: 'Post had already been deleted' });
    }

    await post.update({ status: 'deleted', updatedAt: moment().format() });

    return res.status(200).json({ status: 200, message: 'The post was deleted successfully' });
  }
}