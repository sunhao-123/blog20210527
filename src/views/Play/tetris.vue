<template>
  <div id="tetris" :style="height">
    <Nav @postLogin="postIfLoginFn"></Nav>
    <Leader gameName="俄罗斯方块" ref="lea"></Leader>
    <h1>俄罗斯方块</h1>
    <p>
      {{
        record === 0
          ? "登录后查看并上传您的游戏记录"
          : !record
          ? "您还未通关哦！"
          : `您的纪录是：${record} 分`
      }}
    </p>
    <div class="wrap">
      <div class="tips">Good!</div>
      <div class="now"></div>
      <div class="next"></div>
      <div class="score">
        SCORE: <span>{{ tetris.score }}</span>
      </div>
      <div class="lines">
        LINES: <span>{{ tetris.line }}</span>
      </div>
      <div class="level">
        LEVEL: <span>{{ tetris.level }}</span>
      </div>
      <div class="pause" @click="pause">开始</div>
      <div class="refresh" @click="reStart">重新开始</div>
      <div class="btn" v-if="flag">
        <div class="up" @click="moveRotate">△</div>
        <div
          class="down"
          @mousedown="quickDown"
          @mouseup="tetris.quick = false"
        >
          ▽
        </div>
        <div class="leftbtn" @click="moveLeft">◁</div>
        <div class="rightbtn" @click="moveRight">▷</div>
      </div>
    </div>
    <div class="wrap_prompt">
      <div class="prompt">
        <div>×</div>
        <span class="failed">游戏失败</span>
        <span class="restart" @click="reStart">重新开始</span>
      </div>
    </div>
    <div id="box"></div>
  </div>
</template>

<script>
import Nav from "../../components/Nav";
import Leader from "../../components/Leader";
import request from "../../api";

const postIfLogin = request.postIfLogin;
const postUserPlay = request.postUserPlay;
const getUserPlay = request.getUserPlay;

export default {
  name: "SL",
  components: { Nav, Leader },
  data() {
    return {
      flag: false,
      height: {},
      userId: "游客",
      record: 0,
      boxBlockStyle:
        "position: absolute;width: 25px;height: 25px;transform: rotate(0);transition: 0.25s;",
      clBoxBlockStyle:
        "position: absolute;transition: 1s !important;transform: rotate(0deg) translateX(0px) translateY(0px);width: 12.5px !important;height: 12.5px !important;border: none !important;",
      tetris: {
        // 父容器
        box: null, //document.getElementById('box'),
        // 游戏状态，0未开始，1运行，2终止
        status: 0,
        quick: false,
        // 游戏分数
        line: 0,
        level: 0,
        score: 0,
        // 时间间隔、定时器
        step: 400,
        timer: null,
        // 游戏面板，数组 对应 div
        board: null,
        boardDiv: null,
        // 当前方块
        nowBlock: null,
        // 下一方块
        nextBlock: null,
      },
    };
  },
  watch: {},
  created: function () {
    let _this = this;
    document.onkeydown = this.keyControl;
    document.onkeyup = (e) => {
      if (e.keyCode == 32) this.tetris.quick = false;
    };
  },
  methods: {
    init() {
      this.createBox();
      this.tetris.nowBlock = this.createBlock();
      this.tetris.nextBlock = this.createBlock();
      // 先显示一次
      this.drawBlock();
      this.drawNextBlock();

      // this.begin();
    },
    // 自动开始
    begin() {
      // 自动下行
      clearInterval(this.tetris.timer);
      this.tetris.timer = setInterval(() => {
        if (this.tetris.status == 1) this.moveDown();
      }, this.tetris.step);
    },
    // 暂停、开始
    pause() {
      let oBtn = document.body.querySelector(".wrap .pause");
      if (this.tetris.status == 0) {
        oBtn.innerHTML = "暂停";
        this.tetris.status = 1;
        this.begin();
        return true;
      }
      oBtn.innerHTML = "继续";
      this.tetris.status = 0;
      clearInterval(this.tetris.timer);
    },
    // 重新开始
    reStart() {
      clearInterval(this.tetris.timer);
      let oPrompt = document.body.querySelector(".wrap_prompt");
      let oBtn = document.body.querySelector(".wrap .pause");
      for (var i = 0; i < 21; i++) {
        for (var j = 0; j < 10; j++) {
          this.tetris.board[i][j] = 0;
          this.tetris.boardDiv[i * 10 + j].style.background = "";
        }
      }
      this.eraseNextBlock();
      this.tetris.nowBlock = this.createBlock();
      this.tetris.nextBlock = this.createBlock();
      this.drawBlock();
      this.drawNextBlock();

      oPrompt.style.display = "none";
      oBtn.innerHTML = "暂停";
      this.tetris.status = 1;
      this.begin();
      this.tetris.score = 0;
      this.tetris.line = 0;
      this.tetris.level = 0;
      this.tetris.step = 400;
    },
    // 创建容器
    createBox() {
      var str = "";
      // 生成父容器
      this.tetris.box = document.querySelector("#box");
      // 生成10*21的游戏矩阵
      this.tetris.board = new Array(21);
      for (var i = 0; i < 21; i++) {
        this.tetris.board[i] = new Array(10);
        for (var j = 0; j < 10; j++) {
          this.tetris.board[i][j] = 0;
          str += `<div class="boxBlock" style="${this.boxBlockStyle}left:${
            j * 26
          }px;top:${i * 26}px"></div>`;
        }
      }
      // 生成4*4的提示矩阵
      for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          str += `<div class="boxBlock" style="${this.boxBlockStyle}left:${
            280 + j * 26
          }px;top:${i * 26}px"></div>`;
        }
      }

      this.tetris.box.innerHTML = str;
      //document.body.appendChild(this.tetris.box);
      this.tetris.boardDiv = document.querySelectorAll("#box > div");
    },
    // 创建方块
    createBlock() {
      var block = new Array(5);
      var num = Math.floor(Math.random() * 7);
      switch (num) {
        case 0: {
          block[0] = { x: -2, y: 4 }; //**
          block[1] = { x: -1, y: 4 }; //**
          block[2] = { x: -2, y: 5 };
          block[3] = { x: -1, y: 5 };
          block[4] = "#800000";
          break;
        }
        case 1: {
          block[0] = { x: -1, y: 3 }; //****
          block[1] = { x: -1, y: 4 };
          block[2] = { x: -1, y: 5 };
          block[3] = { x: -1, y: 6 };
          block[4] = "#6A5ACD";
          break;
        }
        case 2: {
          block[0] = { x: -3, y: 5 }; // *
          block[1] = { x: -2, y: 4 }; //**
          block[2] = { x: -2, y: 5 }; //*
          block[3] = { x: -1, y: 4 };
          block[4] = "#6A5ACD";
          break;
        }
        case 3: {
          block[0] = { x: -3, y: 4 }; //*
          block[1] = { x: -2, y: 4 }; //**
          block[2] = { x: -2, y: 5 }; // *
          block[3] = { x: -1, y: 5 };
          block[4] = "#D2691E";
          break;
        }
        case 4: {
          block[0] = { x: -2, y: 4 }; //*
          block[1] = { x: -1, y: 4 }; //***
          block[2] = { x: -1, y: 5 };
          block[3] = { x: -1, y: 6 };
          block[4] = "#FF4500";
          break;
        }
        case 5: {
          block[0] = { x: -3, y: 4 }; //*
          block[1] = { x: -2, y: 4 }; //*
          block[2] = { x: -1, y: 4 }; //**
          block[3] = { x: -1, y: 5 };
          block[4] = "#8FBC8B";
          break;
        }
        case 6: {
          block[0] = { x: -2, y: 5 }; // *
          block[1] = { x: -1, y: 4 }; //***
          block[2] = { x: -1, y: 5 };
          block[3] = { x: -1, y: 6 };
          block[4] = "#4682B4";
          break;
        }
      }
      return block;
    },
    // 绘制方块
    drawBlock() {
      for (var i = 0; i < 4; i++) {
        if (this.tetris.nowBlock[i].x < 0) continue;
        this.tetris.board[this.tetris.nowBlock[i].x][
          this.tetris.nowBlock[i].y
        ] = 1;
        this.tetris.boardDiv[
          this.tetris.nowBlock[i].x * 10 + this.tetris.nowBlock[i].y
        ].style.background = "#6A5ACD";
      }
    },
    // 清除方块
    eraseBlock() {
      for (var i = 0; i < 4; i++) {
        if (this.tetris.nowBlock[i].x < 0) continue;
        this.tetris.board[this.tetris.nowBlock[i].x][
          this.tetris.nowBlock[i].y
        ] = 0;
        this.tetris.boardDiv[
          this.tetris.nowBlock[i].x * 10 + this.tetris.nowBlock[i].y
        ].style.background = "";
      }
    },
    // 绘制预览方块
    drawNextBlock() {
      var nextBlock = this.tetris.nextBlock;
      // 位置修正，取得x坐标、y坐标中最小值，所有x加最小，所有y减最小值，即向左上位置移动到0
      var x = 10,
        y = 10;
      for (var i = 0; i < 4; i++) {
        if (nextBlock[i].x < x) {
          x = nextBlock[i].x;
        }
        if (nextBlock[i].y < y) {
          y = nextBlock[i].y;
        }
      }
      for (var i = 0; i < 4; i++) {
        this.tetris.boardDiv[
          210 + (nextBlock[i].x - x) * 4 + nextBlock[i].y - y
        ].style.background = "#6A5ACD";
      }
    },
    // 清除预览方块
    eraseNextBlock() {
      for (var i = 0; i < 16; i++) {
        this.tetris.boardDiv[210 + i].style.background = "";
      }
    },
    // 绘制所有
    drawBox() {
      for (var i = 0; i < this.tetris.board.length; i++) {
        for (var j = 0; j < this.tetris.board[i].length; j++) {
          if (this.tetris.board[i][j]) {
            this.tetris.boardDiv[i * 10 + j].style.background = "#6A5ACD";
          }
        }
      }
    },
    // 清除所有
    eraseBox() {
      for (var i = 0; i < 210; i++) {
        this.tetris.boardDiv[i].style.background = "";
      }
    },
    // 左移
    // return array
    // 绘制方块
    moveLeft() {
      if (this.tryLeft()) {
        // 可以左移
        this.eraseBlock();
        for (var i = 0; i < 4; i++) {
          this.tetris.nowBlock[i].y = this.tetris.nowBlock[i].y - 1;
        }
        this.drawBlock();
      }
    },
    // 尝试左移
    // return boolean(true|false)
    tryLeft() {
      this.eraseBlock();
      for (var i = 0; i < 4; i++) {
        if (this.tetris.nowBlock[i].x < 0 && this.tetris.nowBlock[i].y > 0)
          continue;
        if (
          this.tetris.nowBlock[i].y - 1 == -1 ||
          this.tetris.board[this.tetris.nowBlock[i].x][
            this.tetris.nowBlock[i].y - 1
          ]
        ) {
          this.drawBlock();
          return false;
        }
      }
      return true;
    },
    // 右移
    // return array
    // 绘制方块
    moveRight() {
      if (this.tryRight()) {
        // 可以右移
        this.eraseBlock();
        for (var i = 0; i < 4; i++) {
          this.tetris.nowBlock[i].y = this.tetris.nowBlock[i].y + 1;
        }
        this.drawBlock();
      }
    },
    // 尝试右移
    // return boolean(true|false)
    tryRight() {
      this.eraseBlock();
      for (var i = 0; i < 4; i++) {
        if (this.tetris.nowBlock[i].x < 0 && this.tetris.nowBlock[i].y + 1 < 10)
          continue;
        if (
          this.tetris.nowBlock[i].y + 1 == 10 ||
          this.tetris.board[this.tetris.nowBlock[i].x][
            this.tetris.nowBlock[i].y + 1
          ]
        ) {
          this.drawBlock();
          return false;
        }
      }
      return true;
    },
    // 旋转
    // return array
    // 绘制方块
    moveRotate() {
      if (this.tryRotate()) {
        this.eraseBlock();
        var dx = Math.round(
          (this.tetris.nowBlock[0].x +
            this.tetris.nowBlock[1].x +
            this.tetris.nowBlock[2].x +
            this.tetris.nowBlock[3].x) /
            4
        );
        var dy = Math.round(
          (this.tetris.nowBlock[0].y +
            this.tetris.nowBlock[1].y +
            this.tetris.nowBlock[2].y +
            this.tetris.nowBlock[3].y) /
            4
        );
        for (var i = 0; i < 4; i++) {
          // dx - dy + this.tetris.nowBlock[i].y	//旋转之后的新x坐标
          // dx + dy - this.tetris.nowBlock[i].x	//旋转之后的新y坐标
          var newX = dx - dy + this.tetris.nowBlock[i].y;
          var newY = dx + dy - this.tetris.nowBlock[i].x;
          this.tetris.nowBlock[i].x = newX;
          this.tetris.nowBlock[i].y = newY;
        }
        this.drawBlock();
      }
    },
    // 尝试旋转
    // return boolean(true|false)
    tryRotate() {
      this.eraseBlock();
      var dx = Math.round(
        (this.tetris.nowBlock[0].x +
          this.tetris.nowBlock[1].x +
          this.tetris.nowBlock[2].x +
          this.tetris.nowBlock[3].x) /
          4
      );
      var dy = Math.round(
        (this.tetris.nowBlock[0].y +
          this.tetris.nowBlock[1].y +
          this.tetris.nowBlock[2].y +
          this.tetris.nowBlock[3].y) /
          4
      );
      for (var i = 0; i < 4; i++) {
        // dx - dy + this.tetris.nowBlock[i].y	//旋转之后的新x坐标
        // dx + dy - this.tetris.nowBlock[i].x	//旋转之后的新y坐标
        var newX = dx - dy + this.tetris.nowBlock[i].y;
        var newY = dx + dy - this.tetris.nowBlock[i].x;
        if (newX < 0 || newY < 0 || newY > 9 || this.tetris.board[newX][newY]) {
          this.drawBlock();
          return false;
        }
      }
      return true;
    },
    // 快速下移
    quickDown() {
      if (this.tetris.quick) return;
      var timer = setInterval(() => {
        if (this.tryDown()) {
          this.eraseBlock();
          for (var i = 0; i < 4; i++) {
            this.tetris.nowBlock[i].x = this.tetris.nowBlock[i].x + 1;
          }
          this.drawBlock();
        } else {
          clearInterval(timer);
        }
      }, 10);
      this.tetris.quick = true;
    },
    // 下移
    // return array
    // 绘制方块
    moveDown() {
      if (this.tryDown()) {
        // 可以下移
        this.eraseBlock();
        for (var i = 0; i < 4; i++) {
          this.tetris.nowBlock[i].x = this.tetris.nowBlock[i].x + 1;
        }
        this.drawBlock();
      } else {
        // 不能下移，尝试消行，尝试消行完毕，产生新块
        if (this.tetris.status != 1) return;
        this.tryDelLine();
        this.shakeScreen();

        this.tetris.nowBlock = this.tetris.nextBlock;
        this.tetris.nextBlock = this.createBlock();
        // 先显示一次（删除旧的，显示新的）
        this.eraseBlock();
        this.drawBlock();
        this.eraseNextBlock();
        this.drawNextBlock();
      }
    },
    // 尝试下移
    // return boolean(true|false)
    tryDown() {
      let oPrompt = document.body.querySelector(".wrap_prompt");
      this.eraseBlock();
      for (var i = 0; i < 4; i++) {
        if (this.tetris.nowBlock[i].x < 0) continue;
        if (
          this.tetris.nowBlock[i].x + 1 == 21 ||
          this.tetris.board[this.tetris.nowBlock[i].x + 1][
            this.tetris.nowBlock[i].y
          ]
        ) {
          this.drawBlock();
          for (var j = 0; j < 4; j++) {
            if (this.tetris.nowBlock[j].x == 0) {
              this.uploadLeader();
              oPrompt.style.display = "block";
              this.tetris.status = 2;
              return false;
            }
          }
          return false;
        }
      }
      return true;
    },
    // 尝试消行
    // 消行成功得分，所有上方的下移（删除当前行），添加空行（数组unshift一个空值）
    tryDelLine() {
      var line = 0;
      var num = 0;
      for (var i = 0; i < this.tetris.board.length; i++) {
        for (var j = 0; j < this.tetris.board[i].length; j++) {
          if (this.tetris.board[i][j]) {
            num++;
          }
        }
        if (num == 10) {
          line++;
          this.bombBlock(i);
          this.tetris.board.splice(i, 1);
          this.addNewLine();
          /*this.eraseBox();
            this.drawBox();*/
          setTimeout(() => {
            this.eraseBox();
            this.drawBox();
          }, 250);
        }
        num = 0;
      }
      this.tipScore(line);
    },
    // 添加空行
    addNewLine() {
      var newLine = new Array(10);
      for (var i = 0; i < newLine.length; i++) {
        newLine[i] = 0;
      }
      this.tetris.board.unshift(newLine);
    },
    // 得分提示
    tipScore(line) {
      let oTips = document.body.querySelector(".wrap .tips");
      if (line == 0) return;
      var txt = "";
      var num = 1;
      switch (line) {
        case 1:
          this.tetris.score += 1;
          txt = "Good!";
          break;
        case 2:
          this.tetris.score += 3;
          txt = "Great!";
          break;
        case 3:
          this.tetris.score += 5;
          txt = "Wonderful!";
          break;
        case 4:
          this.tetris.score += 7;
          txt = "Perfect!";
          break;
      }
      this.tetris.line += line;
      if (Math.floor(this.tetris.line / 10) > this.tetris.level) {
        this.tetris.level++;
        this.tetris.step -= 70;
        this.begin();
      }

      oTips.style.display = "block";
      oTips.innerHTML = txt;
      var timer = setInterval(() => {
        num += 0.1;
        oTips.style.opacity = Math.abs(num - 3);
        oTips.style.transform = "scale(" + num + ")";
        if (num >= 3) {
          clearInterval(timer);
          oTips.style.display = "none";
        }
      }, 30);
    },
    // 振动屏幕
    shakeScreen() {
      let oWrap = document.body.querySelector(".wrap");
      var px = 10;
      this.tetris.box.style.transform = "translateY(" + px + "px)";
      oWrap.style.transform = "translateY(" + px + "px)";
      setTimeout(() => {
        this.tetris.box.style.transform = "";
        oWrap.style.transform = "";
      }, 30);
    },
    // 爆裂方块
    bombBlock(i) {
      let html = "";
      for (var j = 0; j < this.tetris.board[i].length; j++) {
        this.tetris.boardDiv[i * 10 + j].style.background = "";
        for (var m = 0; m < 2; m++) {
          for (var n = 0; n < 2; n++) {
            html = `<div class="clDiv" style="${this.clBoxBlockStyle}left:${
              12.5 * n + j * 26
            }px;top:${
              12.5 * m + i * 26
            }px;opacity: 1; background: #6A5ACD;"></div>`;

            this.tetris.box.innerHTML += html;
            // this.boombox += html;
          }
        }
      }
      var cloneDiv = document.querySelectorAll(".clDiv");
      for (let a = 0; a < cloneDiv.length; a++) {
        this.bomb(cloneDiv[a]);
      }
      this.tetris.boardDiv = document.querySelectorAll("#box > div");
    },
    bomb(obj, i, j) {
      setTimeout(() => {
        obj.style.transform =
          "rotate(" +
          (720 + 720 * 2 * (Math.random() - 0.5)) +
          "deg) translateX(" +
          400 * (Math.random() - 0.5) +
          "px) translateY(" +
          400 * (Math.random() - 0.5) +
          "px)";
        obj.style.opacity = 0;
        setTimeout(() => {
          //this.tetris.boardDiv.removeChild(obj);
        }, 800);
      }, 16);
    },
    // 游戏彩蛋
    easterEgg() {
      var i = Math.round(Math.random() * (20 - 10) + 10);
      var j = Math.floor(Math.random() * 10);
      this.tetris.boardDiv[i * 10 + j].style.background = "#f0f";
    },
    // 方向控制，状态为1（运行）时可操作
    keyControl(e) {
      if (this.tetris.status != 1 && e.keyCode != 80) return;
      switch (e.keyCode) {
        case 32:
          this.quickDown();
          break;
        case 37:
          this.moveLeft();
          break;
        case 38:
          this.moveRotate();
          break;
        case 39:
          this.moveRight();
          break;
        case 40:
          this.moveDown();
          break;
        case 80:
          this.pause();
          break;
      }
    },
    uploadLeader() {
      if (!this.record || this.tetris.score > this.record) {
        postUserPlay({
          _id: this.userId,
          gameName: "俄罗斯方块",
          num: this.tetris.score,
        })
          .then(() => {
            this.record = this.tetris.score;
            this.update();
          })
          .catch(() => {});
      }
    },
    update() {
      this.$refs.lea.updateLeader();
    },
    postIfLoginFn() {
      postIfLogin().then((res) => {
        if (!res.data.userInfo) {
          this.userId = "游客";
          this.record = 0;
        } else {
          this.userId = res.data.userInfo._id;
          getUserPlay({ _id: this.userId, gameName: "俄罗斯方块" }).then(
            (res) => {
              // console.log(res.data);
              this.record = res.data.num * 1;
            }
          );
        }
      });
    },
    IsMobile() {
      let flag = navigator.userAgent.match(
        /(Safari|IOS|WebOS|phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      );
      let app = navigator.userAgent.split("/")[1].toLowerCase() === "app";
      this.flag = !!flag;
      if (!!flag) {
        this.height = {
          height: "1290px",
        };
      } else if (!!app) {
        this.height = {
          height: "761px",
        };
      } else {
        this.height = {
          height: "860px",
        };
      }
    },
  },
  mounted() {
    this.init();
    this.postIfLoginFn();
    this.IsMobile();
  },
};
</script>

<style scoped lang="less">
#tetris {
  overflow: hidden;
  h1 {
    padding: 64px 0 10px;
    font-size: 40px;
  }
  h2 {
    text-align: center;
    font-size: 32px;
    margin-bottom: 20px;
  }
  h1,
  p {
    text-align: center;
  }
  .wrap {
    position: absolute;
    left: 50%;
    top: 169px;
    width: 385px;
    height: 547px;
    margin-left: -193px;
    /*box-shadow: 0px 0px 5px 5px rgba(255,125,0, 0.6);*/
  }
  .wrap div {
    position: absolute;
  }
  .wrap .now {
    left: 0;
    top: 0;
    width: 261px;
    height: 547px;
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.6);
  }
  .wrap .next {
    right: 0;
    top: 0;
    width: 105px;
    height: 105px;
    background-color: rgba(255, 255, 255, 0.5);
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.6);
  }
  .wrap .score,
  .wrap .lines,
  .wrap .level,
  .wrap .pause,
  .wrap .btn,
  .wrap .refresh {
    left: 280px;
    top: 170px;
    width: 99px;
    height: 40px;
    line-height: 40px;
    padding-left: 6px;
    color: #f0907a;
    /*font-weight: bold;*/
    border: 0 none;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .wrap .lines {
    top: 240px;
    color: #4daedd;
  }
  .wrap .level {
    top: 310px;
    color: #ff0033;
  }
  .wrap .pause,
  .wrap .refresh {
    top: 430px;
    width: 105px;
    padding-left: 0px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    z-index: 2;
  }
  .wrap .pause:hover,
  .wrap .refresh:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .wrap .refresh {
    top: 510px;
  }

  .wrap .btn {
    box-sizing: border-box;
    padding: 0;
    border-radius: 0;
    width: 385px;
    height: 385px;
    top: 603px;
    left: 0;
    background-color: rgba(255, 255, 255, 0.5);
    -webkit-box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.6);
    box-shadow: 0px 0px 5px 5px rgba(0, 0, 0, 0.6);
    .up,
    .down,
    .leftbtn,
    .rightbtn {
      width: 128px;
      height: 128px;
      border: 0 none;
      border-radius: 20px;
      background-color: rgba(0, 0, 0, 0.6);
      text-align: center;
      line-height: 128px;
      font-size: 120px;
      font-weight: bold;
      z-index: 3;
    }
    .up,
    .down {
      left: 128.5px;
    }
    .leftbtn,
    .rightbtn {
      top: 128.5px;
    }
    .up {
      top: 3px;
    }
    .leftbtn {
      left: 3px;
    }
    .down {
      bottom: 3px;
    }
    .rightbtn {
      right: 3px;
    }
  }

  .wrap .tips {
    display: none;
    left: 0px;
    top: 150px;
    width: 261px;
    height: 80px;
    line-height: 80px;
    color: #fff;
    font-size: 42px;
    font-weight: bolder;
    text-align: center;
    text-shadow: 0px 0px 5px #0f0;
    z-index: 2;
  }
  .wrap_prompt {
    display: none;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 5;
  }
  .wrap_prompt .prompt {
    position: absolute;
    left: 50%;
    top: 354px;
    width: 221px;
    height: 137px;
    margin-left: -172px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 6;
  }
  .wrap_prompt .prompt div {
    width: 51px;
    height: 51px;
    line-height: 51px;
    margin-left: 85px;
    margin-top: 20px;
    color: #fff;
    font-size: 30px;
    text-align: center;
    border: 2px solid #fff;
    border-radius: 100%;
  }
  .wrap_prompt .prompt .failed,
  .wrap_prompt .prompt .restart {
    display: block;
    color: #f00;
    line-height: 40px;
    text-align: center;
  }
  .wrap_prompt .prompt .restart {
    width: 121px;
    margin-left: 50px;
    color: #646464;
    background: yellow;
    border-radius: 50px;
    cursor: pointer;
  }
  #box {
    position: relative;
    width: 385px;
    height: 547px;
    margin: 20px auto;
  }
}
</style>