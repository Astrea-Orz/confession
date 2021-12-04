(($) => {
  var $container = $('#particle')
  var containerWidth = $container.width()
  var containerHeight = $container.height()
  const width = containerWidth
  const height = containerHeight
//   const width = 100
//   const height = ~~(width * containerHeight / containerWidth);
  const offscreenCanvas = document.createElement('canvas');
  const offscreenCanvasCtx = offscreenCanvas.getContext('2d');
  offscreenCanvas.setAttribute('width', width);
  offscreenCanvas.setAttribute('height', height);
  
  offscreenCanvasCtx.fillStyle = '#000';
  offscreenCanvasCtx.font = 'bold 10px Arial';
  const measure = offscreenCanvasCtx.measureText('3'); // 测量文字，用来获取宽度
  const size = 0.7;
  console.log('measure: ', measure)
  // 宽高分别达到屏幕0.7时的size
  const lineHeight = 7; // 10像素字体行高 lineHeight=7 magic
  const fSize = Math.min(height * size * 10 / lineHeight, width * size * 10 / measure.width);

  offscreenCanvasCtx.font = `bold ${fSize}px Arial`;
  
  // 根据计算后的字体大小，在将文字摆放到适合的位置，文字的坐标起始位置在左下方
  const measureResize = offscreenCanvasCtx.measureText('3');
  // 文字起始位置在左下方
  let left = (width - measureResize.width) / 2;
  const bottom = (height + fSize / 10 * lineHeight) / 2;
  offscreenCanvasCtx.fillText('3', left, bottom);
  
  $(offscreenCanvas).appendTo($container)
  
  function setParticle () {
    // texts 所有的单词分别获取 data ，上文的 textAll 是 texts 加一起
    Object.values(texts).forEach(item => {
        offscreenCanvasCtx.clearRect(0, 0, width, height);
        offscreenCanvasCtx.fillText(item.text, left, bottom);
        left += offscreenCanvasCtx.measureText(item.text).width;
        const data = offscreenCanvasCtx.getImageData(0, 0, width, height);
        const points = [];
      // 判断第 i * 4 + 3 位是否为0，获得相对的 x,y 坐标(使用时需乘画布的实际长宽, y 坐标也需要取反向)
        for (let i = 0, max = data.width * data.height; i < max; i++) {
            if (data.data[i * 4 + 3]) {
                points.push({
                    x: (i % data.width) / data.width,
                    y: (i / data.width) / data.height
                });
            }
        }
      // 保存到一个对象，用于后面的绘制
        geometry.push({
            color: item.hsla,
            points
        });
    })
  }
  
  // hsla 格式方便以后做色彩变化的扩展
  const color1 = {h:197,s:'100%',l:'50%',a:'80%'};
  const color2 = {h:197,s:'100%',l:'50%',a:'80%'};
  // lifeTime 祯数
  const Actions = [
      {lifeTime:60,text:[{text:3,hsla:color1}]},
      {lifeTime:60,text:[{text:2,hsla:color1}]},
      {lifeTime:60,text:[{text:1,hsla:color1}]},
      {lifeTime:120,text:[
          {text:'I',hsla:color1},
          {text:'❤️',hsla:color2},
          {text:'Y',hsla:color1},
          {text:'O',hsla:color1},
          {text:'U',hsla:color1}
      ]},
  ];
  function draw() {
      this.tick++;
      if (this.tick >= this.actions[this.actionIndex].lifeTime) {
          this.nextAction();
      }
      this.clear();
      this.renderParticles(); // 绘制点
      this.raf = requestAnimationFrame(this.draw);
  }

  function nextAction() {
      ....//切换场景 balabala..
      this.setParticle(); // 随机将点设置到之前得到的 action.geometry.points 上
  }
  
  // 粒子系统
  class PARTICLE {
      // x,y,z 为当前的坐标，vx,vy,vz 则是3个方向的速度
      constructor(center) {
          this.center = center;
          this.x = 0;
          this.y = 0;
          this.z = 0;
          this.vx = 0;
          this.vy = 0;
          this.vz = 0;
      }
      // 设置这些粒子需要运动到的终点(下一个位置)
      setAxis(axis) {
          this.nextX = axis.x;
          this.nextY = axis.y;
          this.nextZ = axis.z;
          this.color = axis.color;
      }
      step() {
          // 弹力模型 距离目标越远速度越快
          this.vx += (this.nextX - this.x) * SPRING;
          this.vy += (this.nextY - this.y) * SPRING;
          this.vz += (this.nextZ - this.z) * SPRING;
      // 摩擦系数 让粒子可以趋向稳定
          this.vx *= FRICTION;
          this.vy *= FRICTION;
          this.vz *= FRICTION;
      
          this.x += this.vx;
          this.y += this.vy;
          this.z += this.vz;
      }
      getAxis2D() {
          this.step();
          // 3D 坐标下的 2D 偏移，暂且只考虑位置，不考虑大小变化
          const scale = FOCUS_POSITION / (FOCUS_POSITION + this.z);
          return {
              x: this.center.x + (this.x * scale),
              y: this.center.y - (this.y * scale),
          };
      }
  }
  
  const RENDERER = {
    PARTICLE_COUNT: 1500,
    PARTICLE_RADIUS: 1,
    MAX_ROTATION_ANGLE: Math.PI / 60,
    TRANSLATION_COUNT: 500,
    init: function (strategy) {
      this.setParameters(strategy)
      this.createParticles()
      this.setupFigure()
      this.reconstructMethod()
      this.bindEvent()
      this.drawFigure()
    },
  }
  // $.fn.particle = RENDERER

})(jQuery)
