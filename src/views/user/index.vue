<!--
  Copyright (c) 2020 classmate-sun
  [Software Name] is licensed under Mulan PSL v2.
  You can use this software according to the terms and conditions of the Mulan PSL v2.
  You may obtain a copy of Mulan PSL v2 at:
          http://license.coscl.org.cn/MulanPSL2
  THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
  EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
  MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
  See the Mulan PSL v2 for more details.
-->

<template>
  <div class="main" :style="style">
    <Nav></Nav>
    <div class="userInfo">
      <div class="head">
        <p>{{title}}</p>
      </div>
      <div class="headbox">
        <p class="user">{{text}}</p>
        <div class="headimg">
          <img :src="userInfo.photo" alt />
        </div>
        <div class="btn" v-if="this.userInfo.user === this.loginInfo.user">
          <button type="button" class="layui-btn" id="change" @click="ifShowAvatar = true">
            <i class="layui-icon">&#xe650;</i>更换头像
          </button>
          <p class="tip">支持动态头像哦~</p>
        </div>
        <div class="btn" v-else>
          <button
            type="button"
            :class="['layui-btn',{'layui-btn-disabled':this.userInfo.user === '对不起，该用户不存在！'}]"
            class="layui-btn"
            id="change"
            @click="like"
          >
            <i class="layui-icon">&#xe6c6;</i>为Ta点赞
          </button>
          <p class="tip">为Ta点个赞叭~</p>
        </div>
        <p class="like">{{likeText}}{{userInfo.like}} 次~</p>
      </div>
      <div class="infobox">
        <p>基本信息</p>
        <p>
          <span>昵称：</span>
          <input id="name" type="text" v-model="userInfo.user" disabled />
        </p>
        <p>
          <span>邮箱：</span>
          <input id="email" type="text" v-model="userInfo.email" disabled />
        </p>
      </div>
    </div>
    <Avatar :dialogVisible="ifShowAvatar" @handleClose="closeAvatar"></Avatar>
  </div>
</template>

<script>
import request from "../../api";
const getUser = request.getUser;
const postIfLogin = request.postIfLogin;
const postLikeUser = request.postLikeUser;

import Nav from "../../components/Nav";
import Avatar from "../../components/Avatar";
export default {
  name: "Diary",
  components: { Nav, Avatar },
  data() {
    return {
      userInfo: {},
      fullHeight: document.documentElement.clientHeight,
      style: {},
      ifShowAvatar: false,
      loginInfo: {},
      title: "",
      text: "",
      likeText: ""
    };
  },
  watch: {
    fullHeight(val) {
      if (!this.timer) {
        this.fullHeight = val;
        this.timer = true;
        let that = this;
        setTimeout(function() {
          that.timer = false;
        }, 400);
      }
      this.style = {
        height: this.fullHeight + "px",
        paddingTop: (this.fullHeight - 400) / 2 + "px"
      };
    }
  },
  created() {
    getUser({ user: this.$route.params.id })
      .then(res => {
        if (res.data.code === 0) {
          this.userInfo = res.data.data;
          this.text = res.data.data.user + "的用户中心";
          this.postLoginText();
        } else {
          this.userInfo = {
            user: "对不起，该用户不存在！",
            photo: "",
            email: "",
            like: 0
          };
          this.text = "对不起，该用户不存在！";
          this.postLoginText();
        }
      })
      .catch(e => {
        this.userInfo = {
          user: "对不起，该用户不存在！",
          photo: "",
          email: "",
          like: 0
        };
        this.text = "对不起，该用户不存在！";
        this.postLoginText();
      });
  },
  methods: {
    closeAvatar() {
      this.ifShowAvatar = false;
    },
    like() {
      postLikeUser({ user: this.userInfo.user })
        .then(res => {
          this.userInfo.like = res.data.like;
        })
        .catch(() => {});
    },
    postLoginText() {
      postIfLogin()
        .then(res => {
          if (res.data.userInfo) {
            this.loginInfo = res.data.userInfo;
            this.title = "欢迎您，" + res.data.userInfo.user;
            // console.log(this.loginInfo.user, this.userInfo.user);
            if (this.loginInfo.user === this.userInfo.user) {
              this.likeText = "你被赞了 ";
            } else {
              this.likeText = "Ta被赞了 ";
            }
          } else {
            this.loginInfo = {
              user: ""
            };
            this.title = "请您登录！";
            this.likeText = "Ta被赞了 ";
          }
        })
        .catch(() => {
          this.loginInfo = {
            user: ""
          };
          this.title = "请您登录！";
          this.likeText = "Ta被赞了 ";
        });
    }
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        that.fullHeight = window.fullHeight;
      })();
    };
    this.style = {
      height: this.fullHeight + "px",
      paddingTop: (this.fullHeight - 400) / 2 + "px"
    };
  }
};
</script>

<style scoped lang="less">
.main {
  box-sizing: border-box;
}

.userInfo {
  margin: 0 auto;
  width: 550px;
  border: #777 1px solid;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, 0.5);
}

input,
textarea {
  display: inline-block;
  width: 350px;
  height: 30px;
  padding: 0 8px;
  font-size: 15px;
  line-height: 29px;
  border: 1px #aaa solid;
  border-radius: 10px;
  box-shadow: 0 0 0px #999;
  background-color: rgba(0, 0, 0, 0);
}

.infobox p span.sig {
  line-height: 31px;
}

#change,
#changebg {
  border-radius: 10px;
}

input:focus {
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.5) inset, 0 0 8px rgba(102, 175, 233, 0.9);
}

textarea:focus {
  box-shadow: 0 0 1px rgba(0, 0, 0, 0.5) inset, 0 0 8px rgba(102, 175, 233, 0.9);
}

.content {
  margin: 0 auto;
  width: 555px;
  height: 753px;
  border-radius: 10px;
  box-shadow: 0 0 10px #999;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(255, 255, 255, 0.55);
}

.head {
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  border-bottom: 1px #777 dotted;
}

.head p {
  margin-left: 20px;
}

.headbox {
  width: 100%;
  height: 137px;
}

.headbox .tip {
  display: block;
  width: 115px;
  position: relative;
  top: -70px;
  left: 285px;
  text-align: center;
  color: #666;
}
.like {
  display: block;
  width: 100%;
  position: relative;
  top: -55px;
  text-align: center;
  span {
    font-size: 16px;
    margin-right: 4px;
  }
}
.headbox .bgtip {
  display: block;
  width: 350px;
  position: relative;
  top: -127px;
  left: 342px;
  color: #666;
}

.user {
  margin: 5px 20px;
  height: 20px;
  line-height: 20px;
  text-align: left;
  font-size: 17px;
}

.headimg {
  margin: 5px 145px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px #222 solid;
  overflow: hidden;
}

#change {
  position: relative;
  top: -73px;
  left: 286px;
}

#changebg {
  position: relative;
  top: -130px;
  left: 340px;
}

.infobox p,
.pwdbox p,
.vipbox p {
  margin: 5px 20px;
  font-size: 17px;
}

.vipbox p.text {
  text-align: center;
  font-size: 16px;
}

.vipbox p span {
  display: inline;
  font-weight: bold;
  color: red;
}

.vipbox,
.infobox,
.pwdbox {
  box-sizing: border-box;
  margin-top: 5px;
  width: 100%;
  border-top: 1px #777 dotted;
  span {
    display: inline-block;
    width: 95px;
    height: 33px;
    font-size: 15px;
    text-align: right;
  }
}

img {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

input[type="button"] {
  display: block;
  margin: 10px auto;
  width: 90px;
  height: 33px;
  transition: 0.2s;
  cursor: pointer;
  background-color: #eee;
  border-radius: 15px;
}

input[type="button"]:focus {
  box-shadow: 0 0 0;
}

input[type="button"]:active {
  box-shadow: 0 0 5px #aaa;
}

input[type="button"]:hover {
  background-color: #ccc;
}
</style>
