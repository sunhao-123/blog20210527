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
  <div class="NotFound">
    <Nav></Nav>
    <div class="content">
      <div class="box">
        <img :src="data.img" alt />
        <p class="title">{{ data.name }} {{ data.num }}</p>
        <p class="tip">{{ i }}</p>
        <p class="download">
          下载地址:
          <code>
            <a :href="download" download>{{ download }}</a>
          </code>
        </p>
        <p class="text">{{ data.text }}</p>
      </div>
      <div id="mse"></div>
      <div class="btnList">
        <el-button
          v-for="(item, i) in data.url"
          :key="item"
          type="success"
          round
          @click="handleChange(item, i)"
          >第{{ i + 1 }}集</el-button
        >
      </div>
    </div>
    <p class="bottomTip">
      声明：本站全部视频资源均来自<a
        href="http://www.zuidazy5.net/"
        target="_blank"
        >最大资源网</a
      >，如有任何版权问题与本站无关。
    </p>
  </div>
</template>

<script>
import Nav from "../../components/Nav";
import request from "../../api";
import "xgplayer";
import HlsJsPlayer from "xgplayer-hls.js";

const postIfLogin = request.postIfLogin;
const postWatch = request.postWatch;
const userWatch = request.userWatch;
const getUserWatch = request.getUserWatch;

export default {
  name: "Video",
  components: { Nav },
  data() {
    return {
      id: "",
      i: "",
      player: "",
      videoUrl: "",
      data: {},
      userId: "",
      download: "",
      screenWidth: document.body.clientWidth,
    };
  },
  watch: {
    $route: {
      handler(val, oldval) {
        if (val.params.id !== oldval.params.id) {
          if (this.player !== "") {
            this.player.destroy(true);
          }
          postWatch(this.$route.params.id).then((resp) => {
            if (resp.data.name !== "") {
              this.data = resp.data;
              getUserWatch({ _id: this.userId, videoId: this.id }).then(
                (re) => {
                  // console.log(re.data);
                  let n = re.data.num * 1;
                  this.i = `第${n}集`;
                  this.download = this.data.download[n - 1];
                  this.playVideo(this.data.url[n - 1]);
                }
              );
            } else {
              this.i = `第0集`;
              this.data = {
                download: [],
                id: resp.data.id,
                img: "",
                name: "该资源不存在！",
                num: "",
                text: "该资源不存在！",
                url: [],
              };
              this.playVideo("");
              this.player.destroy(true);
            }
          });
        }
      },
    },
  },
  methods: {
    playVideo(url) {
      if (this.screenWidth < 992) {
        this.player = new HlsJsPlayer({
          id: "mse",
          autoplay: true,
          volume: 0.5,
          url: url,
          playsinline: true,
          screenShot: true,
          playbackRate: [0.5, 1, 1.5, 2, 3],
          download: true,
          keyShortcut: "on",
          width: this.screenWidth - 20,
          fitVideoSize: "fixWidth",
        });
      } else {
        this.player = new HlsJsPlayer({
          id: "mse",
          autoplay: true,
          volume: 0.5,
          url: url,
          playsinline: true,
          screenShot: true,
          playbackRate: [0.5, 1, 1.5, 2, 3],
          download: true,
          keyShortcut: "on",
          width: 1200,
          fitVideoSize: "fixWidth",
        });
      }
      this.player.play();
    },
    handleChange(url, i) {
      // this.player.start(url)
      this.player.src = url;
      this.player.play();
      this.i = `第${i + 1}集`;
      this.download = this.data.download[i];
      userWatch({ _id: this.userId, videoId: this.id, num: i + 1 })
        .then(() => {})
        .catch(() => {});
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    postIfLogin().then((res) => {
      if (!res.data.userInfo) {
        this.$alert("您还未登录哦，无法访问此页面！！", "❌警告", {
          confirmButtonText: "确定",
          callback: (action) => {
            this.$router.push("/");
          },
        });
      } else {
        this.userId = res.data.userInfo._id;
        postWatch(this.id).then((resp) => {
          if (resp.data.name !== "") {
            this.data = resp.data;
            getUserWatch({ _id: this.userId, videoId: this.id }).then((re) => {
              // console.log(re.data);
              let n = re.data.num * 1;
              this.i = `第${n}集`;
              this.download = this.data.download[n - 1];
              this.playVideo(this.data.url[n - 1]);
            });
          } else {
            this.i = `第0集`;
            this.data = {
              download: [],
              id: resp.data.id,
              img: "",
              name: "该资源不存在！",
              num: "",
              text: "该资源不存在！",
              url: [],
            };
            this.playVideo("");
            this.player.destroy(true);
          }
        });
      }
    });
  },
  /* 离开页面销毁播放器 */
  beforeRouteLeave(to, form, next) {
    this.player.destroy(true);
    next();
  },
};
</script>

<style scoped lang="less">
.NotFound {
  background-color: #fff;
  .content {
    margin: 80px auto 40px;
    width: 1200px;
    .box {
      width: 1200px;
      height: 377px;
      img {
        width: 270px;
        height: 377px;
      }
      .title {
        position: relative;
        top: -370px;
        left: 290px;
        display: block;
        width: 910px;
        height: 40px;
        font-size: 33px;
        line-height: 40px;
      }
      .tip {
        position: relative;
        top: -360px;
        left: 290px;
        display: block;
        width: 910px;
        height: 30px;
        font-size: 25px;
        line-height: 30px;
      }
      .download {
        display: block;
        position: relative;
        left: 290px;
        top: -210px;
        width: 910px;
        height: 30px;
        code {
          a {
            background: rgba(27, 31, 35, 0.05);
            padding: 0.2rem 0.4rem;
            color: #bd4147;
            border-radius: 4px;
            font-family: Menlo, Monaco, Consolas, Courier New, monospace;
            transition: 0.3s;
            &:hover {
              color: #d17479;
            }
          }
        }
      }
      .text {
        display: block;
        position: relative;
        left: 290px;
        bottom: 205px;
        width: 910px;
        height: 240px;
        font-size: 18px;
      }
    }
    #mse {
      width: 1200px;
      margin: 20px auto 0;
    }
    .btnList {
      margin: 20px auto;
      display: flex;
      justify-content: flex-start;
      align-content: flex-start;
      flex-wrap: wrap;
      width: 1200px;
      .el-button--success {
        width: 92px;
        margin: 10px 20.666666666666px 0 20.666666666666px;
      }
    }
  }
  .bottomTip {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 23px;
    font-size: 13px;
    line-height: 23px;
    text-align: center;
    background: #fff;
    z-index: 9999999;
  }
}
@media screen and (max-width: 992px) {
  .NotFound {
    width: 100%;
    .content {
      box-sizing: border-box;
      padding: 0 10px;
      width: 100%;
      .box {
        width: 100%;
        .title,
        .tip,
        .text,
        .download {
          width: 67%;
        }
        .download {
          top: -260px;
        }
        .text {
          bottom: 255px;
        }
      }
      #mse {
        width: 100%;
      }
      .btnList {
        width: 100%;
      }
    }
  }
}
</style>