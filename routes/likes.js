const express = require('express');
const { Posts, Users, Likes } = require("../models");
const { Op } = require("sequelize");
const sequelize = require('sequelize');
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();


router.put("/:postId/like", authMiddleware, async (req, res) => {
    try {
      const { userId } = res.locals.user;
      const { postId } = req.params;
  
      const getExistPost = await Posts.findOne({ where: { postId } });
      if (!getExistPost) {
        return res.status(404).json({ errorMessage: "게시글이 존재하지 않습니다." });
      } 
  
      const getExistLike = await Likes.findOne({
        where: {
          [Op.and]: [{ PostId: postId }, { UserId: userId }]
        }
      });
  
      if (!getExistLike) {
        await Likes.create({ PostId: postId, UserId: userId });
        return res.status(200).json({ message: "게시글의 좋아요를 등록하였습니다." });
      } else {
        await Likes.destroy(
          {
            where: {
              [Op.and]: [{ PostId: postId }, { UserId: userId }]
            }
          }
        );
        return res.status(200).json({ message: "게시글의 좋아요를 취소하였습니다." });
      };
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: "게시글 좋아요에 실패하였습니다." });
    }
  });

  router.get("/like", authMiddleware, async (req, res) => {
    try {
      const { userId } = res.locals.user;
  
      // 좋아요 한 게시글의 postId 리스트를 가져옵니다.
      const likedPosts = await Likes.findAll({
        where: { UserId: userId },
        attributes: ["PostId"]
      });
  
      // 좋아요 갯수와 작성자 정보를 join 하여 가져옵니다.
      const posts = await Posts.findAll({
        where: { postId: likedPosts.map((likedPost) => likedPost.PostId) },
        attributes: [
          "postId",
          "title",
          "createdAt",
          [sequelize.fn("COUNT", sequelize.col("Likes.postId")), "likeCount"]
        ],
        include: [
          { model: Likes, attributes: [] }
        ],
      });
  
      // 좋아요 갯수 내림차순으로 정렬합니다.
      const sortedPosts = posts.sort((a, b) => b.dataValues.likeCount - a.dataValues.likeCount);
      
      return res.status(200).json(sortedPosts);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ errorMessage: "좋아요 게시글 조회에 실패하였습니다." });
    }
  });

module.exports = router;