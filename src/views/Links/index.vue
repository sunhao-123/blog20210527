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
  <div class="Links">
    <Nav></Nav>
    <div class="canvas" ref="can">
      <div class="txt">
        <h2>友情链接</h2>
        <p>对影潭兮欲揽月，只为再抚卿柔面。</p>
      </div>
      <Canvas></Canvas>
    </div>
    <div class="link-main">
      <div class="rule">
        <div class="rule_box">
          <h3>友链申请说明</h3>
          <p>
            <i class="fa fa-close" style="color: #c00; margin-right: 10px"
              >经常宕机</i
            >
            <i class="fa fa-close" style="color: #c00; margin-right: 10px"
              >不合法规</i
            >
            <i class="fa fa-close" style="color: #c00; margin-right: 10px"
              >插边球站</i
            >
            <i class="fa fa-close" style="color: #c00; margin-right: 10px"
              >红标报毒</i
            >
            <i class="fa fa-check" style="color: #096; margin-right: 10px"
              >原创优先</i
            >
            <i class="fa fa-check" style="color: #096; margin-right: 10px"
              >技术优先</i
            >
          </p>
          <p>
            交换友链可在留言板留言.本站链接如下：
            <br />名称：孙同学的博客 <br />网址：https://www.sun0623.top/
            <br />图标：https://www.sun0623.top/images/Logo.png
            <br />描述：孙同学，期待与你相遇。
          </p>

          <p>
            申请方式：发送邮件到：
            <a href="mailto:suntongxue@sun0623.top">suntongxue@sun0623.top</a>
            <br />邮件申请提交后若无其它原因将在24小时内审核，如超时未通过请
            <a
              style="color: #599bff"
              target="_blank"
              href="http://wpa.qq.com/msgrd?v=3&uin=2731915370&site=qq&menu=yes"
              >QQ留言</a
            >。
          </p>
        </div>
      </div>
      <div class="contain">
        <ul>
          <li v-for="item in linksList" :key="item.icon">
            <div class="a_box">
              <a :href="item.href" target="_blank">
                <img :src="item.icon" />
                <h3>{{ item.name }}</h3>
                <p>{{ item.des }}</p>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav";
import Canvas from "../../components/Canvas";
import request from "../../api";

const getLinks = request.getLinks;

export default {
  name: "Links",
  components: { Nav, Canvas },
  data() {
    return {
      linksList: [],
    };
  },
  created() {
    getLinks().then((res) => {
      this.linksList = res.data.data;
    });
  },
};
</script>

<style scoped lang="less">
.Links {
  width: 100%;
  padding-top: 61px;

  .canvas {
    position: relative;
    width: 100%;
    height: 260px;

    .txt {
      position: absolute;
      left: 50%;
      top: 50%;
      text-align: center;
      transform: translate(-50%, -50%);
      color: #fff;

      h2 {
        font-size: 25px;
        font-weight: normal;
      }
    }
  }

  .link-main {
    box-sizing: border-box;
    width: 100%;
    max-width: 1360px;
    padding: 30px 50px;
    /*height: 500px;*/
    margin: 0 auto;

    .rule {
      box-sizing: border-box;
      padding: 0.625%;
      width: 100%;

      .rule_box {
        padding: 35px 20px 10px 20px;
        background-color: rgba(255, 255, 255, 0.8);
        border-radius: 15px;

        h3 {
          margin-bottom: 1rem;
          padding-left: 1rem;
          border-left: 0.25rem solid #6bc30d;
          font-weight: 700;
          font-size: 1.5rem;
          line-height: 1.5rem;
        }

        p {
          margin: 1.5rem 0;
          padding-left: 18px;
          font-family: Raleway, Segoe UI, Lucida Grande, Helvetica, Arial,
            Microsoft YaHei;
          line-height: 1.75rem;
          color: #515250;
        }
      }
    }

    .contain {
      width: 100%;

      ul {
        display: flex;
        width: 100%;
        flex-wrap: wrap;
        justify-content: flex-start;

        li {
          box-sizing: border-box;
          width: 25%;
          height: 150px;
          // background-color: #fff;
          margin-top: 2%;
          cursor: pointer;

          .a_box {
            margin: 0 auto;
            width: 95%;
            background-color: rgba(255, 255, 255, 0.8);
            transition: 0.3s;
            border-radius: 15px;
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 0 5px #fff;
            }

            a {
              display: block;
              padding: 20px;
              // background: #fff;
              color: #333;

              img {
                float: left;
                width: 40px;
                height: 40px;
                border-radius: 100%;
              }

              h3 {
                overflow: hidden;
                padding: 10px 15px 9px;
                height: 21px;
                font-weight: normal;
              }

              p {
                clear: both;
                display: -webkit-box;
                overflow: hidden;
                margin-top: 1rem;
                height: 60px;
                text-overflow: ellipsis;
                font-size: 13px;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
              }
            }
          }
        }
      }
    }
  }
}
</style>
