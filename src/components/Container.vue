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
  <div id="Container">
    <div class="timebox">
      <div class="box">
        <div class="nav">
          <p class="tj_today">
            <span class="bd cshake">
              <b></b>
            </span>
            <em>
              <i class="fa fa-fw fa-bar-chart cc_cursor"></i>
              文章总数: {{ articleCount }}
            </em>
          </p>
          <p class="tj_today">
            <span class="bd cshake">
              <b></b>
            </span>
            <em>
              <i class="fa fa-fw fa-users cc_cursor"></i>
              注册人数: {{ userCount }}
            </em>
          </p>
          <p class="tj_today">
            <span class="bd cshake">
              <b></b>
            </span>
            <em>
              <i class="fa fa-fw fa-calendar-o"></i>
              留言数量: {{ messageCount }}
            </em>
          </p>
          <p class="tj_today">
            <span class="bd cshake">
              <b></b>
            </span>
            <em>
              <i class="fa fa-fw fa-leaf cc_pointer"></i>
              友链数量: {{ linkCount }}
            </em>
          </p>
        </div>
        <div class="time">
          <div id="clock_c">{{ nowtime }}</div>
          <div class="cweek">
            <strong>
              <span>{{ weekC }}/</span>
            </strong>
            <em>{{ weekE }}</em>
          </div>
          <div id="date_c">{{ nowdate }}</div>
        </div>
      </div>
    </div>
    <el-container>
      <el-main>
        <ArticleShow></ArticleShow>
      </el-main>
      <el-aside>
        <div class="gg" ref="gg">
          <h3><i class="el-icon-chat-line-round"></i>&nbsp;&nbsp;公告</h3>
          <div class="gg_content" v-html="gg !== `` ? `<div>${gg}</div>` : `<div><p>暂无公告</p></div>`"></div>
        </div>
        <div class="weather">
          <p class="ipaddress">当前IP定位地址：</p>
          <p class="city">{{ weather.city }}</p>
          <div class="nowtemp">
            <img
              :src="'./bw-256/' + weather.nowweather.now.icon + '.png'"
              width="256"
              height="256"
              alt=""
            />
            <div class="tempnum">{{ weather.nowweather.now.temp }}℃</div>
            <div class="temptext">{{ weather.nowweather.now.text }}</div>
            <div class="feelsLike">
              体感温度：{{ weather.nowweather.now.feelsLike }}℃
            </div>
          </div>
          <div class="infobox">
            <div class="info">
              <img
                class="infoimg"
                :src="'./bw-256/hum.png'"
                width="72"
                height="72"
                alt=""
              />
              <div class="infocont">{{ weather.nowweather.now.humidity }}%</div>
              <div class="infotext">湿度</div>
            </div>
            <div class="info">
              <img class="infoimg" :src="'./bw-256/yun.png'" alt="" />
              <div class="infocont">{{ weather.nowweather.now.cloud }}%</div>
              <div class="infotext">云量</div>
            </div>
            <div class="info">
              <img class="infoimg" :src="'./bw-256/pressure.png'" alt="" />
              <div class="infocont">
                {{ Math.round((weather.nowweather.now.pressure * 1) / 10) }}kPa
              </div>
              <div class="infotext">大气压</div>
            </div>
            <div class="info">
              <img class="infoimg" :src="'./bw-256/wind.png'" alt="" />
              <div class="infocont">
                {{ weather.nowweather.now.windScale }}级
              </div>
              <div class="infotext">{{ weather.nowweather.now.windDir }}</div>
            </div>
            <div class="info">
              <img class="infoimg" :src="'./bw-256/feng.png'" alt="" />
              <div class="infocont">
                {{ weather.nowweather.now.windSpeed }}km/h
              </div>
              <div class="infotext">风速</div>
            </div>
            <div class="info">
              <img class="infoimg" :src="'./bw-256/vis.png'" alt="" />
              <div class="infocont">{{ weather.nowweather.now.vis }}km</div>
              <div class="infotext">能见度</div>
            </div>
          </div>
          <div class="threedays">
            <div class="daybox">
              <p class="day">今天</p>
              <img
                class="infoimg"
                :src="'./bw-256/' + weather.weather[0].iconDay + '.png'"
                alt=""
              />
              <div class="infocont">
                {{ weather.weather[0].tempMin }}~{{
                  weather.weather[0].tempMax
                }}℃
              </div>
            </div>
            <div class="daybox">
              <p class="day">明天</p>
              <img
                class="infoimg"
                :src="'./bw-256/' + weather.weather[1].iconDay + '.png'"
                alt=""
              />
              <div class="infocont">
                {{ weather.weather[1].tempMin }}~{{
                  weather.weather[1].tempMax
                }}℃
              </div>
            </div>
            <div class="daybox">
              <p class="day">后天</p>
              <img
                class="infoimg"
                :src="'./bw-256/' + weather.weather[2].iconDay + '.png'"
                alt=""
              />
              <div class="infocont">
                {{ weather.weather[2].tempMin }}~{{
                  weather.weather[2].tempMax
                }}℃
              </div>
            </div>
          </div>
        </div>
        <div :class="['search', { fixed: ifSearchFixed }]">
          <div class="search-main">
            <input
              type="text"
              @input="handleInput"
              v-model="searchInput"
              placeholder="请输入搜索内容"
            />
            <i class="el-icon-search"></i>
            <ul v-if="!!searchList.length">
              <li v-for="item in searchList" :key="item._id">
                <router-link :to="'/Article/' + item._id">{{
                  item.title
                }}</router-link>
              </li>
            </ul>
          </div>
          <div class="search-article">
            <ul @mouseleave="handleMouseleave">
              <li
                @mouseenter="handleMouseenter(index)"
                v-for="(item, index) in getArticleTags"
                :key="index"
              >
                <router-link :to="'/blog/' + index">{{ item }}</router-link>
              </li>
            </ul>
            <div class="cover" :style="{ top: coverIndex * 40 + 'px' }"></div>
          </div>
        </div>
        <div class="recommend">
          <h3>置顶推荐</h3>
          <ul>
            <li v-if="!!getArticleRecommend.title">
              <i>{{ 1 }}</i>
              <router-link :to="'/Article/' + getArticleRecommend._id">{{
                getArticleRecommend.title
              }}</router-link>
            </li>
          </ul>
        </div>
        <div class="hot">
          <h3>热门文章</h3>
          <ul>
            <li v-for="(item, index) in articleHot" :key="index">
              <i>{{ index + 1 }}</i>
              <router-link :to="'/Article/' + item._id">{{
                item.title
              }}</router-link>
            </li>
          </ul>
        </div>
        <div class="visitor">
          <h3>最近访客</h3>
          <ul>
            <li
              v-for="item in visitor"
              :style="{ backgroundImage: 'url(' + item.user.photo + ')' }"
              @click="goToUser(item.user.user)"
              :key="item.user.photo"
            >
              <p>{{ item.user.user }}</p>
            </li>
          </ul>
        </div>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import ArticleShow from "./ArticleShow";

import request from "../api/index";
let getArticleInfo = request.getArticleInfo;
let getArticleHot = request.getArticleHot;
let getArticleSearch = request.getArticleSearch;
let getVisitor = request.getVisitor;
let getMessageCount = request.getMessageCount;
let getArticleCount = request.getArticleCount;
let getUserCount = request.getUserCount;
let getLinkCount = request.getLinkCount;
let getAnnouncement = request.getAnnouncement;
let getWeather = request.getWeather;

export default {
  name: "Container",
  data() {
    return {
      nowtime: "88:88:88",
      weekC: "星期一",
      weekE: "Monday",
      nowdate: "8888-88-88",
      messageCount: 0,
      articleCount: 0,
      userCount: 0,
      linkCount: 0,
      /*搜索框 v-model*/
      searchInput: "",
      searchList: [],
      searchTimer: null,

      /*控制search的clss名字*/
      ifSearchFixed: false,

      /*文章分类（tags）*/
      articleTags: [],

      /*热门文章列表*/
      articleHot: [],

      /*cover条的top值*/
      coverIndex: this.$route.params.id * 1,

      /*这是最近访客的数据*/
      visitor: [],

      gg: "",
      weather: {
        city: "正在定位...",
        nowweather: {
          code: "",
          fxLink: "",
          now: {
            cloud: "",
            dew: "",
            feelsLike: "",
            humidity: "",
            icon: 999,
            obsTime: "",
            precip: "",
            pressure: "",
            temp: "",
            text: "",
            vis: "",
            wind360: "",
            windDir: "",
            windScale: "",
            windSpeed: "",
          },
          refer: "",
          updateTime: "",
        },
        weather: [
          {
            cloud: "",
            fxDate: "",
            humidity: "",
            iconDay: 999,
            iconNight: "",
            moonPhase: "",
            moonrise: "",
            moonset: "",
            precip: "",
            pressure: "",
            sunrise: "",
            sunset: "",
            tempMax: "",
            tempMin: "",
            textDay: "",
            textNight: "",
            uvIndex: "",
            vis: "",
            wind360Day: "",
            wind360Night: "",
            windDirDay: "",
            windDirNight: "",
            windScaleDay: "",
            windScaleNight: "",
            windSpeedDay: "",
            windSpeedNight: "",
          },
          {
            cloud: "",
            fxDate: "",
            humidity: "",
            iconDay: 999,
            iconNight: "",
            moonPhase: "",
            moonrise: "",
            moonset: "",
            precip: "",
            pressure: "",
            sunrise: "",
            sunset: "",
            tempMax: "",
            tempMin: "",
            textDay: "",
            textNight: "",
            uvIndex: "",
            vis: "",
            wind360Day: "",
            wind360Night: "",
            windDirDay: "",
            windDirNight: "",
            windScaleDay: "",
            windScaleNight: "",
            windSpeedDay: "",
            windSpeedNight: "",
          },
          {
            cloud: "",
            fxDate: "",
            humidity: "",
            iconDay: 999,
            iconNight: "",
            moonPhase: "",
            moonrise: "",
            moonset: "",
            precip: "",
            pressure: "",
            sunrise: "",
            sunset: "",
            tempMax: "",
            tempMin: "",
            textDay: "",
            textNight: "",
            uvIndex: "",
            vis: "",
            wind360Day: "",
            wind360Night: "",
            windDirDay: "",
            windDirNight: "",
            windScaleDay: "",
            windScaleNight: "",
            windSpeedDay: "",
            windSpeedNight: "",
          },
        ],
      },
    };
  },
  computed: {
    getArticleTags() {
      return ["全部文章", ...this.articleTags];
    },
    getArticleRecommend() {
      return this.articleHot[0] || {};
    },
  },
  methods: {
    handleMouseenter(index) {
      this.coverIndex = index;
    },
    handleMouseleave() {
      this.coverIndex = this.$route.params.id * 1;
    },

    handleWindowScroll() {
      // console.log(document.documentElement.scrollTop)
      // console.log(document.documentElement.scrollTop - this.$refs.gg.offsetHeight)
      this.ifSearchFixed = document.documentElement.scrollTop >= (1540 + this.$refs.gg.offsetHeight);
    },

    goToUser(user) {
      this.$router.push(`/user/${user}`);
    },
    handleInput() {
      // console.log(this.searchInput);
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        let keywords = this.searchInput.trim(); //去除首位空格
        if (keywords) {
          getArticleSearch(keywords)
            .then((res) => {
              this.searchList = res.data.data;
            })
            .catch(() => {
              this.searchList = [];
            });
        } else {
          this.searchList = [];
        }
      }, 1000);
    },
    nowTime() {
      var myDate = new Date();
      var y = myDate.getFullYear().toString();
      var m = myDate.getMonth() + 1;
      m < 10 ? (m = "0" + m) : (m = m.toString());
      var d = myDate.getDate();
      d < 10 ? (d = "0" + d) : (d = d).toString();
      this.nowdate = y + "-" + m + "-" + d;
      this.changeWeek(myDate.getDay());
      var h = myDate.getHours();
      h < 10 ? (h = "0" + h) : (h = h.toString());
      var min = myDate.getMinutes();
      min < 10 ? (min = "0" + min) : (min = min.toString());
      var s = myDate.getSeconds();
      s < 10 ? (s = "0" + s) : (s = s.toString());
      var timeStr = h + ":" + min + ":" + s;
      return timeStr;
    },
    changeWeek(num) {
      switch (num) {
        case 0:
          this.weekC = "星期日";
          this.weekE = "Sunday";
          break;
        case 1:
          this.weekC = "星期一";
          this.weekE = "Monday";
          break;
        case 2:
          this.weekC = "星期二";
          this.weekE = "Tuesday";
          break;
        case 3:
          this.weekC = "星期三";
          this.weekE = "Wednesday";
          break;
        case 4:
          this.weekC = "星期四";
          this.weekE = "Thursday";
          break;
        case 5:
          this.weekC = "星期五";
          this.weekE = "Friday";
          break;
        case 6:
          this.weekC = "星期六";
          this.weekE = "Saturday";
          break;
        default:
          this.weekC = "星期日";
          this.weekE = "Sunday";
      }
    },
    changeNowTime() {
      this.timer = setInterval(() => {
        this.nowtime = this.nowTime();
      }, 500);
    },
    getWeather() {
      getWeather().then((res) => {
        this.weather = res.data;
        // console.log(this.weather);
      });
    },
  },
  components: {
    ArticleShow,
  },

  created() {
    this.getWeather();
    getAnnouncement().then((res) => {
      this.gg = res.data.data;
    });
    //请求分类
    getArticleInfo().then((res) => {
      this.articleTags = res.data.data.tags;
    });
    //请求热门文章
    getArticleHot().then((res) => {
      this.articleHot = res.data.data;
    });
    //请求最近访问者信息
    getVisitor().then((res) => {
      this.visitor = res.data.data;
    });
  },
  mounted() {
    this.handleWindowScroll();
    /*监听一下window的滚动事件*/
    window.addEventListener("scroll", this.handleWindowScroll);
    this.changeNowTime();
    getMessageCount().then((res) => {
      this.messageCount = res.data.data;
    });
    getArticleCount().then((res) => {
      this.articleCount = res.data.data;
    });
    getUserCount().then((res) => {
      this.userCount = res.data.data;
    });
    getLinkCount().then((res) => {
      this.linkCount = res.data.data;
    });
  },
  destroyed() {
    //离开当前路由之后，就不需要这个事件了
    window.removeEventListener("scroll", this.handleWindowScroll);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
};
</script>

<style scoped lang="less">
#Container {
  padding-top: 80px;
  width: 100%;
  user-select: none;
  .timebox {
    box-sizing: border-box;
    margin: 0 auto 20px;
    max-width: 1360px;
    padding: 0 50px;
    height: 165px;
    > .box {
      width: auto;
      margin-right: 320px;
      > .nav {
        margin-right: 30px;
        width: 100%;
        height: 165px;
        background-color: rgba(180, 180, 180, 0.3);
        border-radius: 15px;
        display: flex;
        > p {
          float: left;
          padding: 20px 0;
          text-align: center;
          width: 25%;
          height: 125px;
          cursor: default;
          &:nth-child(1) {
            b {
              display: block;
              width: 82px;
              height: 82px;
              background-image: url("../assets/img/1.jpg");
              border-radius: 50%;
            }
          }
          &:nth-child(2) {
            b {
              display: block;
              width: 82px;
              height: 82px;
              background-image: url("../assets/img/2.jpg");
              border-radius: 50%;
            }
          }
          &:nth-child(3) {
            b {
              display: block;
              width: 82px;
              height: 82px;
              background-image: url("../assets/img/3.jpg");
              border-radius: 50%;
            }
          }
          &:nth-child(4) {
            b {
              display: block;
              width: 82px;
              height: 82px;
              background-image: url("../assets/img/4.jpg");
              border-radius: 50%;
            }
          }
          em {
            width: 1.28571429em;
            text-align: center;
            font-style: normal;
            text-shadow: 1px 1px 2px rgba(238, 238, 241, 0.5);
          }
          .bd {
            margin: 0 auto 10px;
            display: block;
            padding: 5px;
            width: 82px;
            height: 82px;
            background: #fff;
            background: rgba(255, 255, 255, 0.6);
            border: 1px solid #f2f2f2;
            border: 1px solid rgba(0, 0, 0, 0.07);
            border-radius: 50%;
            &:hover {
              -webkit-animation-name: shake;
              animation-name: shake;
              -webkit-animation-duration: 0.8s;
              animation-duration: 0.8s;
              -webkit-animation-fill-mode: both;
              animation-fill-mode: both;
            }
            @keyframes shake {
              0%,
              11.1%,
              100% {
                -webkit-transform: none;
                transform: none;
              }
              22.2% {
                -webkit-transform: skewX(-12.5deg) skewY(-12.5deg);
                transform: skewX(-12.5deg) skewY(-12.5deg);
              }
              33.3% {
                -webkit-transform: skewX(6.25deg) skewY(6.25deg);
                transform: skewX(6.25deg) skewY(6.25deg);
              }
              44.4% {
                -webkit-transform: skewX(-3.125deg) skewY(-3.125deg);
                transform: skewX(-3.125deg) skewY(-3.125deg);
              }
              55.5% {
                -webkit-transform: skewX(1.5625deg) skewY(1.5625deg);
                transform: skewX(1.5625deg) skewY(1.5625deg);
              }
              66.6% {
                -webkit-transform: skewX(-0.78125deg) skewY(-0.78125deg);
                transform: skewX(-0.78125deg) skewY(-0.78125deg);
              }
              77.7% {
                -webkit-transform: skewX(0.390625deg) skewY(0.390625deg);
                transform: skewX(0.390625deg) skewY(0.390625deg);
              }
              88.8% {
                -webkit-transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
                transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
              }
            }
          }
        }
      }
      > .time {
        margin-right: -320px;
        margin-top: -165px;
        width: 300px;
        height: 165px;
        background-color: rgba(180, 180, 180, 0.3);
        border-radius: 15px;
        float: right;
        color: #fff;
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.35);
        #clock_c {
          margin-top: 13px;
          height: 50px;
          line-height: 50px;
          font-size: 36px;
          text-align: center;
          font-family: "Pixel-LCD-7", "Microsoft YaHei", Sans-Serif;
        }
        .cweek {
          margin-top: 7px;
          padding-left: 53px;
          font-size: 28px;
          letter-spacing: 3px;
          font-family: "Microsoft YaHei", Sans-Serif;
          span {
            font-size: 28px;
          }
          em {
            font-size: 14px;
            letter-spacing: 1px;
          }
        }
        #date_c {
          margin-top: 18px;
          padding-right: 30px;
          font-size: 20px;
          text-align: right;
          font-family: "Pixel-LCD-7", "Microsoft YaHei", Sans-Serif;
        }
      }
    }
  }
  > .el-container {
    box-sizing: border-box;
    width: 100%;
    max-width: 1360px;
    margin: 0 auto;
    padding: 0 50px;
    > .el-main {
      padding-top: 0;
      padding-left: 0;
    }
    > .el-aside {
      width: 300px;
      /*background-color: aqua;*/
      > .search {
        width: 100%;
        background-color: rgba(255, 255, 255, 0.8);
        padding-bottom: 20px;
        border-radius: 15px;
        &.fixed {
          position: fixed;
          z-index: 3;
          width: 300px;
          animation: searchMove 0.5s 1 ease-in-out;
          animation-fill-mode: forwards;
        }
        @keyframes searchMove {
          0% {
            top: -500px;
          }
          40% {
            top: 81px;
          }
          65% {
            top: 70px;
          }
          100% {
            top: 81px;
          }
        }
        .search-main {
          position: relative;
          box-sizing: border-box;
          width: 100%;
          height: 80px;
          padding: 20px;
          background-color: grey;
          border-radius: 15px 15px 0 0;
          input {
            width: 100%;
            height: 40px;
            border-radius: 20px;
            border: 0;
            outline: 0;
            text-indent: 2em;
          }
          i {
            position: absolute;
            right: 35px;
            top: 29px;
            width: 22px;
            height: 22px;
            font-size: 18px;
            line-height: 22px;
            text-align: right;
            font-weight: bolder;
            color: rgb(120, 121, 119);
            cursor: pointer;
          }
        }
        .search-article {
          position: relative;
          width: 100%;
          margin-top: 20px;
          ul {
            width: 100%;
            li {
              position: relative;
              box-sizing: border-box;
              z-index: 1;
              width: 100%;
              height: 40px;
              line-height: 40px;
              padding: 0 30px;
              a {
                display: block;
                width: 100%;
                height: 100%;
                color: #787977;
                border-bottom: 1px dotted #eee;
              }
            }
          }
          .cover {
            box-sizing: border-box;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 40px;
            border-right: 5px solid #000;
            background-color: rgba(0, 0, 0, 0.05);
            transition: top 0.3s;
          }
        }
      }
      > .gg {
        box-sizing: border-box;
        width: 100%;
        margin-bottom: 20px;
        background-color: rgba(255, 255, 255, 0.8);
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
        .gg_content {
          margin-top: 15px;
        }
      }
      > .weather {
        box-sizing: border-box;
        width: 100%;
        margin-bottom: 20px;
        background-color: rgba(255, 255, 255, 0.8);
        padding: 15px 20px 20px;
        border-radius: 15px;
        .ipaddress {
          font-size: 12px;
          color: #ccc;
        }
        .city {
          font-size: 18px;
          color: #000;
        }
        .nowtemp {
          height: 130px;
          border-bottom: 1px solid #333;
          img {
            width: 100px;
            height: 100px;
            float: left;
            margin: 0 0 0 30px;
          }
          .tempnum {
            margin-top: 10px;
            width: 100px;
            float: left;
            font-size: 25px;
          }
          .temptext {
            width: 100px;
            float: left;
            font-size: 25px;
          }
          .feelsLike {
            width: 100%;
            float: right;
            text-align: center;
          }
        }
        .infobox {
          height: 110px;
          border-bottom: 1px solid #000;
          margin-top: 5px;
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          .info {
            width: 86.5px;
            img {
              margin-left: -7px;
              width: 50px;
              height: 50px;
              float: left;
            }
            .infocont {
              float: left;
              margin-top: 7px;
              margin-left: -1px;
              width: 43px;
              font-size: 12px;
            }
            .infotext {
              float: left;
              margin-left: -1px;
              width: 43px;
              font-size: 14px;
            }
          }
        }
        .threedays {
          margin-top: 10px;
          display: flex;
          .daybox {
            width: 86.5px;
            .day {
              text-align: center;
            }
            img {
              margin-left: 18px;
              width: 50px;
              height: 50px;
            }
            .infocont {
              font-size: 16px;
              text-align: center;
            }
          }
        }
      }
      > .hot,
      .recommend {
        box-sizing: border-box;
        width: 100%;
        margin-top: 20px;
        background-color: rgba(255, 255, 255, 0.8);
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
          li {
            overflow: hidden;
            height: 30px;
            line-height: 30px;
            margin: 7px 0;
            a {
              color: #787977;
              font-size: 14px;
              text-decoration: none;
              transition: 0.3s;
              &:hover {
                color: #6bc30d;
                text-decoration: underline;
              }
            }
            i {
              display: inline-block;
              width: 22px;
              height: 22px;
              margin-right: 10px;
              font-style: normal;
              font-size: 12px;
              color: #666;
              line-height: 22px;
              text-align: center;
              font-size: 14px;
              border-radius: 100%;
              background-color: rgba(255, 255, 255, 0.8);
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
      > .visitor {
        box-sizing: border-box;
        width: 100%;
        margin-top: 20px;
        background-color: rgba(255, 255, 255, 0.8);
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
          margin-top: 10px;
          li {
            position: relative;
            float: left;
            width: 23%;
            height: 60px;
            margin: 1%;
            background-position: center top;
            background-size: cover;
            background-repeat: no-repeat;

            p {
              overflow: hidden;
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 20px;
              line-height: 20px;
              text-align: center;
              background-color: rgba(0, 0, 0, 0.3);
              color: #fff;
              font-size: 12px;
            }
          }
          &::after {
            display: block;
            content: "";
            width: 0;
            height: 0;
            clear: both;
          }
        }
      }
    }
  }
}
</style>