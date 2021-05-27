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
  <div class="rc-cropper" v-if="originImg">
    <el-dialog
      title="头像裁剪"
      :visible.sync="dialogVisible"
      width="820px"
      height="500px"
      :before-close="beforeClose"
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col :span="12">
          <div class="rc-cropper__canvasCrop2" :style="cropBox">
            <img :src="originImg" v-if="!cropper" ref="cropimg" />
            <canvas :id="originImg" ref="canvas" />
            <div class="rc-cropper__iconCrop">
              <el-tooltip class="look" content="预览头像" placement="right">
                <el-button type="success" size="mini" @click="sureCropper()" :disabled="okDisable">预览</el-button>
              </el-tooltip>
              <el-tooltip class="ok" content="确认裁剪" placement="right">
                <el-button type="success" size="mini" @click="drawImg()" :disabled="lookDisable">裁剪</el-button>
              </el-tooltip>
              <p class="tip">1.点击“裁剪”开始裁剪。<br>2.点击“预览”查看头像状态。<br>3.点击“确定”上传头像！</p>
            </div>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="rc-cropper__previewImg">
            <img :src="previewImg" id="previewImg" />
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="beforeClose">取 消</el-button>
        <el-button type="primary" @click="handleOK" :disabled="upLoadDisable">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Cropper from "cropperjs";
import request from "../api";
import "cropperjs/dist/cropper.min.css";


export default {
  name: "rc-cropper2",
  props: {
    cropOption: {
      type: Object,
      required: true,
      default: () => {}
    },
    originImg: {
      required: true
    },
    previewImg: {
      type: String
    },
    dialogVisible: {}
  },
  data() {
    return {
      cropper: null,
      croppShow: false,
      cropBox: {
        width: "",
        height: ""
      },
      lookDisable: false,
      okDisable: true,
      upLoadDisable: true
    };
  },
  methods: {
    // 在canvas上绘制图片
    handleCut(){
      this.lookDisable = true;
      this.okDisable = false;
      this.upLoadDisable = true
    },
    handleCrop(){
      this.lookDisable = true;
      this.okDisable = false;
      this.upLoadDisable = false
    },
    drawImg() {
      this.handleCut();
      let h = this.$refs.cropimg.offsetHeight;
      let w = this.$refs.cropimg.offsetWidth;
      // cropBox
      if (h > w) {
        this.cropBox.width = (w / h) * 450 + "px";
        this.cropBox.height = 450 + "px";
      } else {
        this.cropBox.width = 450 + "px";
        this.cropBox.height = (h / w) * 450 + "px";
      }
      const _this = this;
      this.$nextTick(() => {
        let canvas = document.getElementById(this.originImg);
        if (canvas) {
          if (h > w) {
            canvas.width = w < 450 && h < 450 ? (w / h) * 450 : w;
            canvas.height = h < 450 && w < 450 ? 450 : h;
          } else {
            canvas.width = w < 450 && h < 450 ? 450 : w;
            canvas.height = h < 450 && w < 450 ? (h / w) * 450 : h;
          }
          let ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          let img = new Image();
          img.crossOrigin = "Anonymous";
          img.src = this.originImg;
          img.onload = function() {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            _this.initCropper();
          };
        }
      });
    },
    // 显示裁剪框
    initCropper() {
      this.croppShow = true;
      this.cropper = new Cropper(this.$refs.canvas, {
        checkCrossOrigin: true,
        viewMode: 3,
        zoomOnWheel: true, // 是否可以通过移动鼠标来放大图像
        aspectRatio: 1,
        ready: () => {
          this.cropper.setData({
            x: this.cropOption.offset_x,
            y: this.cropOption.offset_y,
            width: this.cropOption.width,
            height: this.cropOption.height
          });
        }
      });
      // this.cropper = cropper
    },
    // 确认裁剪
    sureCropper() {
      this.handleCrop();
      let _this = this;
      const cropParam = this.cropper.getData();
      this.cropper.getCroppedCanvas().toBlob(function(blob) {
        let oFileReader = new FileReader();
        oFileReader.onloadend = function(e) {
          let base64 = e.target.result;
          _this.previewImg = cropParam
          _this.$emit("getCropImg", base64, cropParam);
        };
        oFileReader.readAsDataURL(blob);
      }, "image/png");
    },
    beforeClose() {
      this.$emit("handleClose");
    },
    handleOK() {
      this.$emit("handleOK", this.previewImg);
      this.$emit("handleClose");
    }
  }
};
</script>
<style lang="less">
.rc-cropper {
  position: relative;
  margin-top: 20px;
  .el-dialog {
    height: 580px;
  }
}

.rc-cropper__canvasCrop2 {
  > img {
    max-width: 450px;
    height: auto;
    max-height: 450px;
  }
}

.rc-cropper__iconCrop {
  position: absolute;
  left: 45%;
  top: 0%;
  width: 40;
  height: 40px;
  .tip{
    position: relative;
    top: 305px;
    left: 201px;
    font-size: 14px;
  }
}

.el-tooltip {
  position: relative;
  margin: 0;
  display: block;
  z-index: 10000;
  &.ok {
    top: 297px;
    left: 193px;
  }
  &.look {
    top: 325px;
    left: 284px;
  }
}

.rc-cropper__previewImg {
  position: relative;
  left: 85px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: 1px #000 solid;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.rc-cropper .el-dialog__footer {
  padding: 0;
}
.rc-cropper .dialog-footer {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 300px;
  float: right;
}

/deep/.cropper-container {
  width: 300px;
  height: 300px;
}
</style>
