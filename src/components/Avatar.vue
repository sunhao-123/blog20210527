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
    <el-dialog
      title="头像上传"
      :visible.sync="dialogVisible"
      width="425px"
      :before-close="beforeClose"
      :close-on-click-modal="false"
    >
      <el-upload
        class="avatar-uploader"
        :action="hostUrl + '/upload/avatar'"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :with-credentials="true"
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="avatar"
          style="border-radius: 50%"
        />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="ifShowCrop = true" :disabled="cutDisable"
          >裁 剪</el-button
        >
        <el-button type="primary" @click="handleOK" :disabled="cutDisable"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <Cropper
      :dialogVisible="ifShowCrop"
      :cropOption="cropOption"
      @handleClose="closeCrop"
      @getCropImg="getCropImg(arguments)"
      @handleOK="CropImg"
      :originImg="slide2.oriUrl"
      :previewImg="slide2.preUrl"
    ></Cropper>
  </div>
</template>

<script>
import request from "../api";
import Cropper from "./Cropper";

const postHead = request.postHead;

export default {
  name: "Avatar",
  components: { Cropper },
  data() {
    return {
      imageUrl: "",
      ifShowCrop: false,
      cropOption: {
        offset_x: 20,
        offset_y: 20,
        width: 450,
        height: 450,
      },
      slide2: {
        oriUrl: "", // 原图
        preUrl: "", // 裁剪后的预览图片，初始化为原图
      },
      cutDisable: true,
      hostUrl: "",
    };
  },
  props: ["dialogVisible"],
  methods: {
    getCropImg(argument) {
      this.slide2.preUrl = argument[0];
      this.cropData = argument[1];
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.slide2.oriUrl = URL.createObjectURL(file.raw);
      this.slide2.preUrl = URL.createObjectURL(file.raw);
      this.cutDisable = false;
      this.$message({
        message: "头像上传成功",
        type: "success",
        duration: 2000,
      });
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1700);
    },
    beforeAvatarUpload(file) {
      const isType = /^(image\/jpeg|image\/png|image\/gif)$/.test(file.type);
      const isLt50K = file.size / 1024 < 1024 * 5;

      if (!isType) {
        this.$message.error("上传头像图片只能是 JPG/PNG/GIF 格式!");
      }
      if (!isLt50K) {
        this.$message.error("上传头像图片大小不能超过 5M !");
      }
      return isType && isLt50K;
    },
    handleOK() {
      window.location.reload();
    },
    beforeClose() {
      this.$emit("handleClose");
    },
    closeCrop() {
      this.ifShowCrop = false;
    },
    CropImg(url) {
      postHead(url);
      this.imageUrl = url;
    },
  },
  mounted() {
    let protocol = window.location.protocol; //协议
    let host = window.location.host; //主机
    this.hostUrl = `${protocol}//${host}`;
  },
};
</script>

<style lang="less">
.avatar-uploader .el-upload {
  margin: 0 101px;
  border: 2px dashed #aaa;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>