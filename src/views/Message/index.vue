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
  <div class="Message">
    <Nav></Nav>
    <div class="main">
      <div class="content">
        <article>
          <section>
            <h2>留言板</h2>
            <p>沟通交流，拉近你我！</p>
            <RichText @Sub="handleSubmit" :submitting="submitting"></RichText>
          </section>
          <section>
            <ul>
              <li v-for="(item,index) in commentList" :key="item._id">
                <div class="comment-parent">
                  <div
                    class="p-img"
                    :style="{backgroundImage:'url('+item.user.photo+')'}"
                    @click="goToUser(item.user.user)"
                  ></div>
                  <div class="p-info">
                    <div class="p-name" style="margin-left:5px;">
                      {{item.user.user}}
                      <span class="admin" v-if="item.user.user === 'admin'">站长</span>
                      <span class="browser">{{item.browserInfo}}</span>
                    </div>
                    <div class="p-content" style="margin-left:15px;" v-html="item.content"></div>
                    <div class="p-time">
                      <span>
                        <i
                          class="el-icon-location-outline"
                          style="margin-right:20px;"
                        >{{item.address}}</i>
                        {{getTime(item.date)}}
                      </span>
                      <a
                        @click="replyClick(index)"
                      >{{(item.reply.lastIndexArr[0]===index && item.reply.lastIndexArr[1]===undefined)?"收起":"回复"}}</a>
                    </div>
                  </div>
                </div>
                <div
                  class="comment-child"
                  v-for="(childItem,childIndex) in item.children"
                  :key="childItem.date + Math.random()"
                >
                  <div
                    class="c-img"
                    :style="{backgroundImage:'url('+childItem.user.photo+')'}"
                    @click="goToUser(childItem.user.user)"
                  ></div>
                  <div class="c-info">
                    <div class="c-name">
                      <span class="name">
                        {{childItem.user.user}}
                        <span
                          class="admin"
                          v-if="childItem.user.user === 'admin'"
                        >站长</span>
                        <span class="browser">{{childItem.browserInfo}}</span>
                      </span>回复
                      <span class="name">{{childItem.reUser}}</span>
                      <span class="admin" v-if="childItem.reUser === 'admin'">站长</span>
                      <p
                        style="margin:5px 0 0 15px; width:500px;word-break:normal;white-space:pre-warp;word-wrap:break-word;font-size:15px;color:rgb(235,235,255);"
                        v-html="childItem.content"
                      ></p>
                    </div>
                    <div class="c-time">
                      <span>
                        <i
                          class="el-icon-location-outline"
                          style="margin-right:20px;"
                        >{{childItem.address}}</i>
                        {{getTime(childItem.date)}}
                      </span>
                      <a
                        @click="replyClick(index,childIndex)"
                      >{{(item.reply.lastIndexArr[0]===index && item.reply.lastIndexArr[1]===childIndex)?"收起":"回复"}}</a>
                    </div>
                  </div>
                </div>
                <div :class="['comment-reply',{'show':item.reply.ifShow}]">
                  <textarea
                    v-model="item.reply.content"
                    :placeholder="'回复【'+item.reply.reUser+'】：'"
                  ></textarea>
                  <button
                    @click="childCommit(index)"
                    type="button"
                    class="layui-btn layui-btn-xs"
                  >提交</button>
                </div>
              </li>
            </ul>
          </section>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav";
import RichText from "../../components/RichText";
import request from "../../api";

const postIfLogin = request.postIfLogin;
const commitMessage = request.commitMessage;
const getMessageList = request.getMessageList;
const commitChildMessage = request.commitChildMessage;

export default {
  name: "Message",
  data() {
    return {
      commentList: [],
      skip: 0,
      limit: 5,
      ifLoding: false,
      submitting: false,
    };
  },
  methods: {
    toTwo(num) {
      return (num < 10 ? "0" : "") + num;
    },
    getTime(val) {
      let date = new Date(val);
      let YY = this.toTwo(date.getFullYear()),
        MM = this.toTwo(date.getMonth() + 1),
        DD = this.toTwo(date.getDate()),
        h = this.toTwo(date.getHours()),
        m = this.toTwo(date.getMinutes()),
        s = this.toTwo(date.getSeconds());

      return `${YY}年${MM}月${DD}日 ${h}:${m}:${s}`;
    },
    goToUser(user) {
      this.$router.push(`/user/${user}`);
    },
    handleSubmit(val) {
      this.submitting = true;
      postIfLogin()
        .then((res) => {
          if (res.data.userInfo) {
            //登陆了，就发送数据到数据库 -- 执行留言提交的ajax
            commitMessage({
              user: res.data.userInfo._id,
              content: val,
            })
              .then((res) => {
                this.submitting = false;
                if (res.data.code === 0) {
                  layer.msg("留言成功", { icon: 1 });
                  this.getMessageList();
                } else {
                  layer.msg(res.data.msg, { icon: 2 });
                  this.getMessageList();
                }
              })
              .catch(() => {
                this.submitting = false;
                layer.msg("服务器错误~请稍后再试", { icon: 2 });
              });
          } else {
            //未登录
            layer.msg("请先登录", { icon: 2 });
          }
        })
        .catch(() => {
          //服务出错
          layer.msg("服务器错误~请稍后再试", { icon: 2 });
        });
    },
    replyClick(pIndex, cIndex) {
      if (pIndex === undefined) return;

      let parentData = this.commentList[pIndex];

      //改变placeholder的内容
      if (cIndex !== undefined) {
        //回复的子评论
        this.commentList[pIndex].reply.reUser = this.commentList[
          pIndex
        ].children[cIndex].user.user;
      } else {
        //回复的父评论
        this.commentList[pIndex].reply.reUser = this.commentList[
          pIndex
        ].user.user;
      }

      //两次点的同一个
      //不是同一个
      if (
        pIndex === parentData.reply.lastIndexArr[0] &&
        cIndex === parentData.reply.lastIndexArr[1]
      ) {
        parentData.reply.ifShow = false;
        parentData.reply.lastIndexArr = [];
      } else {
        parentData.reply.ifShow = true;
        parentData.reply.lastIndexArr = [pIndex, cIndex];
      }
    },
    childCommit(pIndex) {
      //判断登录
      postIfLogin()
        .then((res) => {
          if (res.data.userInfo) {
            //登陆了，就发送数据到数据库 -- 执行留言提交的ajax
            commitChildMessage({
              parentId: this.commentList[pIndex]._id,
              user: res.data.userInfo._id,
              content: this.commentList[pIndex].reply.content,
              reUser: this.commentList[pIndex].reply.reUser,
            }).then((res) => {
              if (res.data.code) {
                //code不为0，评论失败
                layer.msg(res.data.msg, { icon: 2 });
              } else {
                //code为0，评论成功
                layer.msg("评论成功", { icon: 1 });
                this.getMessageList();
              }
            });
          } else {
            //未登录
            layer.msg("请先登录", { icon: 2 });
          }
        })
        .catch(() => {
          //服务出错
          layer.msg("服务器错误~请稍后再试", { icon: 2 });
        });
    },
    handleScroll() {
      if (this.ifLoding) return;

      //文档高
      let c = document.documentElement.offsetHeight;
      //滚动高
      let a = document.documentElement.scrollTop;
      //可视区高
      let b = document.documentElement.clientHeight;

      if (a + b >= c - 50) {
        this.ifLoding = true;
        this.getMessageList(() => {
          this.ifLoding = false;
        });
      }
    },
    getMessageList(cb) {
      this.limit += 1;
      getMessageList(this.skip, this.limit)
        .then((res) => {
          if (res.data.code === 0) {
            let data = res.data.data;
            data.forEach((item) => {
              item.reply = {
                user: "", //id
                content: "", //回复内容
                reUser: "", //字符串
                date: "", //日期
                ifShow: false,
                lastIndexArr: [],
              };
            });
            this.commentList = data;
          }
          cb && cb();
        })
        .catch(() => {
          cb && cb();
        });
    },
  },
  components: {
    Nav,
    RichText,
  },
  created() {
    this.getMessageList();
  },
  mounted() {
    //发送第一次请求
    postIfLogin(localStorage.getItem("token"))
      .then((res) => {})
      .catch();
    //监听滚动事件
    window.addEventListener("scroll", this.handleScroll);
  },
  destroyed() {
    //移除监听滚动事件
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>

<style scoped lang="less">
.Message {
  .v-enter,
  .v-leave-to {
    opacity: 0;
    transform: translateY(180px);
  }
  .v-enter-active,
  .v-leave-active {
    transition: 1s;
  }
  > .main {
    box-sizing: border-box;
    max-width: 1360px;
    padding: 70px 50px;
    margin: 0 auto;
    > .content {
      width: 100%;
      > article {
        section:nth-child(1) {
          box-sizing: border-box;
          width: 100%;
          padding: 20px 15px;
          background: white;
          border-radius: 20px 20px 0px 0px;
          > h2 {
            font-weight: 700;
            font-size: 2rem;
            text-align: center;
          }
          > p {
            font-size: 1.25rem;
            margin: 1rem 0;
            text-align: center;
          }
        }
        section:nth-child(2) {
          box-sizing: border-box;
          border-radius: 0px 0px 20px 20px;
          padding: 20px 15px;
          width: 100%;
          color: #ebebff;
          background-color: rgba(0, 0, 0, 0.61);
          > ul {
            width: 100%;
            > li {
              padding: 20px 0;
              border-bottom: 1px dotted #333;
              .comment-parent {
                display: flex;
                .p-img {
                  width: 45px;
                  height: 45px;
                  border-radius: 50%;
                  margin-right: 5px;
                  background-position: center center;
                  background-color: #ddd;
                  background-size: cover;
                }
                .p-info {
                  flex: 1;
                  padding-bottom: 20px;
                  border-bottom: 1px dotted #aaa;
                  .p-name {
                    color: #01aaed;
                    .admin {
                      margin: 0 5px 0 1px;
                      display: inline-block;
                      box-sizing: border-box;
                      width: 35px;
                      height: 18px;
                      padding: 1px 5px 0;
                      font-size: 12px;
                      text-align: center;
                      border-radius: 5px;
                      background-color: #096;
                      color: #fff;
                    }
                    .browser {
                      margin-left: 5px;
                      color: #24d99d;
                    }
                  }
                  .p-content {
                    padding: 5px 0;
                    min-height: 30px;
                    font-size: 16px;
                    line-height: 30px;
                    word-break: break-all;
                  }
                  .p-time {
                    font-size: 12px;
                    color: #ebebff;
                    span {
                      padding-left: 15px;
                      padding-right: 15px;
                    }
                    a {
                      color: #50ff4e;
                      cursor: pointer;
                    }
                  }
                }
              }
              .comment-child {
                display: flex;
                box-sizing: border-box;
                width: 100%;
                padding-left: 50px;
                padding-top: 20px;
                .c-img {
                  width: 45px;
                  height: 45px;
                  border-radius: 50%;
                  margin-right: 5px;
                  background-position: center center;
                  background-color: #ddd;
                  background-size: cover;
                }
                .c-info {
                  flex: 1;
                  font-size: 12px;
                  .c-name {
                    .name {
                      color: #01aaed;
                      margin: 0 5px;
                    }
                    .admin {
                      margin: 0 5px 0 1px;
                      display: inline-block;
                      box-sizing: border-box;
                      width: 35px;
                      height: 18px;
                      padding: 1px 5px 0;
                      font-size: 12px;
                      text-align: center;
                      border-radius: 5px;
                      background-color: #096;
                      color: #fff;
                    }
                    .browser {
                      margin-left: 5px;
                      color: #24d99d;
                    }
                  }
                  .c-time {
                    padding-left: 20px;
                    padding-top: 5px;
                    color: #ebebff;
                    span {
                      margin-right: 10px;
                    }
                    a {
                      cursor: pointer;
                      color: #50ff4e;
                    }
                  }
                }
              }
              .comment-reply {
                overflow: hidden;
                box-sizing: border-box;
                width: 100%;
                height: 0;
                padding-left: 50px;
                padding-top: 10px;
                transition: height 0.3s;
                &.show {
                  height: 100px;
                }
                textarea {
                  display: block;
                  width: 100%;
                  height: 60px;
                  border-color: #aaa;
                  padding: 10px;
                  box-sizing: border-box;
                  resize: none;
                }
                button {
                  margin-top: 8px;
                  display: block;
                }
              }
            }
          }
        }
      }
    }
  }
}
@media (max-width: 1008px) {
  .Message {
    > .main {
      padding: 70px 20px;
    }
  }
}
</style>
