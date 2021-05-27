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
  <div class="About">
    <Nav></Nav>
    <div class="canvas" ref="can">
      <div class="txt">
        <h2>关于</h2>
        <p>对影潭兮欲揽月，只为再抚卿柔面。</p>
      </div>
      <Canvas></Canvas>
    </div>
    <div class="about-main">
      <div class="a-m-content">
        <article>
          <section>
            <h1>关于我</h1>
            <p>
              2020年6月毕业于沈阳城市建设学院自动化专业，2019-2020年在沈阳实习，做软硬件运维工程师，期间在潭州教育进行前后端开发培训，现沉迷撸码，日渐头秃。
            </p>
            <span>联系我：</span>
            <ul>
              <li>
                邮 箱 ：
                <a href="mailto:suntongxue@sun0623.top"
                  >suntongxue@sun0623.top</a
                >
              </li>
              <li>
                码 云 ：
                <a
                  href="https://gitee.com/classmate-sun"
                  target="_blank"
                  >https://gitee.com/classmate-sun</a
                >
              </li>
              <li>
                Github ：
                <a href="https://github.com/sunhao-123" target="_blank"
                  >https://github.com/sunhao-123</a
                >
              </li>
            </ul>
          </section>
          <section>
            <h1>关于本站</h1>
            <p>
              本站初建于2019年8月，主要是个人爱好写着玩。后于2020年6月改版发布。
            </p>
            <span>本站结构：</span>
            <ul>
              <li>
                前 端 ：
                <code>VUE + elementUI + Layui</code>
              </li>
              <li>
                后 端 ：
                <code>NodeJS + momgoDB</code>
              </li>
            </ul>
            <p>本站采用阿里云提供的ESC服务器。</p>
          </section>
          <section>
            <h1>关于版权</h1>
            <p>
              本站采用「
              <a href="https://license.coscl.org.cn/MulanPSL2/" target="_blank"
                >第二版木兰开源许可 MulanPSL-2.0</a
              >
              」创作共享协议。
              只要在使用时注明出处，您可以可以对本站所有原创内容进行转载、节选、二次创作，但不得对其用于商业目的。
            </p>
          </section>
          <section>
            <h1>特别说明</h1>
            <ul>
              <li>本站文章仅代表个人观点，与任何组织或个人无关。</li>
              <li>
                本站前端开发代码没有考虑对IE浏览器的兼容，建议使用谷歌浏览器访问。
              </li>
              <li>用户邮箱仅用于用户找回密码和站长回复通知，不对外使用。</li>
            </ul>
            <br />
            <br />
            <div>
              <img
                src="../../assets/img/bg27.jpg"
                style="width: 100%; height: auto"
              />
            </div>
          </section>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav";
import Canvas from "../../components/Canvas";

export default {
  name: "About",
  components: {
    Nav,
    Canvas,
  },
};
</script>

<style scoped lang="less">
.About {
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
  .about-main {
    box-sizing: border-box;
    width: 100%;
    max-width: 1360px;
    padding: 30px 50px;
    margin: 0 auto;
    .a-m-content {
      width: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      border-radius: 15px;
      article {
        padding: 10px;
        section {
          padding: 20px;
          background-color: rgba(255, 255, 255, 0.2);
          font-size: 1rem;
          code {
            background: rgba(27, 31, 35, 0.05);
            padding: 0.2rem 0.4rem;
            color: #bd4147;
            border-radius: 4px;
            font-family: Menlo, Monaco, Consolas, Courier New, monospace;
          }
          h1 {
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
            line-height: 1.75rem;
          }
          span {
            padding-left: 18px;
          }
          ul {
            padding-left: 18px;
            li {
              line-height: 2rem;
              a {
                color: #0366d6;
              }
            }
          }
        }
      }
    }
  }
}
</style>