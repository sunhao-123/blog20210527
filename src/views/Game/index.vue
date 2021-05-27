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
    <div class="gamebox">
      <div
        class="game"
        v-for="item in gameList"
        :key="item"
        @click="handleClick(item.name)"
      >
        <img :src="item.img" alt />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "../../components/Nav";
import request from "../../api";

const postIfLogin = request.postIfLogin;
const postGetGame = request.postGetGame;
export default {
  name: "NotFound",
  components: { Nav },
  data() {
    return {
      name: "",
      gameList: [],
      searchList: [],
      searchTitle: "",
      search: false,
    };
  },
  methods: {
    goHome() {
      this.$router.push({ path: `/` });
    },
    handleClick(name) {
      this.$router.push({ path: `/play/${name}` });
    },
  },
  mounted() {
    postGetGame().then((res) => {
      this.gameList = res.data.data;
    });
  },
};
</script>

<style scoped lang="less">
.NotFound {
  padding: 100px 0 0 0;
}
.gamebox {
  overflow: hidden;
  width: 1200px;
  //background-color: #fff;
  margin: 0 auto;
  padding: 0px 0 40px 0;
  .game {
    width: 220px;
    height: 325px;
    margin: 10px;
    float: left;
    img {
      width: 220px;
      height: 307px;
      transition: 0.3s;
      &:hover {
        transform: translateY(-10px);
        box-shadow: 0 10px 5px rgba(0, 0, 0, 0.4);
      }
    }
    p {
      width: 220px;
      height: 30px;
      font-size: 18px;
      line-height: 30px;
      text-align: center;
    }
  }
}
.bottomTip {
  display: block;
  width: 100%;
  height: 13px;
  font-size: 12px;
  line-height: 13px;
  text-align: center;
}
@media (max-width: 992px) {
  .search {
    width: 100%;
  }
  .searchList {
    width: 100%;
  }
  .gamebox {
    width: 100%;
  }
}
</style>