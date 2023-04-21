const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true
  },  
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
});

// 어떤 client가 조회할지 모르기때문에 일관성을 가지기위해 서버에는 UTC로 저장하는게 일반적, 필요에 따라 client에서 원하는 시간대로 변경해서 사용을 권장한다고 한다.
// 예시
// postSchema.virtual('dateKST').get(function() {
//     return this.date.toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }); // toLocaleString() 첫 번째 인수는 언어와 국가를 지정 , 두 번째 인수는 시간대를 지정
//   });

module.exports = mongoose.model("post", postSchema);