const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comment.js");
const Posts = require("../schemas/post.js")

router.get("/:userId/comments", async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        res.status(400).json({ messgae: "데이터 형식이 올바르지 않습니다." })
    }

    const comments = await Comments.find({ userId }, { password: 0 }).sort({ createdAt: -1 });
    if (comments.length === 0) {
        res.status(400).json({ message: "댓글이 없습니다." });
    } else {
        res.status(200).json({ data: comments });
    }
});

router.post("/:userId/comments", async (req, res) => {
    const { userId } = req.params;
    const { password, comment } = req.body;

    if (!userId || !password || !commnet) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

    const postComments = await Comments.find({ userId });
    if (postComments.length === 0) {
        return res.status(400).json({
            errorMessage: "댓글 내용을 입력해주세요 "
        })
    }
    const createdAt = new Date()

    const createdComment = await Comments.create({ userId, password, comment, createdAt });

    res.status(200).json({ "message": "댓글을 생성하였습니다." });

});


router.put("/:userId/comments", async (req, res) => {
    const { userId, password, comment } = req.body;

    if (!userId || !password || !comment) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

    const updateComments = await Comments.findOne({ userId });
    if (!updateComments) {
        return res.status(404).json({
            errorMessage: "댓글 조회에 실패했습니다."
        })
    } else if (updateComments.length === 0) {
        return res.status(400).json({
            errorMessage: "댓글 내용을 입력해주세요 "
        })
    }
    await Comments.updateOne(
        { userId: userId },
        { password: password },
        { $set: { comment: comment } }
    )

    res.status(200).json({ "message": "댓글을 수정하였습니다." });
});

router.delete("/:userId/comments", async (req, res) => {
    const { userId, password } = req.body;

    if (!userId, !password) {
        res.status(400).json({ message: "데이터 형식이 올바르지 않습니다." })
    }

    const deleteComments = await Comments.find({ userId });
    if (!deleteComments) {
        return res.status(404).json({ errorMessage: "댓글 조회에 실패했습니다." })
    } else if (deleteComments.length) {
        await Comments.deleteOne({ userId });
    }

    res.json({ "message": "댓글을 삭제하였습니다." });
})

module.exports = router;