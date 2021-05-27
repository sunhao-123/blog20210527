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
  <div class="Diary">
    <Nav></Nav>
    <div class="diary-main">
      <el-timeline>
        <el-timeline-item
          v-for="item in diaryList"
          :timestamp="item.date | getD"
          placement="top"
          :reverse="false"
          :key="item"
        >
          <el-card>
            <pre>{{ item.txt }}</pre>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script>
import request from "../../api";
const getDiary = request.getDiary;
import Nav from "../../components/Nav";
export default {
  name: "Diary",
  components: { Nav },
  data() {
    return {
      diaryList: [],
    };
  },
  filters: {
    getD(val) {
      let date = new Date(val);
      let m = "";
      let d = "";
      date.getMonth() < 9
        ? (m = "0" + (date.getMonth() + 1))
        : (m = (date.getMonth() + 1).toString());
      date.getDate() < 10
        ? (d = "0" + date.getDate())
        : (d = date.getDate().toString());
      return date.getFullYear() + "/" + m + "/" + d;
    },
  },

  created() {
    getDiary().then((res) => {
      this.diaryList = res.data.data;
    });
  },
};
</script>

<style scoped lang="less">
.Diary {
  box-sizing: border-box;
  max-width: 1360px;
  width: 100%;
  padding: 80px 50px;
  margin: 0 auto;
  .diary-main {
    box-sizing: border-box;
    width: 100%;
    padding: 30px 8% 30px 20%;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 15px;
    .el-timeline {
      /deep/ .el-timeline-item__timestamp {
        position: absolute;
        top: -8px;
        left: -134px;
        font-size: 20px;
        font-weight: bolder;
        color: #6bc30d;
      }
      .el-timeline-item {
        .el-card {
          pre {
            font-size: 14px;
            line-height: 30px;
          }
        }
      }
    }
  }
}
</style>
