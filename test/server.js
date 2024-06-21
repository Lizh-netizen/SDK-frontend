const express = require('express');
const app = express();
// const path = require('path');
// const fs = require('fs');

const bodyParser = require('body-parser');
// 用来解析post过来的数据
const coBody = require('co-body');

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 50000 }));

app.all('*', function (res, req, next) {
  req.header('Access-Control-Allow-Origin', '*');
  req.header('Access-Control-Allow-Headers', 'Content-Type');
  req.header('Access-Control-Allow-Methods', '*');
  req.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// 存储性能数据
let performanceList = [];
// 存储错误数据
let errorList = [];
// 存储录屏数据
let recordScreenList = [];
// 存储白屏检测数据
let whiteScreenList = [];

// 获取js.map源码文件
// app.get('/getmap', (req, res) => {
//   let fileName = req.query.fileName;
//   if (req.query.env == 'development') {
//     let mapFile = path.join(__filename, '..', fileName);
//     console.log('🚀 ~ app.get ~ mapFile:', mapFile);
//     fs.readFile(mapFile, function (err, data) {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       res.send(data);
//     });
//   } else {
//     // req.query 获取接口参数
//     let mapFile = path.join(__filename, '..', 'dist/js');
//     // 拿到dist目录下对应map文件的路径
//     let mapPath = path.join(mapFile, `${fileName}.map`);
//     fs.readFile(mapPath, function (err, data) {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       res.send(data);
//     });
//   }
// });
// post请求不能直接拿到字段，需要转换一下
app.post('/getmap', async () => {
  // const data = await coBody.json(req);
  // const url = data.fileName;
  // let fileUrl = `${url.substring(url.lastIndexOf('/') + 1).trim()}.map`; // map文件路径
  // 解析sourceMap, 得到源文件路径，是在server下的
  // let consumer = await new sourceMap.SourceMapConsumer(fs.readFileSync(resolve('./' + fileUrl), 'utf8')); // 返回一个promise对象
  // // 解析原始报错数据
  // let result = consumer.originalPositionFor({
  //   line: error.lineNo, // 压缩后的行号
  //   column: error.columnNo, // 压缩后的列号
  // });
  // console.log(result);
  // res.json(result);
  // res.send({
  //   code: 200,
  //   data: {
  //     msg: '成功',
  //   },
  // });
});

app.get('/getErrorList', (req, res) => {
  res.send({
    code: 200,
    data: errorList,
  });
});

app.get('/getRecordScreenId', (req, res) => {
  let id = req.query.id;
  let data = recordScreenList.filter((item) => item.recordScreenId == id);
  res.send({
    code: 200,
    data,
  });
});

app.post('/reportData', async (req, res) => {
  try {
    // req.body 不为空时为正常请求，如录屏信息
    let length = Object.keys(req.body).length;
    if (length) {
      recordScreenList.push(req.body);
    } else {
      // 使用 web beacon 上报数据
      let data = await coBody.json(req);
      if (!data) return;
      if (data.type == 'performance') {
        performanceList.push(data);
      } else if (data.type == 'recordScreen') {
        recordScreenList.push(data);
      } else if (data.type == 'whiteScreen') {
        whiteScreenList.push(data);
      } else {
        errorList.push(data);
      }
    }
    res.send({
      code: 200,
      meaage: '上报成功！',
    });
  } catch (err) {
    res.send({
      code: 203,
      meaage: '上报失败！',
      err,
    });
  }
});

app.listen(8083, () => {
  console.log('Server is running at http://localhost:8083');
});
