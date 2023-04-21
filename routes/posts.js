const express = require("express");
const router = express.Router();
const Posts = require("../schemas/post.js");
const Comments = require("../schemas/comment.js");

// 전체 조회
router.get("/", async (req, res) => {
    const posts = await Posts.find({}, { _id: 0, password: 0, content: 0, __v: 0 }).sort({ createdAt: -1 });
    res.status(200).json({ data: posts });
});

// userId 값에 해당하는 글만 조회  
router.get("/:userId", async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        return;
    }

    const posts = await Posts.findOne({ userId }, { _id: 0, password: 0, __v: 0 }).sort({ createdAt: -1 });
    if (!posts) {
        return res.status(404).json({ message: "해당 게시글이 존재하지 않습니다." });
    }
    res.status(200).json({ data: posts });
});

// post 를 통해 게시글 작성
router.post("/", async (req, res) => {
    const { title, userId, password, content } = req.body;

    if (!title || !userId || !password || !content) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        return;
    }


    const posts = await Posts.find({ userId: userId });

    if (posts.length) {
        return res.status(400).json({
            errorMessage: "이미 존재하는 아이디 입니다."
        });
    }
    const createdAt = new Date()
    
    const createdPosts = await Posts.create({ title, userId, password, content, createdAt });

    res.status(200).json({ "message": "게시글이 생성되었습니다." });

});

router.put("/:userId", async (req, res) => {
    const { title, userId, password, content } = req.body;

    const updatePosts = await Posts.findOne({ password });
    if (updatePosts.password !== password) {
        return res.status(400).json({
            message: "비밀번호가 일치하지 않습니다. "
        })
    } else if (!userId || !password || !content) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        return;
    } else if (!updatePosts) {
        res.status(404).json({ message: "게시글이 존재하지 않습니다." })
    }

    await Posts.updateOne(
        { userId: userId },
        { password: password },
        { $set: { content: content } }
    )

    res.status(200).json({ "message": "게시글을 수정하였습니다." });
});

router.delete("/:userId", async (req, res) => {
    const { userId, password } = req.body;

    const deletePosts = await Posts.findOne({ password });
    if (deletePosts.password !== password) {
        return res.status(400).json({
            errorMessage: "비밀번호가 일치하지 않습니다. "
        })
    } else if (!userId) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." });
        return;
    } else if (!deletePosts) {
        res.status(404).json({ message: "게시글이 존재하지 않습니다." })
    } else {
        await Posts.deleteOne({ userId });
    }

    res.json({ "message": "게스글을 삭제하였습니다." });
})

module.exports = router;