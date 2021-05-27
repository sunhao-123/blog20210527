/*
  Copyright (c) 2020 classmate-sun
  [Software Name] is licensed under Mulan PSL v2.
  You can use this software according to the terms and conditions of the Mulan PSL v2.
  You may obtain a copy of Mulan PSL v2 at:
          http://license.coscl.org.cn/MulanPSL2
  THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
  MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
  See the Mulan PSL v2 for more details.
*/

import axios from "axios";

//配置默认的参数
// axios.defaults.baseURL = 'https://www.sun0623.top';//默认访问地址
let protocol = window.location.protocol; //协议
let host = window.location.host; //主机
//动态请求地址                协议             主机
if (/localhost/.test(host)) {
  // if (/8080/.test(host)) {
  axios.defaults.baseURL = "https://www.sun0623.top";
} else {
  axios.defaults.baseURL = protocol + "//" + host;
}



// let protocol = window.location.protocol; //协议
// let host = window.location.host; //主机
// this.hostUrl = `${protocol}//${host}`;



axios.defaults.withCredentials = true; //跨域允许携带cookie
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"; //设置POST请求格式
axios.defaults.headers["Content-Security-Policy"] = "upgrade-insecure-requests";

export default {

  //获取留言条数
  getMessageCount() {
    return axios.post('/message/getCount');
  },
  //获取文章条数
  getArticleCount() {
    return axios.post('/article/getCount');
  },
  //获取文章条数
  getUserCount() {
    return axios.post('/user/getCount');
  },
  //获取总访问量
  getLinkCount() {
    return axios.post('/links/getCount');
  },


  //获取公告
  getAnnouncement() {
    return axios.post('/announcement/getContent');
  },


  //获取文章信息
  getArticleInfo() {
    return axios.post("/article/getInfo")
  },
  getArticleHot(limit = 8) {
    return axios.post('/article/getHot', { limit });
  },
  //获取文章列表
  getArticleShow: (function () {
    let skip = 0;
    let limit = 5;

    return function (index = 0, ifFresh = false) {
      if (ifFresh) {
        skip = 0;
        limit = 5;
      }

      let tag = ["", "HTML&Css", "JavaScript", "Node", "Vue&React", "Other"][index];

      let data = { skip, limit, tag };
      skip += limit;
      return axios.post('/article/getShow', data);
    }
  })(),
  //获取单篇文章信息
  getArticle(_id) {
    return axios.post('/article', { _id });
  },
  //获取延伸阅读
  getArticleExtend(tag) {
    return axios.post("/article/extend", { tag });
  },
  //搜索文章
  getArticleSearch(keywords) {
    return axios.post("/article/search", { keywords });
  },



  //获取邮件验证码
  getRegisterCode(email) {
    return axios.post("/register/code", { email });
  },
  //验证码的提交验证
  getRegisterCheckCode(Code) {
    return axios.post('/register/checkCode', { Code })
  },



  /*
  * 注册接口*/
  postRegister(options) {
    return axios.post("/register", options);
  },

  /* 忘记密码 */
  postForget(options) {
    return axios.post("/forget", options);
  },

  //获取邮件验证码
  getForgetCode(email) {
    return axios.post("/forget/code", { email });
  },
  //验证码的提交验证
  getForgetCheckCode(Code) {
    return axios.post('/forget/checkCode', { Code })
  },
  checkForgetCode(email) {
    return axios.post('/forget/checkEmail', { email })
  },



  /*登录的接口*/
  //获取验证码图片
  getLoginVCode() {
    return axios.post("/login/vcode");
  },
  //验证码的提交验证
  getLoginCheckVcode(svgCode) {
    return axios.post('/login/checkVcode', { svgCode })
  },
  postLogin(options) {
    return axios.post('/login', options);
  },
  postIfLogin() {
    return axios.post("/login/ifLogin");
  },
  postLogout() {
    return axios.post("/login/logout");
  },


  /*获取用户*/
  getUser(user) {
    return axios.post(`/login/user`, user);
  },
  postLikeUser(user) {
    return axios.post(`/login/likeuser`, user);
  },


  /*留言的接口 options => {user:"id", content:""}*/
  commitMessage(options) {
    return axios.post("/message/commit", options);
  },
  /*留言的留言接口 options => {parentId:"id",user:"id",content:"",$user:""}*/
  commitChildMessage(options) {
    return axios.post('/message/childCommit', options)
  },
  /*获取留言列表 options => */
  getMessageList(skip = 0, limit = 5) {
    return axios.post('/message/getList', { skip, limit });
  }





  /*最近访问接口*/
  , getVisitor() {
    return axios.post("/visitor");
  }



  /*日记接口*/
  , getDiary() {
    return axios.get("/diary");
  }

  /*友链接口*/
  , getLinks() {
    return axios.get("/links");
  }

  /*头像裁剪上传*/
  , postHead(headData) {
    return axios.post("/upload/avatar/head", { headData });
  }


  /*视频搜索*/
  , postSearchVideo(name) {
    return axios.post("/video/search", { name });
  }

  /*获取热门视频*/
  , postGetList() {
    return axios.post("/video/videoList");
  }
  /* 记录用户观看记录 */
  , userWatch({ _id, videoId, num }) {
    return axios.post("/video/user", { _id, videoId, num });
  }
  /* 获取用户观看记录 */
  , getUserWatch({ _id, videoId }) {
    return axios.post("/video/getinfo", { _id, videoId });
  }


  /*获取视频*/
  , postWatch(id) {
    return axios.post(`/video/${id}`);
  }


  /*获取游戏列表*/
  , postGetGame() {
    return axios.post("/game/gameList");
  }
  /* 记录用户游戏记录 */
  , postUserPlay({ _id, gameName, num }) {
    return axios.post("/game/user", { _id, gameName, num });
  }
  /* 获取用户记录 */
  , getUserPlay({ _id, gameName }) {
    return axios.post("/game/getinfo", { _id, gameName });
  }
  /* 获取排行榜 */
  , getLeader({ gameName }) {
    return axios.post("/game/getLeader", { gameName });
  }

  /* 获取天气 */
  , getWeather() {
    return axios.get(`/weather`)
  }
  

  , getGary() {
    return axios.get(`/gary/getGary`)
  }
};
