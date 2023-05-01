const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");

const postsRouter = require('./routes/posts');
const usersRouter = require("./routes/users.js");

app.use(express.json());
app.use(cookieParser());

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get('/', (req, res) => {
    res.send('/signup 회원가입, /login 로그인');
});

app.use('/posts', [postsRouter]);
app.use('/', [usersRouter])


app.listen(port, () => {
    console.log(`${port} 포트로 서버가 열렸습니다.`)
})