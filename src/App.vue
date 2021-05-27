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
  <div id="root">
    <router-view />
  </div>
</template>

<script>
import request from "../src/api";
const getGary = request.getGary;

export default {
  name: "App",
  mounted() {
    document.getElementById("loading").style.display = "none";
    getGary().then((res) => {
      // console.log(res.data)
      if (res.data.data === true) {
        document.querySelector("html").style.filter = "grayscale(95%)";
      }
    });
  },
};
</script>

<style lang="less">
@import "assets/css/reset.css";
@import "assets/css/font.css";
// html {
//   filter: grayscale(95%);
//   -webkit-filter: grayscale(95%);
// }
#root {
  width: 100%;
  /*height: 3000px;*/
  background: url("https://www.sun0623.top/img/bg.jpg") center top/cover fixed;
  filter: none;
}

html,
body,
p {
  cursor: url("./assets/img/mouse.png") 0 0, auto !important;
}

input {
  cursor: url("./assets/img/text.png") 0 0, auto !important;
}

a,
a > *,
input[type="button"] {
  cursor: url("./assets/img/hand.png") 0 0, auto !important;
}
</style>
