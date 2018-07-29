particlesJS.load('particles-js', 'assets/config/particles_2.json', function() {
    console.log('callback - particles.js config loaded');
});

var app = new Vue({
    el: '#main-swiper',
    data: {
        message: '["这里是杨家淇", "专注于前端开发"]',
        creationIndex: -1,
        creations: [{
            name: 'PaPa互娱夜店上墙小程序',
            img: 'assets/img/demo_preview_1.jpg',
            description: '在微信小程序刚推出不久尝试开发的一款应用于夜店场景的上墙小程序，实现了土豪榜、霸屏打赏、群聊私聊等功能，后续由于项目交接问题没有进行上线。'
        }, {
            name: '多边形H5小游戏',
            img: 'assets/img/demo_preview_2.png',
            description: '使用 CoCos 引擎制作的一款 H5 小游戏，这款游戏应用了经典的 DP 问题。'
        }, {
            name: 'insight后台监控小程序',
            img: 'assets/img/demo_preview_3.jpg',
            description: '这是使用 Gulp + Sass + eCharts + 小程序原生框架构建的一款后台性能监控小程序。'
        }]
    },
    mounted: function () {
        var self = this;
        new Swiper('#main-swiper', {
            mousewheel: true,
            direction: 'vertical',
            // loop: true,

            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
            },

            // 如果需要前进后退按钮
            // navigation: {
            //     nextEl: '.swiper-button-next',
            //     prevEl: '.swiper-button-prev',
            // },

            // 如果需要滚动条
            // scrollbar: {
            //     el: '.swiper-scrollbar',
            // },
        });
        new Swiper('#sub-swiper', {
            direction: 'horizontal',
            // loop: true,
            slidesPerView: 'auto',

            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination',
            },
            on:{
                slideNextTransitionStart: function(){
                    console.log('switch');
                    self.creationIndex++;
                }
            }
        });
    }
});


var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 300 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function() {
        that.tick();
    }, delta);
};

window.onload = function() {
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i=0; i<elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-rotate');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);
};