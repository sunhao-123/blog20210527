<template>
  <div class="qmm">
    <Nav @postLogin="postIfLoginFn"></Nav>
    <Leader gameName="圈猫猫" ref="lea"></Leader>
    <h1>圈猫猫</h1>
    <p>
      （13 * 13）
      {{
        record === "未登录"
          ? `登录后查看并上传您的游戏记录`
          : record === 0
          ? "您还未通关"
          : `您已通关${record}次`
      }}
    </p>
    <div class="gameBox">
      <div id="catch-the-cat"></div>
    </div>
  </div>
</template>
<script>
import Nav from "../../components/Nav";
import Leader from "../../components/Leader";
import request from "../../api";

import "../../assets/js/phaser.min.js";
import "../../assets/js/catch-the-cat.js";
const gamestatestx = require("../../assets/js/catch-the-cat.js");

const postIfLogin = request.postIfLogin;
const postUserPlay = request.postUserPlay;
const getUserPlay = request.getUserPlay;

export default {
  name: "QMM",
  components: { Nav, Leader },
  data() {
    return {
      game: "",
      gamestate: "",
      userId: "",
      record: "未登录",
      setinterval1: 0,
    };
  },
  watch: {
    gamestate(newVal, oldVal) {
      if (newVal === "win") {
        this.uploadLeader();
      }
    },

    gamestate(newVal, oldVal) {
      if (newVal === "lose") {
        // console.log("你输了哦~");
      }
    },
  },
  methods: {
    getText() {
      // this.gamestate = window.gamestatestx;
      this.gamestate = gamestatestx.gamestatestx;
    },
    update() {
      this.$refs.lea.updateLeader();
    },
    uploadLeader() {
      postUserPlay({
        _id: this.userId,
        gameName: "圈猫猫",
        num: this.record + 1,
      })
        .then(() => {
          this.record += 1;
          this.update();
        })
        .catch(() => {});
    },
    postIfLoginFn() {
      postIfLogin().then((res) => {
        if (!res.data.userInfo) {
          this.userId = "游客";
          this.record = "未登录";
        } else {
          this.userId = res.data.userInfo._id;
          getUserPlay({ _id: this.userId, gameName: "圈猫猫" }).then((res) => {
            if (res.data.num === "暂无记录") {
              this.record = 0;
            } else {
              this.record = res.data.num * 1;
            }
          });
        }
      });
    },
  },
  mounted() {
    this.game = new CatchTheCatGame({
      w: 13,
      h: 13,
      r: 20,
      backgroundColor: 0xeeeeee,
      parent: "catch-the-cat",
      statusBarAlign: "center",
      credit: "孙同学的小游戏",
    });
    // console.log(gamestatestx)
    this.setinterval1 = setInterval(this.getText, 100);
    this.postIfLoginFn();
  },
  beforeRouteLeave(to, form, next) {
    clearInterval(this.setinterval1);
    next();
  },
};
</script>

<style scoped lang="less">
#catch-the-cat {
  display: flex;
  justify-content: center;
}
h1 {
  padding: 100px 0 10px;
  font-size: 40px;
}
h1,
p {
  text-align: center;
}
.gameBox {
  height: 809px;
}
</style>