const express = require('express');
const app = express();
const port = 3000;
const indexRouter = require("./routes/index.js");
const connect = require("./schemas");
connect();

app.use(express.json());
app.use("/", [indexRouter]); 

app.get("*", (req, res) => {
  res.send("잘못된 주소입니다. /posts를 추가해주세요.");
});

app.listen(port, () => {
  console.log(port, '포트로 서버가 열렸어요!');
});