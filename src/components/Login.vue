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
  <el-dialog
    title="登录"
    :visible.sync="dialogVisible"
    width="425px"
    :before-close="beforeClose"
    :close-on-click-modal="true"
  >
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="用户名" prop="user">
        <el-input v-model="form.user" @keyup.enter.native="handleClick"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model="form.pwd" show-password @keyup.enter.native="handleClick"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="svgCode" class="vcode">
        <el-input v-model="form.svgCode" @keyup.enter.native="handleClick"></el-input>
        <div class="svg" v-html="login.svgText"></div>
        <el-link type="primary" @click="getVCode" :disabled="login.disabled">{{login.refreshText}}</el-link>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" plain @click="gotoForget">忘记密码</el-button>
      <el-button type="success" plain @click="gotoRegister">立即注册</el-button>
      <el-button type="primary" @click="handleClick" :disabled="submitDisabled">登录</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from "../api";

const getLoginVCode = request.getLoginVCode;
const getLoginCheckVcode = request.getLoginCheckVcode;

const postLogin = request.postLogin;
export default {
  name: "Register",
  data() {
    return {
      //表单数据
      form: {
        user: "",
        pwd: "",
        svgCode: ""
      },
      //表单验证
      rules: {
        //用户名验证
        user: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            //数据类型
            type: "string",
            //正则规则
            pattern: /^[\w\u4e00-\u9fa5\uac00-\ud7ff\u0800-\u4e00\-]{2,7}$/,
            message: "请输入正确格式用户名",
            trigger: ["blur", "change"]
          }
        ],

        //密码验证
        pwd: {
          type: "string",
          validator: (rule, value, cb) => {
            if (value) {
              //验证密码是否符合规则
              if (/^[\w<>,.?|;':"{}!@#$%^&*()\/\-\[\]\\]{6,18}$/.test(value)) {
                cb();
              } else {
                cb(new Error("请输入正确格式密码"));
              }
            } else {
              cb(new Error("请输入密码"));
            }

            //在这里还需要触发确认密码的验证
            this.form.checkPwd && this.$refs.form.validateField("checkPwd");
          },
          required: true,
          trigger: ["blur", "change"]
        },
        svgCode: {
          validator: (rule, value, cb) => {
            if (!value) {
              cb(new Error("请输入验证码！"));
            } else {
              getLoginCheckVcode(value)
                .then(res => {
                  if (res.data.code === 0) {
                    cb();
                  } else {
                    cb(new Error("验证码错误"));
                  }
                })
                .catch(e => {
                  cb(new Error("验证码已过期，请刷新！"));
                });
            }
          },
          required: true,
          trigger: "blur"
        }
      },
      login: {
        svgText: "loading...",
        refreshText: "刷新",
        disabled: true,
        timer: null,
        submitDisabled: false
      },

      //登录过程禁用
      submitDisabled: false
    };
  },
  props: ["dialogVisible"],
  methods: {
    getVCode() {
      getLoginVCode().then(res => {
        clearTimeout(this.login.timer);
        let t = 0;
        let fn = () => {
          t += 1000;
          if (t > res.data.time) {
            clearTimeout(this.login.timer);
            this.login.disabled = false;
            this.login.refreshText = "刷新";
          } else {
            this.login.disabled = true;
            this.login.refreshText =
              (((res.data.time - t) / 1000) | 0) + "s后可以刷新";
          }
        };
        this.login.timer = setInterval(fn, 1000);
        fn();

        //更新图片
        this.login.svgText = res.data.data;
      });
    },
    gotoRegister() {
      this.$emit("handleOpen", false);
    },
    gotoForget() {
      this.$emit("handleForget", false);
    },
    handleClick() {
      this.submitDisabled = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          //验证都通过
          postLogin(this.form)
            .then(res => {
              if (res.data.code) {
                this.submitDisabled = false;
                //登录失败
                this.$message({
                  message: res.data.msg,
                  type: "error",
                  duration: 2000
                });
              } else {
                //登录成功
                this.$message({
                  message: res.data.msg,
                  type: "success",
                  duration: 2000
                });
                this.submitDisabled = false;
                this.$emit("handleClose");
                this.$emit("ifLogin");
              }
            })
            .catch(e => {
              this.$message({
                message: "登录失败请稍后再试~",
                type: "error",
                duration: 2000
              });
              this.submitDisabled = false;
            });
        } else {
          this.submitDisabled = false;
          //验证没通过
          return false;
        }
      });
    },
    beforeClose(done) {
      this.$emit("handleClose");
    }
  },
  mounted() {
    this.getVCode();
  },
  destroyed() {
    clearTimeout(this.login.timer);
  }
};
</script>

<style scoped lang="less">
/deep/.el-dialog__body {
  padding: 20px 20px 0 20px;
}
.el-form {
  user-select: none;
  padding-right: 30px;

  .vcode {
    .el-input {
      float: left;
      width: 35%;
    }
    div.svg {
      float: left;
      width: 35%;
      height: 40px;
      /deep/ svg {
        width: 100% !important;
        height: 100% !important;
      }
    }
    .el-link {
      font-size: 12px;
    }
  }
}
</style>