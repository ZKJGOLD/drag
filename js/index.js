window.onload = function () {
    (function () {
        let length = 5*5*5;
        let oUl = document.getElementById("list").children[0];
        let aLi = oUl.children;


        //初始化
        (function () {
            for(let i=0;i<length;i++){
                let oLi = document.createElement("li");
                //建立坐标系
                oLi.x = i%5;//x坐标
                oLi.y = Math.floor(i%25/5);//y坐标
                oLi.z = Math.floor(i/25);//z坐标
                oLi.innerHTML = `x:${oLi.x} y:${oLi.y} z:${oLi.z}`;

                let tX = Math.random()*5000-3000,
                    tY = Math.random()*5000-3000,
                    tZ = Math.random()*5000-3000;
                oLi.style.transform = `translate3D(${tX}px,${tY}px,${tZ}px)`;
                oUl.appendChild(oLi);
            }
            setTimeout(Grid,1000);
        })();



        //拖拽滚轮事件的添加
        (function () {
            let roX = 0,
                roY = 0,
                trZ = -1500,
                timerMouse = null;

            document.onselectstart = function (e) {
                return false;
            };
            document.ondrag = function (e) {
                return false;
            };
            document.onmousedown = function (e) {
                cancelAnimationFrame(timerMouse);
                let sX = e.clientX,
                    sY = e.clientY,
                    lastX = sX,
                    lastY = sY,
                    x_ = 0,
                    y_ = 0;
                this.onmousemove = function (e) {
                    x_ = e.clientX - lastX;
                    y_ = e.clientY - lastY;

                    roX -= y_*0.15;
                    roY += x_*0.15;
                    oUl.style.transform = `translateZ(${trZ}px) rotateY(${roY}deg) rotateX(${roX}deg)`;
                    lastX = e.clientX;
                    lastY = e.clientY;

                };
                this.onmouseup = function (e) {
                    this.onmousemove = null;
                    function m() {
                        x_ *= 0.9;
                        y_ *= 0.9;
                        roX -= y_*0.35;
                        roY += x_*0.35;
                        oUl.style.transform = `translateZ(${trZ}px) rotateY(${roY}deg) rotateX(${roX}deg)`;
                        if(Math.abs(x_)<0.2 && Math.abs(y_)<0.2)return;
                       timerMouse = requestAnimationFrame(m);
                    }
                    timerMouse = requestAnimationFrame(m);
                }
            };


            !function (fn) {
                if(document.onmousewheel === undefined){
                    document.addEventerListener("DOMMouseScroll",function (e) {
                        let d = -e.detail/3;
                        fn.call(this,d);
                    },false);
                }else{
                    document.onmousewheel = function (e) {
                        let d = e.wheelDelta / 120;
                        fn.call(this,d);
                    }
                }
            }(function (d) {
                 trZ += d*100;
                 oUl.style.transform = `translateZ(${trZ}px) rotateY(${roY}deg) rotateX(${roX}deg)`;
             });
        })();

        //左下btn点击
        (function () {
            let aBtn = document.getElementById("btn").getElementsByTagName("li");
            let arr = [Table,Sphere,Helix,Grid];
            for(let i=0,length=aBtn.length;i<length;i++){
                (function () {
                    aBtn[i].onclick = arr[i];
                })(i);
            }
        })();

        //Table 元素周期表
        function Table() {

        }
        //Sphere 球状布局
        function Sphere() {
            let arr = [1,3,8,9,11,14,21,15,12,10,9,7,4,1],
                arrLength = arr.length,
                xDeg = 180/(arrLength-1);
            for(let i=0;i<length;i++){
                //求出当前i处于第几层 第几个
                let numC = 0,numG = 0;//层数，个数
                let arrSum = 0;
                for(let j=0;j<arrLength;j++){
                    arrSum += arr[j];
                    if(arrSum>i){
                        numC = j;
                        numG = i-(arrSum-arr[j]);
                        break;
                    }
                }

                let yDeg = 360/arr[numC];
                aLi[i].style.transform = `rotateY(${(numG+1.3)*yDeg}deg) rotateX(${90-numC*xDeg}deg) translateZ(${800}px)`;
            }
        }
        //Grid层叠式布局
        function Grid() {
            let disX = 300;//每一个li 水平（x）方向的间距
            let disY = 350;//每一个li 垂直（y）方向的间距
            let disZ = 500;//每一个li 纵深（z）方向的间距

            for(let i=0;i<length;i++){
                let oLi = aLi[i];
                let x = (oLi.x - 2)*disX,
                    y = (oLi.y - 2)*disY,
                    z = (oLi.z - 2)*disZ;
                oLi.style.transform = `translate3D(${x}px,${y}px,${z}px)`;
            }
        }

        //Helix螺旋式布局
        function Helix() {
            let h = 4;
            let num = Math.round(length/h);
            let deg = 360/num;
            let mid = Math.floor(length/2);
            let tY = 6;
            for(let i=0;i<length;i++){
                aLi[i].style.transform = `rotateY(${i*deg}deg) translateY(${(i-mid)*tY}px) translateZ(${900}px)`
            }
        }
    })();
};
