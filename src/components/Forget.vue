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
  <el-dialog title="忘记密码" :visible.sync="dialogVisible" width="425px" :before-close="beforeClose">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="电子邮件" prop="email">
        <el-input v-model="form.email" type="email"></el-input>
      </el-form-item>
      <el-form-item label="验证码" prop="emailCode" class="vcode">
        <el-input v-model="form.emailCode"></el-input>
        <el-button
          type="primary"
          plain
          round
          @click="getFCode(form.email)"
          :disabled="forgetData.disabled"
          style="margin-left:20px;width:125px;"
        >{{forgetData.refreshText}}</el-button>
      </el-form-item>

      <!-- 解决密码自动填充 -->
      <el-form-item style="position:fixed;bottom:-9999px;" label="新密码">
        <el-input type="text" style="position:fixed;bottom:-9999px;"></el-input>
        <el-input type="password" style="position:fixed;bottom:-9999px;"></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="pwd">
        <el-input v-model="form.pwd" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPwd">
        <el-input v-model="form.checkPwd" type="password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        type="primary"
        plain
        @click="returnLogin"
        :disabled="forgetData.submitDisabled"
      >返回登录</el-button>
      <el-button type="success" @click="handleClick" :disabled="forgetData.submitDisabled">修改密码</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from "../api/index";

const getForgetCode = request.getForgetCode;
const getForgetCheckCode = request.getForgetCheckCode;
const postForget = request.postForget;
const checkForgetCode = request.checkForgetCode;

export default {
  name: "Forget",
  data() {
    return {
      //表单数据
      form: {
        user: "",
        pwd: "",
        checkPwd: "",
        email: "",
        emailCode: ""
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
            message: "2-7位，数字 字母 _ - 中日韩文",
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
                cb(new Error("6-18位，不允许出现奇怪的字符哦~"));
              }
            } else {
              cb(new Error("请输入密码"));
            }

            //在这里还需要触发确认密码的验证
            this.form.checkPwd && this.$refs.form.validateField("checkPwd");
          },
          required: true,
          message: "6-18位，不允许出现奇怪的字符",
          trigger: ["blur", "change"]
        },

        //再次输入密码验证
        checkPwd: {
          validator: (rule, value, cb) => {
            if (value) {
              if (value === this.form.pwd) {
                cb();
              } else {
                cb(new Error("两次密码不一致"));
              }
            } else {
              cb(new Error("请再次输入密码"));
            }
          },
          required: true,
          trigger: ["blur", "change"]
        },
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          {
            //数据类型
            type: "string",
            //正则规则
            pattern: /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/,
            message: "请输入正确的邮箱格式！",
            trigger: ["blur", "change"]
          }
        ],
        //验证码
        emailCode: {
          validator: (rule, value, cb) => {
            if (!value) {
              cb(new Error("请输入验证码！"));
            } else {
              getForgetCheckCode(value)
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

      //忘记密码相关的数据
      forgetData: {
        refreshText: "获取验证码",
        disabled: false,
        timer: null,
        submitDisabled: false
      }
    };
  },
  props: ["dialogVisible"],

  methods: {
    getFCode(email) {
      if (
        /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/.test(email)
      ) {
        checkForgetCode(email).then(res => {
          if (res.data.code * 1 === 3) {
            this.forgetData.disabled = false;
            this.$message({
              message: "该邮箱未注册！！",
              type: "warning",
              duration: 2000
            });
          } else {
            this.forgetData.disabled = true;
            this.$message({
              message: "验证码发送成功！！",
              type: "success",
              duration: 2000
            });
            getForgetCode(email).then(res => {
              clearTimeout(this.forgetData.timer);
              let t = 0;
              let fn = () => {
                t += 1000;
                if (t > res.data.time) {
                  clearTimeout(this.forgetData.timer);
                  this.forgetData.disabled = false;
                  this.forgetData.refreshText = "获取验证码";
                } else {
                  this.forgetData.disabled = true;
                  this.forgetData.refreshText =
                    (((res.data.time - t) / 1000) | 0) + "s后刷新";
                }
              };
              this.forgetData.timer = setInterval(fn, 1000);
              fn();
            });
          }
        });
      } else {
        this.$message({
          message: "请输入正确的邮箱地址！！",
          type: "error",
          duration: 2000
        });
      }
    },
    returnLogin() {
      this.$emit("handleLogin", false);
    },
    /*修改的点击*/
    handleClick() {
      this.forgetData.submitDisabled = true;
      this.$refs["form"].validate(valid => {
        if (valid) {
          //验证都通过
          postForget(this.form)
            .then(res => {
              // this.getECode();
              if (res.data.code) {
                this.$message({
                  message: res.data.msg,
                  type: "error",
                  duration: 2000
                });
                this.forgetData.submitDisabled = false;
              } else {
                //修改成功
                this.$message({
                  message: "修改成功！",
                  type: "success",
                  duration: 2000
                });
                setTimeout(() => {
                  this.forgetData.submitDisabled = false;
                  this.$emit("handleClose", true);
                }, 1800);
              }
            })
            .catch(e => {
              this.forgetData.submitDisabled = false;
              // this.getECode();
              this.$message({
                message: "注册失败请稍后再试~",
                type: "error",
                duration: 2000
              });
            });
        } else {
          this.forgetData.submitDisabled = false;
          //验证没通过
          return false;
        }
      });
    },

    /*关闭的回调*/
    beforeClose(done) {
      this.$emit("handleClose", false);
    }
  },

  mounted() {},
  destroyed() {
    clearTimeout(this.forgetData.timer);
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
      width: 45%;
    }
    .el-link {
      font-size: 12px;
    }
  }
}
</style>