const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const usersRouter = require("./routes/users.js");

const connect = require('./schemas');
connect();

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('/signup 회원가입, /login 로그인');
});

app.get('*', (req, res)=> {
    res.res.status(400).json({
        errorMessage: "잘못된 URL 입니다. /signup 회원가입, /login 로그인, /posts에서 게시글 조회가 가능합니다."
     });
})

app.use('/posts', [postsRouter, commentsRouter]);
app.use('/', [usersRouter])


app.listen(port, () => {
    console.log(`${port} 포트로 서버가 열렸습니다.`)
})