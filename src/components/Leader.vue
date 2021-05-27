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
  <div id="Leader">
    <div class="l">
      <h3>{{ gameName }}游戏排行</h3>
      <ul>
        <li v-for="(item, index) in leaderList" :key="index">
          <i>{{ index + 1 }}</i>
          <p class="name">{{ item.user }}</p>
          <span class="num">{{
            gameName === "圈猫猫"
              ? `已通关${item.num}次`
              : gameName === "俄罗斯方块"
              ? `${item.num}分`
              : toTime(item.num)
          }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import request from "../api/index";
let getLeader = request.getLeader;

export default {
  name: "Leader",
  data() {
    return {
      leaderList: [],
    };
  },
  props: ["gameName"],
  methods: {
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
    updateLeader() {
      getLeader({ gameName: this.gameName }).then((res) => {
        this.leaderList = res.data.data;
      });
    },
  },
  mounted() {
    getLeader({ gameName: this.gameName }).then((res) => {
      this.leaderList = res.data.data;
    });
  },
};
</script>

<style scoped lang="less">
#Leader {
  position: fixed;
  top: 70px;
  right: 100px;
  padding-top: 80px;
  width: 270px;
  user-select: none;
  > .l {
    box-sizing: border-box;
    width: 100%;
    margin-top: 20px;
    background-color: #fff;
    padding: 15px 20px 20px;
    border-radius: 15px;
    h3 {
      padding: 0 5px 10px;
      line-height: 30px;
      font-weight: 400;
      border-bottom: 1px solid #e8e9e7;
      color: #383937;
      position: relative;
      font-size: 18px;
    }
    ul {
      margin-top: 15px;
      font-size: 17px;
      li {
        overflow: hidden;
        height: 30px;
        line-height: 30px;
        margin: 7px 0;
        span,
        p {
          display: inline-block;
          line-height: 30px;
        }
        .name {
          float: left;
          margin-right: 12px;
          width: 90px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .num {
          float: left;
          font-family: "Pixel-LCD-7", "Microsoft YaHei", Sans-Serif;
        }
        i {
          float: left;
          display: block;
          width: 22px;
          height: 22px;
          margin-top: 2.5px;
          margin-right: 4px;
          font-style: normal;
          color: #666;
          line-height: 22px;
          text-align: center;
          font-size: 21px;
          border-radius: 100%;
          background-color: #edefee;
          font-family: FZJianQRTJW;
        }
        &:nth-child(1) i {
          background-color: #e24d46;
          color: #fff;
        }
        &:nth-child(2) i {
          background-color: #2ea7e0;
          color: #fff;
        }
        &:nth-child(3) i {
          background-color: #6bc30d;
          color: #fff;
        }
      }
    }
  }
}
@media (max-width: 992px) {
  #Leader {
    right: 10px;
  }
}
</style>