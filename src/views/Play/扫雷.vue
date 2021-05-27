<template>
  <div class="sl">
    <Nav @postLogin="postIfLoginFn"></Nav>
    <Leader gameName="扫雷" ref="lea"></Leader>
    <h1>扫雷</h1>
    <h2 @click="reboot()">{{ face }}</h2>

    <p>
      （简单：9*9*10）
      {{
        record === 0
          ? "登录后查看并上传您的游戏记录"
          : !record
          ? "您还未通关哦！"
          : `您的纪录是：${toTime(record)}`
      }}
    </p>
    <div class="area">
      <div
        v-for="(item, index) in map"
        :class="{
          boomBox: item.click === 0,
          clickBox: item.click === 1,
          flagBox: item.click === 2,
          onlyread: item.read === 1,
        }"
        :style="item.color"
        :key="index"
        @click="handleclick(index)"
        @contextmenu.prevent="right(index)"
      >
        {{ clickData[index] }}
      </div>
    </div>
    <div class="tip">
      游戏时间：<span>{{ toTime(time) }}</span>
    </div>
    <div class="tip">{{ tip }}</div>
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
      w: 9,
      h: 9,
      mine: 10,
      num: 0,
      mapData: [],
      clickData: [],
      map: [],
      tip: "",
      time: 0,
      startTime: "",
      userId: "游客",
      record: 0,
      face: "😁",
    };
  },
  watch: {},
  methods: {
    reboot() {
      this.num = 0;
      this.mapData = [];
      this.clickData = [];
      this.map = [];
      this.time = 0;
      this.face = "😁";
      this.stop();
      this.startTime = "";
      this.tip = "";
      /*地图生成*/
      this.createMap();
      /*雷数据生成*/
      this.createMineData();
    },
    toTime(num) {
      var myDate = new Date(num * 1);
      var min = myDate.getMinutes();
      min < 10 ? (min = "0" + min) : (min = min);
      var s = myDate.getSeconds();
      s < 10 ? (s = "0" + s) : (s = s);
      let ms = myDate.getMilliseconds() / 10;
      ms < 10 ? (ms = "0" + ms) : (ms = ms);
      return min + ":" + s + "." + ms;
    },
    start() {
      this.time += 10;
      this.startTime = setInterval(this.timeup, 10);
    },
    timeup() {
      this.time += 10;
    },
    stop() {
      clearInterval(this.startTime);
    },
    initClickArr() {
      for (let i = 0; i < this.w * this.h; i++) {
        this.clickArr[i] = false;
      }
    },
    createMap() {
      let str = ``;
      for (let i = 0; i < this.h; i++) {
        for (let j = 0; j < this.w; j++) {
          let box = {
            boom: "",
            num: 0,
            click: 0,
            read: 0,
            color: {
              backgroundColor: "#eee",
            },
          };
          this.map.push(box);
        }
      }
    },
    createMineData() {
      this.mapData = [];
      for (let i = 0; i < this.w * this.h; i++) {
        this.mapData.push(0);
      }
      let count = 0;
      while (count < this.mine) {
        let rdm = Math.floor(Math.random() * this.w * this.h);
        if (this.mapData[rdm] === 0) {
          this.mapData[rdm] = "💣";
          count++;
        }
      }
      this.calculate();
    },
    calculate() {
      for (let i = 0; i < this.mapData.length; i++) {
        let count = 0;
        if (this.mapData[i] === 0) {
          /*左上*/
          i % this.w !== 0 && this.mapData[i - this.w - 1] === "💣" && count++;
          /*上*/
          this.mapData[i - this.w] === "💣" && count++;
          /*右上*/
          i % this.w !== this.w - 1 &&
            this.mapData[i - this.w + 1] === "💣" &&
            count++;
          /*左*/
          i % this.w !== 0 && this.mapData[i - 1] === "💣" && count++;
          /*右*/
          i % this.w !== this.w - 1 && this.mapData[i + 1] === "💣" && count++;
          /*左下*/
          i % this.w !== 0 && this.mapData[i + this.w - 1] === "💣" && count++;
          /*下*/
          this.mapData[i + this.w] === "💣" && count++;
          /*右下*/
          i % this.w !== this.w - 1 &&
            this.mapData[i + this.w + 1] === "💣" &&
            count++;
          this.mapData[i] = count;
        }

        if (this.mapData[i] === 0) {
          this.mapData[i] = "";
        }
      }
    },
    right(index) {
      if (this.num === 0) {
        this.start();
      }
      this.map[index].click = 2;
      this.clickData[index] = "🚩";
    },
    handleclick(index) {
      if (this.num === 0) {
        this.start();
      }
      if (this.map[index].click !== 1) {
        this.map[index].click = 1;
        this.map[index].read = 1;
      }
      this.num += 1;
      this.check(index);
      if (this.mapData[index] == "") {
        //左上
        index % this.w !== 0 &&
          this.mapData[index - 1 - this.w] !== undefined &&
          this.map[index - 1 - this.w].click === 0 &&
          this.handleclick(index - 1 - this.w);
        // 上
        this.mapData[index - this.w] !== undefined &&
          this.map[index - this.w].click === 0 &&
          this.handleclick(index - this.w);
        // 右上
        index % this.w !== this.w - 1 &&
          this.mapData[index + 1 - this.w] !== undefined &&
          this.map[index + 1 - this.w].click === 0 &&
          this.handleclick(index + 1 - this.w);
        // 左边
        index % this.w !== 0 &&
          this.mapData[index - 1] !== undefined &&
          this.map[index - 1].click === 0 &&
          this.handleclick(index - 1);
        // 右边
        index % this.w !== this.w - 1 &&
          this.mapData[index + 1] !== undefined &&
          this.map[index + 1].click === 0 &&
          this.handleclick(index + 1);
        // 左下
        index % this.w !== 0 &&
          this.mapData[index - 1 + this.w] !== undefined &&
          this.map[index - 1 + this.w].click === 0 &&
          this.handleclick(index - 1 + this.w);
        // 下
        this.mapData[index + this.w] !== undefined &&
          this.map[index + this.w].click === 0 &&
          this.handleclick(index + this.w);
        // 右下
        index % this.w !== this.w - 1 &&
          this.mapData[index + 1 + this.w] !== undefined &&
          this.map[index + 1 + this.w].click === 0 &&
          this.handleclick(index + 1 + this.w);
      }

      this.clickData[index] = this.mapData[index];
      if (this.mapData[index] === "💣" && this.map[index].click === 1) {
        this.stop();
        this.map[index].color = { backgroundColor: "red" };
        this.tip = "你输了哦~";
        this.face = "🤯";
        for (let i = 0; i < this.mapData.length; i++) {
          this.map[i].read = 1;
          if (this.map[i].click !== 2) {
            this.clickData[i] = this.mapData[i];
          }
        }
      }
    },
    update() {
      this.$refs.lea.updateLeader();
    },
    check(index) {
      if (
        this.num === this.w * this.h - this.mine &&
        this.mapData[index] !== "💣"
      ) {
        this.stop();
        this.tip = "恭喜过关！";
        this.face = "😎";
        for (let i = 0; i < this.mapData.length; i++) {
          this.map[i].read = 1;
        }
        if (!this.record || this.time < this.record) {
          postUserPlay({ _id: this.userId, gameName: "扫雷", num: this.time })
            .then(() => {
              this.record = this.time;
              this.update();
            })
            .catch(() => {});
        }
      }
    },
    postIfLoginFn() {
      postIfLogin().then((res) => {
        if (!res.data.userInfo) {
          this.userId = "游客";
          this.record = 0;
        } else {
          this.userId = res.data.userInfo._id;
          getUserPlay({ _id: this.userId, gameName: "扫雷" }).then((res) => {
            this.record = res.data.num * 1;
          });
        }
      });
    },
  },
  mounted() {
    this.postIfLoginFn();

    /*地图生成*/
    this.createMap();
    /*雷数据生成*/
    this.createMineData();
  },
};
</script>

<style scoped lang="less">
.sl {
  height: 975px;
}
h1 {
  padding: 100px 0 10px;
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

.area {
  margin: 0 auto;
  border: 1px #000 solid;
  display: block;
  width: 450px;
  height: 450px;
  .boomBox {
    float: left;
    width: 50px;
    height: 50px;
    border-top: 5px #aaa solid;
    border-left: 5px #aaa solid;
    border-bottom: 5px #111 solid;
    border-right: 5px #111 solid;
    box-sizing: border-box;
    text-align: center;
    font-size: 24px;
    line-height: 40px;
  }
  .clickBox {
    float: left;
    width: 50px;
    height: 50px;
    border: 2px solid rgb(204, 204, 204);
    box-sizing: border-box;
    text-align: center;
    font-size: 24px;
    line-height: 46px;
  }
  .flagBox {
    float: left;
    width: 50px;
    height: 50px;
    border-top: 5px #aaa solid;
    border-left: 5px #aaa solid;
    border-bottom: 5px #111 solid;
    border-right: 5px #111 solid;
    box-sizing: border-box;
    text-align: center;
    font-size: 24px;
    line-height: 40px;
  }
  .onlyread {
    pointer-events: none;
  }
}

.tip {
  text-align: center;
  font-weight: bold;
  font-size: 50px;
  > span {
    font-family: "Pixel-LCD-7", "Microsoft YaHei", Sans-Serif;
  }
}
</style>