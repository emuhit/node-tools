var Env = require('dotenv');
var ConversationV1 = require('watson-developer-cloud/conversation/v1');
var fs = require('fs');
var readline = require("readline");
var async = require('async');
var moment = require('moment');

Env.config();
const username = process.env.NODE_WATSON_CNV_USER;
const password = process.env.NODE_WATSON_CNV_PASSWORD;
const workspace_id = process.env.NODE_WATSON_CNV_WORKSPACE_ID;

const inputpath = "./input/";
const inputfile = "data.txt";
const resultpath = "./results/";

var conversation = new ConversationV1({
  username: username,
  password: password,
  version_date: ConversationV1.VERSION_DATE_2017_05_26
});

var now = moment();
var rescsv = resultpath + now.format('YYYYMMDDhhmmss') + ".csv";
// var texts = [
//   "紙がしょっちゅうつまる",
//   "FAX受信時の音量がうるさい",
//   "機械管理者IDとパスワード"
// ];
// console.log("---START---");
// async.each(texts, function(inputtext, callback) {
//   executecnv(inputtext);
//   callback();
// }, function(err) {
//     console.error(err);
// });
//

var stream = fs.createReadStream(inputpath + inputfile, "utf8");
var reader = readline.createInterface({ input: stream });
reader.on("line", (inputtext) => {
      executecnv(inputtext);
    });

function executecnv(inputtext) {
  console.log("execute ---- " + inputtext);
  conversation.message(
    {
      input: { text: inputtext},
      workspace_id: workspace_id
    },
    function(err, response) {
      if (err) {
        console.error(err);
      } else {

        csvstr = '"' + response.context.conversation_id + '",'
          + '"' + inputtext + '",'
          + '"' + response.intents[0].intent + '",'
          + '"' + response.intents[0].confidence + '""\n';
        console.log(csvstr);
        fs.appendFile(rescsv, csvstr, function (err) {
          console.log(err);
        });

        var resstr = JSON.stringify(response, null, 2);
        // console.log(resstr);
        var resfile = resultpath + response.context.conversation_id + ".txt"
        fs.writeFile(resfile, resstr , function (err) {
            console.log(err);
          });
      }
    }
  );
}
