const express = require('express');
const { Op } = require("sequelize");
const { Posts, Likes } = require("../models");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware.js");



// 게시글 생성 : POST -> localhost:3000/posts
router.post('/',authMiddleware, async (req, res) => {
    try {
        const { userId, nickname } = res.locals.user;
        const { title, content } = req.body;
        await Posts.create({ 
            UserId : userId,
            nickname,
            title,
            content });
        return res.status(200).json({ message: '게시글 작성에 성공하였습니다.' })
    } catch {
        return res.status(400).json({ message: '데이터 형식이 올바르지 않습니다.' });
    }
});

// const post = await (Posts.find()).sort("-createdAt"); 사용 시 MongoDB 내부 기능으로 mongoose 외 일반 배열에서는 동작 안 된다고 함 / .sort("-*"); 사용 시 간결하나 사용하는 db등에 따라 유연성이 떨어질 수 있을 것 같음

// 게시글 조회 : GET -> localhost:3000/posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.findAll({
            attributes: ["postId", "title", "createdAt", "updatedAt"],
            order: [['createdAt', 'DESC']],
          });
          
        
        const results = posts.sort((a, b) => {
            return b.createdAt.getTime() - a.createdAt.getTime();
        });
        
        res.json({ data: results });
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: '게시글 조회에 실패하였습니다.' });
    }
});


// 게시글 상세조회 : GET -> localhost:3000/posts/:postId
router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;
        
        const post = await Posts.findOne({
            attributes: ["postId", "title", "content", "createdAt", "updatedAt"],
            where: { postId }
          });
        if (!post) {
            res.status(400).send( {message: "게시글이 없습니다."})
        } else {
        res.json({ data: post });
        }
    } catch (err) {
        console.error(err);
        res.status(400).send({ message: '게시글 조회에 실패하였습니다.' });
    }
});


// 게시글 수정 : PUT -> localhost:3000/posts/:postId
router.put('/:postId', authMiddleware, async (req, res) => {
    try {
        const { userId } = res.locals.user;
        const { postId } = req.params;
        const { title, content } = req.body;

        const post = await Posts.findOne({ where: { postId } });
        
        if (title.length===0) {
            return res.status(412).json({ errorMessage: "게시글 제목의 형식이 일치하지 않습니다."})
        }
        if (content.length===0) {
            return res.status(412).json({ errorMessage: "게시글 내용의 형식이 일치하지 않습니다."})
        }
        if (userId === post.UserId) {
            const date = new Date();
            await Posts.update(
                { title: title, content: content, updatedAt: date },
                {where: {userId : userId}} );

            return res.status(200).json({ message: '게시글을 수정하였습니다.' });
        } else {
            return res.status(403).json({ errorMessage: '게시글 수정의 권한이 존재하지 않습니다.' });
        }
    } catch (err) {
        console.error(err);
        res.status(400).send({ errorMessage: '게시글 수정에 실패하였습니다.' });
    }
});


// 게시글 삭제 : DELETE -> localhost:3000/posts/:postId
router.delete('/:postId', authMiddleware, async (req, res) => {
    try {
        const { userId } = res.locals.user;
        const { postId } = req.params;
        
        const post = await Posts.findOne({ where: { postId } });

        if (!post) {
            return res.status(404).json({ message: '게시글이 존재하지 않습니다.' });
        }
        
        if (userId === post.userId) {
            await Posts.destroy({
                where: {
                  [Op.and]: [{ postId }, { nickname }]
                }
            });
            return res.status(200).json({ message: '게시글을 삭제하였습니다.' });
        } else {
            return res.status(403).json({ errorMessage: '게시글의 삭제 권한이 존재하지 않습니다.' });
        }
    } catch (err) {
        console.error(err);
        return res.status(400).send({ errorMessage: '게시글 삭제에 실패하였습니다.' });
    }
});



module.exports = router;