~function anonymous(window){
    // 根据当前设备的宽度，动态计算出REM的换算比例，实现页面的等比缩放
    let computedREM=function(){
        let winW=document.documentElement.clientWidth,
            desW=640;
        if(winW>=640){
            document.documentElement.style.fontSize='100px';
            return;
        }
        document.documentElement.style.fontSize=winW / desW * 100 + 'px';
    };
    computedREM();
    window.addEventListener('resize',computedREM);
}(window);

let loadingRender=(function(){
    let $loadingBox=$('.loadingBox'),
        $current=$loadingBox.find('.current');
    let imgData = ["img/icon.png", "img/zf_concatAddress.png", "img/zf_concatInfo.png", "img/zf_concatPhone.png", "img/zf_course.png", "img/zf_course1.png", "img/zf_course2.png", "img/zf_course3.png", "img/zf_course4.png", "img/zf_course5.png", "img/zf_course6.png", "img/zf_cube1.png", "img/zf_cube2.png", "img/zf_cube3.png", "img/zf_cube4.png", "img/zf_cube5.png", "img/zf_cube6.png", "img/zf_cubeBg.jpg", "img/zf_cubeTip.png", "img/zf_emploment.png", "img/zf_messageArrow1.png", "img/zf_messageArrow2.png", "img/zf_messageChat.png", "img/zf_messageKeyboard.png", "img/zf_messageLogo.png", "img/zf_messageStudent.png", "img/zf_outline.png", "img/zf_phoneBg.jpg", "img/zf_phoneDetail.png", "img/zf_phoneListen.png", "img/zf_phoneLogo.png", "img/zf_return.png", "img/zf_style1.jpg", "img/zf_style2.jpg", "img/zf_style3.jpg", "img/zf_styleTip1.png", "img/zf_styleTip2.png", "img/zf_teacher1.png", "img/zf_teacher2.png", "img/zf_teacher3.jpg", "img/zf_teacher4.png", "img/zf_teacher5.png", "img/zf_teacher6.png", "img/zf_teacherTip.png"];
    // run用来预加载图片
    let n=0;
    let imglength=imgData.length;
    let run=function(callback){
        dalayTimer=0;
        imgData.forEach((item)=>{
            let tempImg=new Image;
            tempImg.src=item;
            tempImg.onload=()=>{
                tempImg=null;
                $current.css('width',((++n) / imglength)* 100 +'%');
                // 加载完成后，执行回调函数（让当前loading页面消失）
                if(n===imglength){
                    clearTimeout(delayTimer);//清除计时器的作用是：防止在10s之内加载完成之后，再次执行delayTimer，清除loadingBox
                    callback&&callback();
                }
            };
        });
    };
    // 设置最长等待时间 （假设10s，到达10秒我们看看加载了多少了，如果达到了90%以上，我们可以正常访问内容，如果不足这个比例，
    // 直接提示用户当前网络状况不加，稍后重试）
    let delayTimer=null;
    let Maxdalay=function Maxdalay(callback){
        delayTimer=setTimeout(()=>{
            if(n/imglength>=0.9){
                callback&&callback();
                return;
            }
            alert('网络状态不佳！请重试');
            // window.location.href='https://www.baidu.com/';/*十秒加载不完则跳转到其他页面。*/
        },10000);
    };

    let done=function done(){
        // 停留一秒钟移除loadingBox
        let timer=setTimeout(()=>{
        $loadingBox.remove();
        },1000); 
        phoneRender.init(); 
    };

    return{
        init:function(){
            $loadingBox.css('display','block');
            run(done);
            Maxdalay(done);
            console.dir($loadingBox);
        }
    }
}
)();

let phoneRender=(function(){
    let $phoneBox=$('.phoneBox'),
        $time=$phoneBox.find('span'),
        $answer=$phoneBox.find('.answer'),
        $answerMark=$answer.find('.markLink'),
        $hangup=$phoneBox.find('.hangup'),
        $hangupMark= $hangup.find('.markLink'),
        answerBell=$('#answerBell')[0],
        saying=$('#saying')[0];

    let answerMarkTouch = function answerMarkTouch() {
            //1.REMOVE ANSWER
            
            answerBell.pause();
            $(answerBell).remove();//=>一定要先暂停播放然后再移除，否则即使移除了浏览器也会播放着这个声音
            $answer.remove();
            //2.SHOW HANG
            $hangup.css('transform', 'translateY(0rem)');
            $time.css('display', 'block');
            saying.play();
            computedTime();
        };

         //=>计算播放时间
    let autoTimer = null;
    let computedTime = function computedTime() {
        //=>我们让AUDIO播放,首先会去加载资源,部分资源加载完成才会播放,才会计算出总时间DURATION等信息,所以我们可以把获取信息放到CAN-PLAY事件中
        /*let duration = 0;
        saying.oncanplay = function () {
            duration = saying.duration;
        };*/
        autoTimer = setInterval(() => {
            let val = saying.currentTime,
                duration = saying.duration;
            //=>播放完成
            if (val >= duration) {
                clearInterval(autoTimer);
                closePhone();
                return;
            }
            let minute = Math.floor(val / 60),
                second = Math.floor(val - minute * 60);
            minute = minute < 10 ? '0' + minute : minute;
            second = second < 10 ? '0' + second : second;
            $time.html(`${minute}:${second}`);
        }, 1000);
    };

    //=>关闭PHONE
    let closePhone = function closePhone() {
        clearInterval(autoTimer);
        saying.pause();
        $(saying).remove();
        $phoneBox.remove();
        // messageRender.init();
        messageRender.init();
    };

    return{
        init:  function(){
            $phoneBox.css('display', 'block');
            //第一件事播放bell
            console.log(2222, answerBell);
            // $(document).ready(answerBell.play());
            $answerMark.tap(answerMarkTouch);
            $hangupMark.tap(closePhone);
        }
    }
}
)();

let messageRender=(function(){
    let $messageBox=$('.messageBox'),
        $wrapper=$messageBox.find('.wrapper'),
        $messageList=$wrapper.find('li'),
        $keyBoard=$messageBox.find('.keyBoard'),
        $textInp=$keyBoard.find('span'),
        $submit=$keyBoard.find('.submit');
    let step=-1;//记录当前信息的索引
    let total=$messageList.length+1;/*自己好要发一条*/
    let autoTimer=null;//计时器
    let interval=2000;//记录信息出现的时间

    let showMessage=function showMessage(){
        ++step;
        //如果到第二条后，让键盘出来，显示手动发送
        if(step===2){
            clearInterval(autoTimer);
            handSend();
            return;
        };
        let $cur=$messageList.eq(step);
        $cur.addClass('active');
        console.log($cur);
        // if (step >= 3) {
        //     //=>展示的条数已经是四条或者四条以上了,此时我们让WRAPPER向上移动(移动的距离是新展示这一条的高度)
        //     /*let curH = $cur[0].offsetHeight,
        //         wraT = parseFloat($wrapper.css('top'));
        //     $wrapper.css('top', wraT - curH);*/
        //     //=>JS中基于CSS获取TRANSFORM，得到的结果是一个矩阵
        //     let curH = $cur[0].offsetHeight;
        //     tt -= curH;
        //     $wrapper.css('transform', `translateY(${tt}px)`);
        // }
        if (step >= total - 1) {
            //=>展示完了
            clearInterval(autoTimer);
            closeMessage();
        }
    };

    let handSend=function handSend(){
        $keyBoard.css('transform','translateY(0rem)').on('transitionend',()=>{
            //transitionen监听当前元素动画结束。特点：有几个样式属性改变，并执行了过度效果，时间就会被触发执行几次
            console.log(1);
            let str = '好的，马上介绍！',
                n = -1,
                textTimer = null;
            textTimer = setInterval(() => {
                console.log(1);
                let orginHTML = $textInp.html();
                $textInp.html(orginHTML + str[++n]);
                if (n >= str.length - 1) {
                    //=>文字显示完成
                    clearInterval(textTimer);
                    $submit.css('display', 'block');
                    console.log($submit);
                }
            }, 100);
        });
    };

    //=>点击SUBMIT
    let handleSubmit = function handleSubmit() {
        //=>把新创建的LI增加到页面中第二个LI的后面
        $(`<li class="self">
            <i class="arrow"></i>
            <img src="img/zf_messageStudent.png" alt="" class="pic">
            ${$textInp.html()}
        </li>`).insertAfter($messageList.eq(1)).addClass('active');
        $messageList = $wrapper.find('li');//=>重要:把新的LI放到页面中,我们此时应该重新获取LI，让MESSAGE-LIST和页面中的LI正对应，方便后期根据索引展示对应的LI
        //=>继续向下展示剩余的消息
        $textInp.remove();
        // $textInp.html('');
        autoTimer = setInterval(showMessage, interval);
        //=>该消失的消失
        console.log($textInp);
        $submit.css('display', 'none');
        $keyBoard.css('transform', 'translateY(3.7rem)');
    };

    //=>关掉MESSAGE区域
    let closeMessage = function closeMessage() {
        let delayTimer = setTimeout(() => {
            demonMusic.pause();
            $(demonMusic).remove();
            $messageBox.remove();
            clearTimeout(delayTimer);
            // cubeRender.init();
        }, interval);
        cubeRender.init();
    };

    

    return{
        init:function(){
            demonMusic.play();
            demonMusic.volume = 0.3;
            $messageBox.css('display','block');
            // 先发送一条信息，再间隔2秒展示一条信息
            showMessage();
            autoTimer=setInterval(showMessage,interval);
             //=>SUBMIT
             $submit.tap(handleSubmit);
        }
    }
})();


let cubeRender=(function cubeRender(){
    let $cubeBox=$('.cubeBox');
    let $cube=$cubeBox.find('.cube');
    let $cubeList=$cube.find('li');

     //=>手指控住旋转
     let start = function start(ev) {
        //=>记录手指按在位置的起始坐标
        console.log(ev);
        let point = ev.changedTouches[0];
        this.strX = point.clientX;
        this.strY = point.clientY;
        this.changeX = 0;
        this.changeY = 0;
    };

    let move = function move(ev) {
        //=>用最新手指的位置-起始的位置，记录X/Y轴的偏移
        let point = ev.changedTouches[0];
        this.changeX = point.clientX - this.strX;
        this.changeY = point.clientY - this.strY;
    };

    let end = function end(ev) {
        //=>获取CHANGE/ROTATE值
        let {changeX, changeY, rotateX, rotateY} = this,
            isMove = false;
        //=>验证是否发生移动（判断滑动误差）
        Math.abs(changeX) > 10 || Math.abs(changeY) > 10 ? isMove = true : null;
        //=>只有发生移动再处理
        if (isMove) {
            //1.左右滑=>CHANGE-X=>ROTATE-Y (正比:CHANGE越大ROTATE越大)
            //2.上下滑=>CHANGE-Y=>ROTATE-X (反比:CHANGE越大ROTATE越小)
            //3.为了让每一次操作旋转角度小一点，我们可以把移动距离的1/3作为旋转的角度即可
            rotateX = rotateX - changeY / 3;
            rotateY = rotateY - changeX / 3;
            //=>赋值给魔方盒子
            $(this).css('transform', `scale(0.6) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
            //=>让当前旋转的角度成为下一次起始的角度
            this.rotateX = rotateX;
            this.rotateY = rotateY;
        }
        //=>清空其它记录的自定义属性值
        ['strX', 'strY', 'changeX', 'changeY'].forEach(item => this[item] = null);
    };


    return{
        init:function(){
           $cubeBox.css('display','block');
           console.log($cube);
           console.log($cube[0]);
            //手指操作cube，让cube旋转

             //=>手指操作CUBE,让CUBE跟着旋转
            let cube = $cube[0];
            cube.rotateX = -35;
            cube.rotateY = 35;//=>记录初始的旋转角度（存储到自定义属性上）
            $cube.on('touchstart', start)
                 .on('touchmove', move)
                 .on('touchend', end);
 
             //=>点击每一个面跳转到详情区域对应的页面
             $cubeList.tap(function () {
                $cubeBox.css('display', 'none');
                 //=>跳转到详情区域,通过传递点击LI的索引,让其定位到具体的SLIDE
                let index = $(this).index();
                detailRender.init(index);
                })
         }
    }
})();

//detail区域
let detailRender = (function () {
    let $detailBox = $('.detailBox'),
        swiper = null,
        $dl = $('.page1>dl');

    let swiperInit = function swiperInit() {
        swiper = new Swiper('.swiper-container', {
            effect: 'coverflow',
            onInit: move,
            onTransitionEnd: move
        });
    };

    let move = function move(swiper) {
        //=>SWIPER:当前创建的实例
        //1.判断当前是否为第一个SLIDE:如果是让3D菜单展开,不是收起3D菜单
        let activeIn = swiper.activeIndex,
            slideAry = swiper.slides;
        if (activeIn === 0) {
            //=>PAGE1
            $dl.makisu({
                selector: 'dd',
                overlap: 0.6,
                speed: 0.8
            });
            $dl.makisu('open');
        } else {
            //=>OTHER PAGE
            $dl.makisu({
                selector: 'dd',
                speed: 0
            });
            $dl.makisu('close');
        }

        //2.滑动到哪一个页面，把当前页面设置对应的ID，其余页面移除ID即可
        slideAry.forEach((item, index) => {
            if (activeIn === index) {
                item.id = `page${index + 1}`;
                return;
            }
            item.id = null;
        });
    };

    return {
        init: function () {
            $detailBox.css('display', 'block');
            if (!swiper) {
                //=>防止重复初始化
                swiperInit();
            }
            // swiper.slideTo(index, 0);//=>直接运动到具体的SLIDE页面(第二个参数是切换的速度：0立即切换没有切换的动画效果)
        }
    }
})();


/*在的项目中，如果页面中有滑动的需求，我们一定要把DOCUMENT本身滑动的默认行为阻止掉（不阻止：浏览器中预览，会触发下拉刷新或者左右滑动切换页卡等功能）*/
$(document).on('touchstart touchmove touchend', (ev) => {
    ev.preventDefault();
});


// =>开发过程中由于当前项目板块众多（每一个板块都是一个单例模式）,我们最好规划一种机制：通过标示的判断可以让程序只执行对应的板块内容，
// 这样开发哪个板块，我们就把标示改为HASH,通过路由控制

    let url=window.location.href,//获取当前页面的url location .href='XXX'是让其跳转的某个页面
        well=url.indexOf('#'),
        hash=well===-1?null:url.substr(well+1);
    console.log(hash);
    switch(hash){
    case 'loading':
        loadingRender.init();
        break;
    case 'phone':
        phoneRender.init();
        break;
    case 'message':
        messageRender.init();
        break;
    case 'cube':
        cubeRender.init();
        break;
    case 'detail':
        detailRender.init();
        break;
    default:
        loadingRender.init();
    }
