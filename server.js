const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const users = require('./models/users.js');
const { pieces, getFilterPieces } = require('./models/pieces.js');
const { addPlans, getMyPlans, getSelectPlan } = require('./models/plans.js');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

/**
 * 로그인 여부 체크 미들웨어
 * 1. 로그인 사용자인 경우, 메인 페이지로 이동
 * 2. 미로그인 사용자인 경우, 로그인 페이지로 이동
 */
// const auth = (req, res, next) => {
//   const accessToken = req.headers.authorization || req.cookies.accessToken;

//   try {
//     const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
//     console.log('인증 성공', decoded);
//     next();
//   } catch (e) {
//     console.error('사용자 인증 실패', e);
//     res.redirect('/login');
//   }
// };

// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   const user = users.find(user => user.email === email && user.password === password);

//   if (!user) return res.status(401).send({ error: '등록되지 않은 사용자입니다.' });

//   const accessToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_KEY, {
//     expiresIn: '1d',
//   });

//   res.cookie('accessToken', accessToken, {
//     maxAge: 1000 * 60 * 60 * 24 * 7, // 7d
//     httpOnly: true,
//   });

//   // 로그인 성공
//   res.send({ userId: user.userId, name: user.name });
// });

app.get('/calender', (req, res) => {
  // 로그인 된 id, 닉네임 토큰 해석해서 사용
  const tokenId = 'f3c01bd3-c491-4034-a961-bf63e988ccbf';
  const tokenName = '김팀장';

  res.send({ name: tokenName, pieces, plans: getMyPlans(tokenId) });
});

app.post('/plan/:date', (req, res) => {
  // 로그인 된 id, 닉네임 토큰 해석해서 사용
  const tokenId = 'f3c01bd3-c491-4034-a961-bf63e988ccbf';
  const tokenName = '김팀장';
  const { filterId, searchText } = req.body;
  const { date } = req.params;

  res.send({ name: tokenName, pieces: getFilterPieces(tokenId, filterId, searchText), plan: getSelectPlan(date) });
});

app.patch('/plan', (req, res) => {
  // 로그인 된 id, 닉네임 토큰 해석해서 사용
  const tokenId = 'f3c01bd3-c491-4034-a961-bf63e988ccbf';

  addPlans(req.body, tokenId);
  res.send();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// listen (port번호, callback) - 언제올지 모르는 요청을 위해 무한루프를 돌며 켜져있어야 한다.
app.listen(PORT, () => {
  console.log(`app listening on ${PORT}`);
});
