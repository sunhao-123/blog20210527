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
  <div class="ertongjie">
    <div class="etj">
      <img src="../../assets/img/etj.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: "Ertongjie",
  data() {
    return {};
  },
  methods: {},
  mounted() {},
};
</script>

<style scoped lang="less">
.ertongjie {
  display: block;
}

@media only screen and (min-width: 992px) {
  .nav-menu {
    padding-right: 0px;
  }

  body.themespring .nav-menu {
    padding-right: 96px;
  }
}
.ertongjie .etj {
  position: relative;
  top: 60px;
  width: 240px;
  height: 0;
  // margin: 50px;
  transform-origin: 50% -100px;
  -webkit-transform-origin: 50% -100px;
  animation: swing 3s infinite ease-in-out;
  -webkit-animation: swing 3s infinite ease-in-out;
  img{
    width: 240px;
    margin: 10px 0 0 40px;
  }
}

@keyframes swing {
  0% {
    transform: rotate(-10deg);
  }

  50% {
    transform: rotate(10deg);
  }

  100% {
    transform: rotate(-10deg);
  }
}

@-moz-keyframes swing {
  0% {
    -moz-transform: rotate(-10deg);
  }

  50% {
    -moz-transform: rotate(10deg);
  }

  100% {
    -moz-transform: rotate(-10deg);
  }
}

@-webkit-keyframes swing {
  0% {
    -webkit-transform: rotate(-10deg);
  }

  50% {
    -webkit-transform: rotate(10deg);
  }

  100% {
    -webkit-transform: rotate(-10deg);
  }
}

@-o-keyframes swing {
  0% {
    -o-transform: rotate(-10deg);
  }

  50% {
    -o-transform: rotate(10deg);
  }

  100% {
    -o-transform: rotate(-10deg);
  }
}
</style>