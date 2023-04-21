const express = require("express");
const router = express.Router();
const Comments = require("../schemas/comment.js");
const Posts = require("../schemas/post.js")

router.get("/:userId/comments", async(req, res) => {
    const { userId } = req.params;
   
    const comments = await Comments.find({ userId }).sort({ Pdate: -1 });
    if (comments.length === 0){
        res.status(400).json({ message : "댓글이 없습니다."});
    } else {
    res.status(200).json({ data : comments });
}
});

router.post("/:userId/comments", async(req,res) => {
  const {userId} = req.params;
  const {comment} = req.body;
  
  const postComments = await Comments.find({userId});
  if (postComments.length === 0){
    return res.status(400).json({
        errorMessage:"댓글 내용을 입력해주세요 "
    })
}
    const createdAt = new Date()

    const createdComment = await Comments.create({userId, comment, createdAt});

    res.status(200).json({"message":"댓글을 생성하였습니다." });
  
});


router.put("/:userId/comments", async(req, res) => {
    const {userId, comment} = req.body;
    
    const existsComments = await Comments.findOne({userId});
   if (existsComments === null) {
        return res.status(400).json({
            errorMessage:"찾을 수 없는 글입니다. "
        })
    } else if (existsComments.length === 0){
        return res.status(400).json({
            errorMessage:"댓글 내용을 입력해주세요 "
        })
    } else {
        await Comments.updateOne(
            {userId: userId},
            {$set: {comment:comment}}
        )
    }
    res.status(200).json({"message":"댓글을 수정하였습니다."});
});

router.delete("/:userId/comments", async(req, res) => {
    const {userId} = req.body;

    const existsComments = await Comments.find({userId});
    if(existsComments.length){
        await Comments.deleteOne({userId});
    }

    res.json({"message":"댓글을 삭제하였습니다."});
})

module.exports = router;