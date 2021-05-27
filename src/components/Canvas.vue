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
  <canvas id="canvas" height="260"></canvas>
</template>

<script>
class Bubble {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = Math.random() * 3 - 1.5;
    this.vy = Math.random() * 3 - 1.5;
    this.r = Math.random() * 3 + 3;
    this.dead = false;
    this.color =
      "rgba(" +
      (Math.random() * 121 + 80) +
      "," +
      (Math.random() * 121 + 80) +
      "," +
      (Math.random() * 121 + 80) +
      ",0.8)";
  }
  render(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalCompositeOperation = "lighter";
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    this.r *= 0.96;
    this.x += this.vx;
    this.y += this.vy;
    if (this.r < 0.01) {
      this.dead = true;
    }
  }
}
export default {
  name: "HelloWorld",
  data() {
    return {
      canvas: null,
      bubbles: [],
      timer: null,
      animateState: true
    };
  },
  mounted() {
    this.init();
    this.register();
    this.render();
  },
  beforeDestroy() {
    clearInterval(this.timer);
    window.removeEventListener("resize", this.handleResize);
    this.canvas.removeEventListener("mousemove", this.handleMousemove);
    this.animateState = false;
  },
  watch: {
    width() {
      this.canvas.width = this.width || 500;
    },
    height() {
      this.canvas.height = this.height || 260;
    }
  },
  methods: {
    init() {
      this.canvas = document.querySelector("#canvas");
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = document.documentElement.offsetWidth;
      this.canvas.height = 260;
      this.auto();
    },
    auto() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.bubbles.push(
          new Bubble(
            this.canvas.width * Math.random(),
            this.canvas.height * Math.random()
          )
        );
      }, 30);
    },
    register() {
      window.addEventListener("resize", this.handleResize);
      this.canvas.addEventListener("mousemove", this.handleMousemove);
    },
    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.bubbles.forEach(bubble => {
        bubble.render(this.ctx);
        bubble.update();
      });
      this.bubbles = this.bubbles.filter(bubble => {
        return !bubble.dead;
      });
      this.animateState && requestAnimationFrame(() => this.render());
    },
    handleResize() {
      this.canvas.width = document.documentElement.offsetWidth;
    },
    handleMousemove(e) {
      this.bubbles.push(new Bubble(e.offsetX, e.offsetY));
    }
  }
};
</script>
<style scoped>
#canvas {
  background-color: rgba(80, 80, 80, 0.7);
}
</style>
