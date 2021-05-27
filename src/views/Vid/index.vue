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
    <!-- <div class="search">
      <div class="searchBox">
        <el-input
          placeholder="搜索视频"
          v-model="name"
          class="input-with-select"
          @keyup.enter.native="handleSearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="handleSearch"
          ></el-button>
        </el-input>
      </div>
    </div>
    <div class="searchList" v-if="search">
      <el-table :data="searchList" max-height="300">
        <el-table-column prop="name" :label="searchTitle">
          <template slot-scope="scope">
            <div @click="handleClick(scope.row.id)">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="videobox">
      <div
        class="video"
        v-for="item in videoList"
        :key="item"
        @click="handleClick(item.id)"
      >
        <img :src="item.img" alt />
        <p>{{ item.name }}</p>
      </div>
    </div> -->
    <div class="info">
      <p>由于本站资源来源《最大资源网》被查封，故此页面永久关闭！感谢支持！</p>
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

const postSearchVideo = request.postSearchVideo;
const postIfLogin = request.postIfLogin;
const postGetList = request.postGetList;
export default {
  name: "NotFound",
  components: { Nav },
  data() {
    return {
      name: "",
      videoList: [],
      searchList: [],
      searchTitle: "",
      search: false,
    };
  },
  methods: {
    goHome() {
      this.$router.push({ path: `/` });
    },
    handleSearch() {
      this.search = true;
      this.searchTitle = `正在搜索······`;
      this.searchList = [];
      postSearchVideo(this.name).then((res) => {
        this.search = true;
        this.searchList = res.data;
        this.searchTitle = `搜索结果  共${res.data.length}条`;
      });
    },
    handleClick(id) {
      this.$router.push({ path: `/watch/${id}` });
      this.search = false;
      this.searchList = [];
    },
  },
  mounted() {
    // postIfLogin().then((res) => {
    //   if (!res.data.userInfo) {
    //     this.$alert("您还未登录哦，无法访问此页面！！", "❌警告", {
    //       confirmButtonText: "确定",
    //       callback: (action) => {
    //         this.$router.push("/");
    //       },
    //     });
    //   }
    // });
    // postGetList().then((res) => {
    //   this.videoList = res.data.data;
    // });
  },
};
</script>

<style scoped lang="less">
.search {
  width: 1200px;
  margin: 0 auto;
  padding: 80px 0 0 0;
  .searchBox {
    margin-left: 50px;
    width: 400px;
  }
}
.searchList {
  margin: 10px auto;
  width: 1200px;
}
.videobox {
  overflow: hidden;
  width: 1200px;
  //background-color: #fff;
  margin: 20px auto 23px;
  padding: 0px 0 40px 0;
  .video {
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
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 23px;
  font-size: 13px;
  line-height: 23px;
  text-align: center;
  background: #fff;
}
.info p{
  margin-top: 100px;
  text-align: center;
  font-size: 30px;
  line-height: 600px;
}
@media (max-width: 992px) {
  .search {
    width: 100%;
  }
  .searchList {
    width: 100%;
  }
  .videobox {
    width: 100%;
  }
}
</style>