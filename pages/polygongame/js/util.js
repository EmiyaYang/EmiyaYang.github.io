/**
 * 求给定两坐标之间的直线距离
 * @param x1
 * @param x2
 * @param y1
 * @param y2
 */
function countDistanceWithCoordinate (x1, y1, x2, y2) {
    return Math.pow((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2), 0.5);
}

PIXI.DisplayObject.prototype.centerHorizontally = function (parent) {
    this.x = (parent.width - this.width) / 2;
};

/**
 * 为pixi对象的多个事件注册同一监听方法
 * @param e  事件数组
 * @param callback
 * @returns {null}
 */
PIXI.DisplayObject.prototype.subscribe = function (e, callback) {
    if (!e || !callback || !e.length) return null;
    for (let i = 0; i < e.length; i++) {
        this.on(e[i], callback);
    }
};

PIXI.Container.prototype.setAlphaOfAll = function (value) {
  for (let i = 0; i < this.children.length; i++ ){
      this.children[i].alpha = value;
  }
};

/**
 * 只显示指定序号的子节点
 * @param serial
 */
PIXI.Container.prototype.monoChildren = function (serial) {
    if (serial < 0 || serial > this.children.length) return;
    for (let i = 0; i < this.children.length; i++) {
        this.children[i].visible = i === serial;
    }
};

PIXI.Container.prototype.sortChildren = function () {
    let a = [];
    for (let i = 0; i < this.children.length; i++) {
        //zIndex越大，叠放次序越高，默认为0即最低
        if(!this.children[i].zIndex) this.children[i].zIndex;
        if (!a[this.children[i].zIndex]) a[this.children[i].zIndex] = [];
        a[this.children[i].zIndex][a[this.children[i].zIndex].length] = this.children[i];
    }
    let n = 0;
    for (let j = 0; j < a.length; j++) {
        if (!a[j]) continue;
        for (let i = 0; i < a[j].length; i++) {
            this.setChildIndex(a[j][i], n++);
        }
    }
};

//定义链表结点
function PNode() {
    this.value = 0;
    this.x = 0;
    this.y = 0;
    this.next = null;
    this.nextOperation = '+';
    this.prior = null;
}

// 生成双向循环链表
function generateLinkList (n, VT) {

    let v = getPolygonVertices(n + 3, 170, VT);

    let head = new PNode();
    head.value = v[0].value;
    head.x = v[0].x;
    head.y = v[0].y;
    head.nextOperation = v[0].type;
    head.next = null;

    let q = head;
    let p;

    for (let i = 1; i < v.length; i++) {
        p = new PNode();
        p.value = v[i].value;
        p.x = v[i].x;
        p.y = v[i].y;
        p.nextOperation = v[i].type;
        q.next = p;
        p.prior = q;
        q = p;
    }
    p.next = head;
    head.prior = p;
    return head;
}

function generateLinkList2 (n, ifRandom) {

    let v = getPolygonVertices(n + 3, POLYGON_RADIUS, ifRandom);

    let head = new PNode();
    head.value = v[0].value;
    head.x = v[0].x;
    head.y = v[0].y;
    head.nextOperation = v[1].type;
    head.next = null;

    let q = head;
    let p;

    for (let i = 1; i < v.length; i++) {
        p = new PNode();
        p.value = v[i].value;
        p.x = v[i].x;
        p.y = v[i].y;
        if (v[i + 1]) {
            p.nextOperation = v[i + 1].type;
        }
        q.next = p;
        p.prior = q;
        q = p;
    }
    p.next = head;
    p.nextOperation = v[0].type;
    head.prior = p;
    return head;
}

// 往前遍历一个节点直至找到端点
function findPriorEndPoint (p) {
    //TODO 递归错误处理
    let q = p;
    while (q && q.prior) {
        q = q.prior;
    }
    return q;
}

PNode.prototype.findNode = function (n) {
    if (n < 0) return null;
    let p = this;
    while (n-- && p) {
        p = p.next;
    }
    return p;
};

/**
 * 生成游戏所需的多边形，包括各个点的值
 * @param edges
 * @param r
 * @param VT
 * @returns {Array}
 */
function getPolygonVertices (edges, r, VT) {
    let ca = 0,
        aiv = 360 / edges,
        ata = Math.PI / 180,
        list = [];

    for (let k = 0; k < edges; k++) {
        let o = {};
        o.x = Math.cos(ca * ata) * r;
        o.y = Math.sin(ca * ata) * r;

        if(!VT) {
            o.value = randomInt(POLYGON_MIN_VERTICE_VALUE, POLYGON_MAX_VERTICE_VALUE);
            o.type = randomInt(0, 1) ? '+' : '×'
        } else {
            o.value = VT[k].value;
            if ( k + 1 !== edges) o.type = VT[k + 1].type;  //必要的算法适配
            else o.type = VT[0].type;
        }

        list.push(o);

        ca += aiv;
    }

    return list;
}

function generateVT (edgesNum) {
    let arr = [];
    for (let i = 0; i < edgesNum; i++) {
        arr.push({
            value: randomInt(POLYGON_MIN_VERTICE_VALUE, POLYGON_MAX_VERTICE_VALUE),
            type: randomInt(0, 1) ? '+' : '×'
        });
    }
    return arr;
}

// 深层复制链表
function copyLinkList(head) {
    if (!head) return;
    let p1 = head;
    let newHead = new PNode();
    newHead.value = p1.value;
    newHead.x = p1.x;
    newHead.y = p1.y;
    newHead.nextOperation = p1.nextOperation;
    newHead.next = null;
    let p2 = newHead;
    while (p1.next && p1.next !== head) {
        p1 = p1.next;
        p2.next = new PNode();
        p2.next.prior = p2;
        p2 = p2.next;
        p2.value = p1.value;
        p2.x = p1.x;
        p2.y = p1.y;
        p2.nextOperation = p1.nextOperation;
    }
    if (p1.next === head) {
        p2.next = newHead;
        newHead.prior = p2;
    }

    return newHead;
}

// 计算两个node的值
function countNodeValue(node) {
    if (!node || !node.next) return null;
    return node.nextOperation === '+' ?
        parseInt(node.value) + parseInt(node.next.value)
        : parseInt(node.value) * parseInt(node.next.value);
}

function countNodeValue2(node) {
    if (!node || !node.prior) return null;
    return node.prior.nextOperation === '+' ?
        parseInt(node.value) + parseInt(node.prior.value)
        : parseInt(node.value) * parseInt(node.prior.value);
}

// 抽离一个完整链表也就是多边形的value-type集合以适配dp算法
function getVT(head) {
    let VT = [];
    let p = head;

    do {
        VT.push({
            value: p.value,
            type: p.prior.nextOperation
        });
        p = p.next;
    } while (p !== head);

    return VT;
}


/**
 * 关卡要用到Card类
 * @param edgeNum 边数
 * @param starNum 星星数， -1表示没有挑战过
 * @param clickEvent
 * @constructor
 */
function Card(edgeNum, starNum, clickEvent) {
    this.edgeNum = edgeNum;
    this.view = document.createElement('div');
    this.view.classList.add('card');
    this.view.innerHTML = ' <div class="card-content"> <h1>'+ this.edgeNum +'边形</h1> </div> <div class="card-footer"></div>';
    this.clickEvent = clickEvent;

    this.view.onclick = clickEvent;

    let footer = this.view.getElementsByClassName('card-footer')[0];
    if (starNum === -1) {
        footer.innerHTML = ' Challenge!';
        return;
    }
    for (let i = 0; i < starNum; i++) {
        let img = document.createElement('img');
        img.src = 'assets/img/star_fill.svg';
        footer.appendChild(img);
    }

    for (let i = 0; i < 3 - starNum; i++) {
        let img = document.createElement('img');
        img.src = 'assets/img/star_empty.svg';
        footer.appendChild(img);
    }

}

Card.prototype.disabled = function () {
    this.view.innerHTML = ' <div class="card-content"> <img src="assets/img/lock.svg" > </div> <div class="card-footer"> Locked</div>';
    this.view.onclick = function () {};
};

Card.prototype.enabled = function () {
    this.view.onclick = this.clickEvent;
};

function countStarsNum (score, bestScore) {
    if (!bestScore) return null;
    let r = score / bestScore;
    if (r <= 0.2) return 0;
    if (r <= 0.5) return 1;
    if (r <= 0.8) return 2;
    return 3;
}

/**
 * dp获取最优结果
 * @param inputPath
 * @returns {*}
 */
function getMaxValue (inputPath) {
    let values = [];
    let types = [];

    for (let i = 0; i < inputPath.length; i++) {
        values.push(inputPath[i].value);
        types.push(inputPath[i].type);
    }

    let N = values.length;
    let v;
    let m;
    let op;
    let MAXN = 1024;
    let path = [];
    let backtrack;
    let count = 0;
    let result;

    function initValue() {
        m = new Array(N + 1);
        for (let i = 0; i <= N; i++) {
            m[i] = new Array(N + 1);
            for (let j = 0; j <= N; j++) {
                m[i][j] = new Array(2);
            }
        }
        backtrack = new Array(N + 1);
        for (let i = 0; i <= N; i++) {
            backtrack[i] = new Array(N + 1);
        }
        v = new Array(N + 1);
        v[0] = 0;
        op = new Array(N + 1);
        op[0] = '';

    }

    function getValue() {
        initValue();
        for(let i=1;i<=N;i++){
            v[i]=values[i-1];
            op[i]=types[i-1];
        }
        // v = [0, 1, 2, 3, 4, 5, 6];
        // op = [" ", "*", "+", "*", "+", "*", "+"];
        for (let i = 1; i <= N; i++) {
            let value = v[i];
            let oper = op[i];

            m[i][1][0] = Number(value);
            m[i][1][1] = Number(value);
            for (let j = 2; j <= N; j++) {
                m[i][j][0] = MAXN;
                m[i][j][1] = MAXN * (-1);
            }
            v[i] = Number(value);
            op[i] = oper;
        }

        polygonGame(N);
        // return result;
    }


    function polygonGame(n) {
        let i, j;
        // console.log(n);
        // console.log(backtrack);
        for (j = 2; j <= n; j++) {
            for (i = 1; i <= n; i++) {
                dealFunc(n, i, j)
            }
        }
        // console.log(op);
        // console.log(v);
        let max = m[1][n][1];
        let p = 1;
        for (i = 1; i <= n; i++) {
            // console.log("delete:" + i + "all:" + m[i][n][1]);
            if (max < m[i][n][1]) {
                max = m[i][n][1];
                p = i;
            }
        }
        // console.log("delete:" + p + "all:" + max);
        // console.log(m);
        backtrack[0][0] = p;
        dealPath(max, p, n);
        path.push(p);
        path.reverse();
        console.log(path);
        console.log(max);
        result = {
            path : path,
            score : max
        }
    }


    function dealPath(val, i, j) {
        if (j === 1)
            return;

        for (let k = 1; k < j; k++) {
            let a = m[i][k][0];
            let b = m[i][k][1];
            let next = i + k;
            if (next > N)
                next %= N;
            let c = m[next][j - k][0];
            let d = m[next][j - k][1];
            if (op[next] === "+") {
                num1 = b + d;
                num2 = a + c;
                if (val === num1) {
                    path.push(next);
                    dealPath(b, i, k);
                    dealPath(d, next, j - k);
                    break;
                }
                else if (val === num2) {
                    path.push(next);
                    dealPath(a, i, k);
                    dealPath(c, next, j - k);
                    break;
                }
            } else {
                let num1 = a * c;
                let num2 = a * d;
                let num3 = b * c;
                let num4 = b * d;
                if (val === num1) {
                    path.push(next);
                    dealPath(a, i, k);
                    dealPath(c, next, j - k);
                    break;
                }
                else if (val === num2) {
                    path.push(next);
                    dealPath(a, i, k);
                    dealPath(d, next, j - k);
                    break;
                }
                else if (val === num3) {
                    path.push(next);
                    dealPath(b, i, k);
                    dealPath(c, next, j - k);
                    break;
                }

                else if (val === num4) {
                    path.push(next);
                    dealPath(b, i, k);
                    dealPath(d, next, j - k);
                    break;
                }
            }
        }
    }

    function dealFunc(n, i, j) {
        for (let k = 1; k < j; k++) {
            let a = m[i][k][0];
            let b = m[i][k][1];
            let next = i + k;
            if (next > N)
                next %= N;
            let c = m[next][j - k][0];
            let d = m[next][j - k][1];
            let maxf, minf;
            if (op[next] === '+') {
                maxf = b + d;
                minf = a + c;
            } else {
                let e = new Array(4);
                e[0] = a * c;
                e[1] = a * d;
                e[2] = b * d;
                e[3] = b * c;
                minf = e[0];
                maxf = e[0];
                for (let t = 1; t < 4; t++) {
                    if (minf > e[t])
                        minf = e[t];
                    if (maxf < e[t]) {
                        maxf = e[t];
                    }
                }
            }
            if (m[i][j][0] > minf)
                m[i][j][0] = minf;
            if (m[i][j][1] < maxf) {
                m[i][j][1] = maxf;
                backtrack[i][j] = k;
            }

        }
    }

    getValue();
    return result;
}

/**
 * 随机生成一个min到max之间的整数
 * @param min
 * @param max
 * @returns {*}
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 根据边序数组返回对应的节点集合
function convertPath (path, head) {
    // path.unshift(path.pop()); //必要的适配处理
    let arr = [];
    for (let i = 0; i < path.length; i++) {
        arr.push(head.findNode(path[i] - 1)); //边序从0开始
    }
    return arr;
}

let ps = [];
let head = new PNode();



