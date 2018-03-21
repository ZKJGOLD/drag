window.onload = function () {
    (function () {
        let length = 5*5*5;
        let oUl = document.getElementById("list").children[0];
        let aLi = oUl.children;
        for(let i=0;i<length;i++){
            let oLi = document.createElement("li");
            //建立坐标系
            oLi.x = i%5;//x坐标
            oLi.y = Math.floor(i%25/5);//y坐标
            oLi.z = Math.floor(i/25);//z坐标
            oLi.innerHTML = `x:${oLi.x} y:${oLi.y} z:${oLi.z}`;
            oUl.appendChild(oLi);
        }

        Grid();

        //拖拽滚轮事件的添加
        (function () {
            let roX = 0,
                roY = 0,
                trZ = -1500;

            document.onselectstart = function (e) {
                return false;
            };
            document.ondrag = function (e) {
                return false;
            };
            document.onmousedown = function (e) {
                let sX = e.clientX,
                    sY = e.clientY,
                    rY = roY,
                    rX = roX;
                this.onmousemove = function (e) {
                    let chaX = e.clientX - sX,//得到鼠标x位移量
                        chaY = e.clientY - sY;//得到鼠标y位移量
                    rY = roY + chaX*0.15;//设置y度;
                    rX = roX - chaY*0.15;//设置x度数
                    oUl.style.transform = `translateZ(${trZ}px) rotateY(${rY}deg) rotateX(${rX}deg)`;
                };
                this.onmouseup = function (e) {
                    roX = rX;
                    roY = rY;
                    this.onmousemove = null;
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

        //Grid布局方式
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
    })();
};
