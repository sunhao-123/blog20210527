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
  <div>
    <textarea id="text" style="display: none;"></textarea>
    <button type="button" class="layui-btn" @click="handleClick">提交留言</button>
  </div>
</template>

<script>
export default {
  name: "RichText",
  data() {
    return {
      layedit: null,
      index: 0
    };
  },
  methods: {
    handleClick() {
      this.$emit("Sub", this.layedit.getContent(this.index));
      this.layedit.clearContent(this.index);
    }
  },

  mounted() {
    layui.use("layedit", () => {
      this.layedit = layui.layedit;
      this.index = this.layedit.build("text", {
        tool: ["face", "|", "left", "center", "right"]
      }); //建立编辑器
    });
  }
};
</script>

<style scoped>
</style>