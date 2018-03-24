window.onload = function () {
    (function () {
        let length = 5*5*5,
            oUl = document.getElementById("list").children[0],
            aLi = oUl.children;
        //初始化
        (function () {
            for(let i=0;i<length;i++){
                let oLi = document.createElement("li");
                //建立坐标系
                oLi.x = i%5;//x坐标
                oLi.y = Math.floor(i%25/5);//y坐标
                oLi.z = 4 - Math.floor(i/25);//z坐标
                oLi.index = i;
                let d = flyData[i] || flyData[0];
                oLi.innerHTML = `<b class="liCover"></b>
                    <p class="liTitle">${d.type}</p>
                    <p class="liAuthor">${d.author}</p>
                    <p class="liTime">${d.time}</p>`;

                let tX = Math.random()*5000-3000,
                    tY = Math.random()*5000-3000,
                    tZ = Math.random()*5000-3000;
                oLi.style.transform = `translate3D(${tX}px,${tY}px,${tZ}px)`;
                oUl.appendChild(oLi);
            }
            setTimeout(Grid,200);
        })();

        //li的点击弹窗事件
        (function () {
            let oAlert = document.getElementById("alert"),
                oFrame =document.getElementById("frame"),
                oATitle = oAlert.getElementsByClassName("title")[0].getElementsByTagName("span")[0],
                oAImg = oAlert.getElementsByClassName("img")[0].getElementsByTagName("img")[0],
                oAAuthor = oAlert.getElementsByClassName("author")[0].getElementsByTagName("span")[0],
                oAInfo = oAlert.getElementsByClassName("info")[0].getElementsByTagName("span")[0];
            let oAll = document.getElementById("all");
            let oBack = document.getElementById("back");
            oUl.onclick = function (e) {
                let target = e.target;
                if(/b/i.test(target.nodeName)){
                    if(target.zkj){
                        target.zkj = false;
                    }else{
                        if(oAlert.style.display === "block"){
                            hide();
                        }else{
                            let index = target.parentNode.index;
                            let d = flyData[index] || flyData[0];
                            oAlert.index = index;
                            oATitle.innerHTML = `课题：${d.title}`;
                            oAImg.src = `src/${d.src}/index.png`;
                            oAAuthor.innerHTML = `制作人： ${d.author}`;
                            oAInfo.innerHTML = `描述：${d.dec}`;
                            show();
                        }
                    }
                }
                e.stopPropagation();
            };
            //弹出层点击切换页面
            oAlert.onclick = function (e) {
                let d = flyData[this.index] || flyData[0];
                oFrame.src = `src/${d.src}/index.html`;
                oAll.className = "left";
                e.stopPropagation();
            };
            //弹出层消失触发
            document.onclick = function () {
                hide();
            };
            //返回主页面
            oBack.onclick = function () {
                oAll.className = "";
            };

            function show() {
                if(!oAlert.timer){
                    oAlert.timer = true;
                    oAlert.style.display = "block";
                    oAlert.style.transform = `rotateY(${0}deg) scale(${2})`;
                    oAlert.style.opacity = "0";
                    let time = 300,
                        sTime = new Date();
                    function m() {
                        let prop = (new Date - sTime)/time;
                        if(prop>=1){
                            prop = 1;
                            oAlert.timer = false;
                        }else{
                            requestAnimationFrame(m);
                        }
                        oAlert.style.transform = `rotateY(${0}deg) scale(${(1-2)*prop+2})`;
                        oAlert.style.opacity = prop;
                    }
                    requestAnimationFrame(m);
                }
                return false;
            }

            function hide() {
                if(oAlert.style.display === "block" && !oAlert.timer){
                    oAlert.timer = true;
                    oAlert.style.display = "block";
                    oAlert.style.transform = `rotateY(${0}deg) scale(${1})`;
                    let time = 800,
                        sTime = new Date();
                    function m() {
                        let prop = (new Date - sTime)/time;
                        if(prop>=1){
                            prop = 1;
                            oAlert.timer = false;
                            oAlert.style.display = "none";
                        }else{
                            requestAnimationFrame(m);
                        }
                        oAlert.style.transform = `rotateY(${180*prop}deg) scale(${1-prop})`;
                        oAlert.style.opacity = 1-prop;
                    }
                    requestAnimationFrame(m);
                }
            }
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
                    y_ = 0,
                    ifMove = false;
                if(/b/i.test(e.target.nodeName)){
                    var thisLi = e.target;
                }
                this.onmousemove = function (e) {
                    console.log(1);
                    ifMove = true;
                    x_ = e.clientX - lastX;
                    y_ = e.clientY - lastY;

                    roX -= y_*0.15;
                    roY += x_*0.15;
                    oUl.style.transform = `translateZ(${trZ}px) rotateY(${roY}deg) rotateX(${roX}deg)`;
                    lastX = e.clientX;
                    lastY = e.clientY;

                };
                this.onmouseup = function (e) {
                    if(ifMove && e.target === thisLi){
                        thisLi.zkj = true;
                    }
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
            if(Table.arr){
                for(let i=0;i<length;i++){
                    aLi[i].style.transform = Table.arr[i];
                }
            }else {
                Table.arr = [];
                let n = Math.ceil(length/18)+2;
                let midY = n/2 - 0.5,
                    midX = 18/2 - 0.5,
                    disX = 170,
                    disY = 210;
                let arr = [
                    {x : 0 , y : 0},
                    {x : 17 , y : 0},
                    {x : 0 , y : 1},
                    {x : 1 , y : 1},
                    {x : 12 , y : 1},
                    {x : 13 , y : 1},
                    {x : 14 , y : 1},
                    {x : 15 , y : 1},
                    {x : 16 , y : 1},
                    {x : 17 , y : 1},
                    {x : 0 , y : 2},
                    {x : 1 , y : 2},
                    {x : 12 , y : 2},
                    {x : 13 , y : 2},
                    {x : 14 , y : 2},
                    {x : 15 , y : 2},
                    {x : 16, y : 2},
                    {x : 17, y : 2},
                ];
                for(let i=0;i<length;i++){
                    let x,y;
                    if(i<18){
                        x = arr[i].x;
                        y = arr[i].y;
                    }else{
                        x = i%18;
                        y = Math.floor(i/18)+2;
                    }
                    let val = `translate3D(${(x-midX)*disX}px,${(y-midY)*disY}px,${0}px)`;
                    Table.arr[i] = val;
                    aLi[i].style.transform = val;
                }
            }
        }
        //Sphere 球状布局
        function Sphere() {
            if(Sphere.arr){
                for(let i=0;i<length;i++){
                    aLi[i].style.transform = Sphere.arr[i];
                }
            }else{
                Sphere.arr = [];
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
                    let val = `rotateY(${(numG+1.3)*yDeg}deg) rotateX(${90-numC*xDeg}deg) translateZ(${800}px)`;
                    Sphere.arr[i] = val;
                    aLi[i].style.transform = val;
                }
            }

        }
        //Grid层叠式布局
        function Grid() {
            if(Grid.arr){
                for(let i=0;i<length;i++){
                    aLi[i].style.transform = Grid.arr[i];
                }
            }else{
                Grid.arr = [];
                let disX = 300;//每一个li 水平（x）方向的间距
                let disY = 350;//每一个li 垂直（y）方向的间距
                let disZ = 500;//每一个li 纵深（z）方向的间距

                for(let i=0;i<length;i++){
                    let oLi = aLi[i];
                    let x = (oLi.x - 2)*disX,
                        y = (oLi.y - 2)*disY,
                        z = (oLi.z - 2)*disZ;
                    let val = `translate3D(${x}px,${y}px,${z}px)`;
                    Grid.arr[i] = val;
                    oLi.style.transform = val;
                }
            }

        }
        //Helix螺旋式布局
        function Helix() {
            if(Helix.arr){
                for(let i=0;i<length;i++){
                    aLi[i].style.transform = Helix.arr[i];
                }
            }else{
                Helix.arr = [];
                let h = 4;
                let num = Math.round(length/h);
                let deg = 360/num;
                let mid = Math.floor(length/2);
                let tY = 6;
                for(let i=0;i<length;i++){
                    let val = `rotateY(${i*deg}deg) translateY(${(i-mid)*tY}px) translateZ(${900}px)`;
                    Helix.arr[i] = val;
                    aLi[i].style.transform = val;
                }
            }
        }
    })();
};
