let testNode;

loader
    .add("assets/img/star_fill.svg")
    .add("assets/img/star_empty.svg")
    .add("assets/img/penguin.png")
    .add("assets/img/arrow-right.png")
    .load(setup);

function setup () {
    let data = {
        runtimePolygon: null,
        prePolygon: [], //操作历史记录
        //TODO 计算属性，依赖runtimePolygon
        VT: null, //抽离存储polygon的value-type集合
        edgeNum: 3,
        ifInit: true, //标识是否刚开始游戏,
        score: -1,
        ifInvented: true, //标识是否是预设游戏,
        starArr: [],
        ifRandom: false
    };

    testNode = data;

    let startScene = function () {
        let startCustomGameBtn,
            startPreGameBtn;

        let root = new Container();

        root.init = function () {
            startCustomGameBtn = new Text('DIY Game');
            startCustomGameBtn.position.set(app.screen.width / 2 - startCustomGameBtn.width / 2, app.screen.height / 2 + startCustomGameBtn.height);
            startCustomGameBtn.interactive = true;
            startCustomGameBtn.buttonMode = true;
            startCustomGameBtn.subscribe(['click', 'touchend'], onStartCustomGameBtnClick);

            startPreGameBtn = new Text('Invented Games');
            startPreGameBtn.position.set(app.screen.width / 2 - startPreGameBtn.width / 2, app.screen.height / 2 - startPreGameBtn.height);
            startPreGameBtn.interactive = true;
            startPreGameBtn.buttonMode = true;
            startPreGameBtn.subscribe(['click', 'touchend'], onStartPreGameBtnClick);

            // this.addChild(star);
            this.addChild(startCustomGameBtn, startPreGameBtn);
        };

        root.load = function () {
        };

        function onStartPreGameBtnClick () {
            switchScene(4);
            data.ifInvented = true;
            data.ifRandom = false;
        }

        function onStartCustomGameBtnClick() {
            switchScene(1);
            data.ifInvented = false;
            data.ifRandom = true;
        }

        return root;
    }();

    let customGameScene = function () {
        let previewPolygon,
            polygonLabel,
            dragBar,
            playBtn,
            playBtnGround,
            playBtnLabel;
        let root = new Container();

        root.init = function () {
            polygonLabel = new Text(data.edgeNum + '边形');
            polygonLabel.position.set(app.screen.width / 2 - polygonLabel.width / 2, 450);

            dragBar = new Container();
            let barBody = new Graphics();
            barBody.lineStyle(4, 0x000000, 1);
            barBody.beginFill(0x000000);
            barBody.drawRoundedRect(0, 0, app.screen.width / 10 * 7, 40, 10);
            barBody.endFill();

            let barIndex = new Graphics();
            barIndex.lineStyle(4, 0x000000, 1);
            barIndex.beginFill(0xffffff);
            barIndex.drawRoundedRect(0, 0, 60, 70, 10);
            barIndex.endFill();
            barIndex.y = -(barIndex.height - barBody.height) / 2;
            dragSubscribe(barIndex);

            playBtn = new Container();

            playBtnGround = new Graphics();
            playBtnGround.lineStyle(4, 0x000000, 1);
            playBtnGround.beginFill(0xffffff);
            playBtnGround.drawRoundedRect(0, 0, 150, 70, 10);
            playBtnGround.endFill();
            playBtnLabel = new Text('Challenge!');
            playBtn.interactive = true;
            playBtn.buttonMode = true;
            playBtn.addChild(playBtnGround);
            playBtn.addChild(playBtnLabel);
            playBtn.y = -(playBtn.height - barBody.height) / 2;
            playBtn.x = barBody.width - 10;
            playBtn.pivot.set(0.5, 0.5);
            playBtnLabel.x = playBtn.x + 10;
            playBtn.subscribe(['click', 'touchend'], onPlayBtnClick);

            dragBar.addChild(barBody);
            dragBar.addChild(barIndex);
            dragBar.addChild(playBtn);
            dragBar.addChild(playBtnLabel);
            dragBar.position.set(app.screen.width / 2 - dragBar.width / 2, app.screen.height / 10 * 8.5);

            this.addChild(polygonLabel);
            this.addChild(dragBar);
            this.visible = false;
        };

        root.load = function () {
            data.VT = generateVT(data.edgeNum);
            if (previewPolygon) root.removeChild(previewPolygon);
            previewPolygon = generatePolygon(data.edgeNum, null);
            // previewPolygon.centerHorizontally(app.screen);
            previewPolygon.x = (app.screen.width ) / 2;
            // previewPolygon.pivot.x = previewPolygon.width;
            previewPolygon.y = 200;
            // previewPolygon.
            let p = data.runtimePolygon;
            for (let i = 0; i < data.edgeNum; i++) {
                p.UI.type.subscribe(['click', 'touchend'], onLineTypeClick);
                p.UI.circle.subscribe(['click', 'touchend'], onPointCircleClick);
                p = p.next;
            }
            root.addChild(previewPolygon);
        };

        root.exit = function () {
        };

        function dragSubscribe(obj) {
            obj.buttonMode = true;
            obj.interactive = true;
            obj.on('mousedown', onDragStart)
                .on('touchstart', onDragStart)
                .on('mouseup', onDragEnd)
                .on('mouseupoutside', onDragEnd)
                .on('touchend', onDragEnd)
                .on('touchendoutside', onDragEnd)
                .on('mousemove', onDragMove)
                .on('touchmove', onDragMove);
        }

        function onDragStart(event) {
            if (!this.dragging) {
                this.data = event.data;
                // this.oldGroup = this.parentGroup;
                // this.parentGroup = dragGroup;
                this.dragging = true;

                this.dragPoint = this.data.getLocalPosition(this.parent);
                if (this.x <= 0) {
                    this.x = 1;
                    this.dragPoint.x -= this.x;
                }else if(this.x >= this.parent.children[0].width - this.width) {
                    this.x = this.parent.children[0].width - this.width - 1;
                    this.dragPoint.x -= this.x;
                }else {
                    this.dragPoint.x -= this.x;
                }
            }
        }

        function onDragEnd() {
            if (this.dragging) {
                let newPosition = this.data.getLocalPosition(this.parent);
                if (this.x < 0) this.x = 0;
                else if ( this.x > this.parent.children[0].width  - this.width) this.x = this.parent.children[0].width  - this.width;
                this.dragging = false;
                // this.parentGroup = this.oldGroup
                // set the interaction data to null
                this.data = null;
            }
            // console.log((this.x + this.width) / dragBar.children[0].width);
            data.edgeNum = Math.round((this.x + this.width) / dragBar.children[0].width * POLYGON_MAX_EDGE_NUM) + 2;
            data.runtimePolygon = null;
            polygonLabel.text = data.edgeNum + '边形';
            root.load();
        }

        function onDragMove() {
            if (this.dragging) {
                let newPosition = this.data.getLocalPosition(this.parent);

                if (this.x >= 0 && this.x <= this.parent.children[0].width  - this.width)
                    this.x = newPosition.x - this.dragPoint.x;
                // this.y = newPosition.y - this.dragPoint.y;
            }
        }

        function onPlayBtnClick () {
            root.exit();
            switchScene(2);
        }

        function onPolygonLabelClick() {

            let input = prompt('Input the edge num:', data.edgeNum);
            if (!input) return;
            data.edgeNum = input;
            data.runtimePolygon = null;

            polygonLabel.text = data.edgeNum + '边形';

            root.load();
        }

        function onLineTypeClick() {
            this.node.nextOperation = this.node.nextOperation === '+' ? '×' : '+';
            root.load();
        }

        function onPointCircleClick() {
            let input = prompt("Input the value of the vertex: ", this.node.value);

            if (!input) return;

            this.node.value = input;
            root.load();
        }

        return root;
    }();

    let playScene = function () {
        let polygonBoard,
            previousPolygon,
            polygonPane,
            menuBtn,
            undoBtn,
            commitBtn,
            restartBtn;
        let root = new Container();

        root.init = function () {
            polygonPane = new Container();
            polygonPane.y = 200;
            this.addChild(polygonPane);

            btnGroup = new Container();
            menuBtn = new Text('Menu');
            menuBtn.buttonMode = true;
            menuBtn.interactive = true;
            menuBtn.subscribe(['click', 'touchend'], onMenuBtnClick);
            btnGroup.addChild(menuBtn);

            undoBtn = new Text('Undo');
            undoBtn.y = menuBtn.height;
            undoBtn.buttonMode = true;
            undoBtn.interactive = true;
            undoBtn.subscribe(['click', 'touchend'], onUndoBtnClick);
            btnGroup.addChild(undoBtn);

            restartBtn = new Text('Restart');
            restartBtn.y = undoBtn.y * 2;
            restartBtn.buttonMode = true;
            restartBtn.interactive = true;
            restartBtn.subscribe(['click', 'touchend'], onRestartBtnClick);
            btnGroup.addChild(restartBtn);

            commitBtn = new Text('Commit');
            commitBtn.y = undoBtn.y * 3;
            commitBtn.buttonMode = true;
            commitBtn.interactive = true;
            commitBtn.subscribe(['click', 'touchend'], onCommitBtnClick);
            btnGroup.addChild(commitBtn);

            btnGroup.position.set(app.screen.width / 10 * 8, app.screen.height / 10 * 7);
            this.addChild(btnGroup);
        };

        root.load = function () {
            if (polygonBoard) root.removeChild(polygonBoard);
            polygonBoard = generatePolygon(data.edgeNum, {
                type: {
                    t: ['click', 'touchend'],
                    e: onLineClick
                }
            });
            previousPolygon = new Container();
            polygonPane.x = (app.screen.width - 200) / 2;

            polygonPane.addChild(previousPolygon);
            polygonPane.addChild(polygonBoard);
        };

        root.exit = function () {
            //清空历史操作记录
            data.runtimePolygon = null;
            data.prePolygon = [];
            data.ifInit = true;
            polygonPane.removeChildren(0, polygonPane.children.length);
        };

        function onCommitBtnClick () {
            if (data.runtimePolygon.prior || data.runtimePolygon.next) return;
            root.exit();
            switchScene(3);
        }

        function onLineClick() {
            previousPolygon.children = polygonBoard.children;
            previousPolygon.setAlphaOfAll(0.04);

            data.prePolygon.push(copyLinkList(data.runtimePolygon));

            if (data.ifInit) { //首次点击删除一条线
                data.runtimePolygon = this.node.next;
                this.node.next.prior = null;
                this.node.next = null;
                data.ifInit = false;
            } else { //有line存在表示this.node.next不为空
                if (!this.node.prior) {
                    data.runtimePolygon = this.node.next;
                    this.node.next.prior = null;
                    this.node.next.value = countNodeValue(this.node);
                    this.node.next.UI.value.text = this.node.next.value;
                    this.node = null;
                }else { //判定当前点关于当前线的下个节点是否为端点
                    if(!this.node.next.next) {
                        this.node.value = countNodeValue(this.node);
                        this.node.UI.value.text = this.node.value;
                        this.node.next = null;
                    } else {
                        this.node.next.value = countNodeValue(this.node);
                        this.node.next.prior = this.node.prior;
                        this.node.prior.next = this.node.next;
                        this.node = null;
                    }
                }
            }

            //当多边形只剩下一个节点时，录入最高分数
            if (!data.runtimePolygon.next && !data.runtimePolygon.prior) {
                data.score = data.runtimePolygon.value;
            }

            polygonBoard = generatePolygon(data.edgeNum, {
                type: {
                    t: ['click', 'touchend'],
                    e: onLineClick
                }
            });
            polygonPane.addChild(polygonBoard);
        }

        function onUndoBtnClick() {
            if (data.ifInit) return;
            data.score = -1;
            data.runtimePolygon = data.prePolygon.pop();
            if (data.runtimePolygon.prior) data.ifInit = true;
            polygonBoard = generatePolygon(data.edgeNum, {
                type: {
                    t: ['click', 'touchend'],
                    e: onLineClick
                }
            });
            polygonPane.removeChildren(0, polygonPane.children.length);
            polygonPane.addChild(polygonBoard);
        }

        function onMenuBtnClick() {
            data.runtimePolygon = null;
            data.edgeNum = 3;
            init();
            switchScene(0);
            polygonPane.removeChildren(0, polygonPane.children.length);
        }

        function onRestartBtnClick() {
            if (data.ifInit) return; //还没开始就想重新开始？ 不存在的
            data.ifRandom = false;  //防止value-type等值随机刷新
            root.exit();
            root.load();
        }

        return root;
    }();

    // 游戏计分场景
    let resultScene = function () {
        let scorePane,
            maxScoreBtn,
            restartBtn,
            menuBtn,
            btnGroup,
            background,
            scoreGround,
            scoreTxt,
            starGroup,
            starNum,
            maxScore,
            bestPath,
            polygonBoard,
            polygonPane,
            nextStepBtn;
        let root = new Container();

        function onMenuBtnClick() {
            init();
            switchScene(0);
            root.exit();
        }

        function onMaxSoreBtnClick () {
            scorePane.vy = 3;
            polygonBoard.visible = true;
            nextStepBtn.visible = true;
            app.ticker.add(showBestResultAnim);
        }

        function onRestartBtnClick () {
            data.runtimePolygon = null;
            data.ifRandom = false;
            root.exit();
            switchScene(2);
        }

        function onNextStepBtnClick () {

            if (bestPath.length === 0) return;

            data.ifRandom = false;
            if (data.edgeNum === bestPath.length) {
                presentFirstStep(bestPath.shift());
                updatePolygon();
            } else {
                let p = bestPath.shift();
                present(p);
                updatePolygon();
            }

        }
        function present (p) {
            let flag = (p === data.runtimePolygon); // 判断当前节点是否为头节点
            if (!p.next) { //当前点为最末端点
                data.runtimePolygon = findPriorEndPoint(p); // 往前找到端点，设为头节点
                p.prior.next = null;
                p.prior.value = countNodeValue2(p);
                p.prior.UI.value.text = p.prior.value;
                p = null;
            }else {
                if(!p.prior.prior) { //当前点的上一个点为端点时
                    data.runtimePolygon = p;
                    p.value = countNodeValue2(p);
                    p.UI.value.text = p.value;
                    p.prior = null;
                } else {
                    p.prior.value = countNodeValue2(p);
                    p.prior.nextOperation = p.nextOperation;
                    p.prior.next = p.next;
                    p.next.prior = p.prior;
                    p = null;
                }
            }
        }

        function presentFirstStep (p) {
            // data.runtimePolygon = p.next;
            // p.next.prior = null;
            // p.next = null;
            data.runtimePolygon = p;
            p.prior.next = null;
            p.prior = null;
        }

        function showBestResultAnim () {
            if ( scorePane.y < 800) {
                scorePane.scale.x -= 0.03;
                scorePane.scale.y -= 0.05;
                background.alpha -= 0.01;
                scorePane.vy += 0.5;
                scorePane.y += scorePane.vy;
                starGroup.alpha -= 0.02;
                menuBtn.style.fill -= 100;
                restartBtn.style.fill -= 100;
            } else if (background.alpha > 0) {
                starGroup.alpha -= 0.02;
                background.alpha -= 0.02;
            } else {
                app.ticker.remove(showBestResultAnim);
                maxScoreBtn.visible = false;
            }
        }

        function updatePolygon () {
            if (polygonBoard) polygonPane.removeChild(polygonBoard);
            polygonBoard = generatePolygon(data.edgeNum, null);
            polygonBoard.position.set( POLYGON_RADIUS + 20, app.screen.height / 2);
            polygonPane.addChild(polygonBoard);
        }

        //显示最终得分的动画，在达到一定阈值后
        function anim (delta) {
            if (background.scale.x < 8) {
                background.rotation += 0.01;
                background.scale.x *= 1.1;
                background.scale.y *= 1.1;
            } else {
                if (scorePane.scale.x < 2) {
                    background.rotation += 0.01;
                    background.scale.x *= 1.1;
                    background.scale.y *= 1.1;

                    scoreGround.alpha += 0.1;
                    scorePane.scale.x *= 1.1;
                    scorePane.scale.y *= 1.1;
                }
            }
            if (scorePane.scale.x >= 2)  {
                app.ticker.remove(anim);
                app.ticker.addOnce(delayShowStars);
            }

            function delayShowStars () {
                for (let i = 0; i < starNum; i++) {
                    (function (i) {
                        setTimeout(function () {
                            starGroup.children[i].visible = true;
                            starGroup.pivot.x = starGroup.width / 2;
                        }, 500 * i);
                    }) (i);
                }
            }
        }

        root.init = function () {
            starGroup = new Container();
            starGroup.position.set(app.screen.width / 2, 500);
            // starGroup.pivot.set(starGroup.width, starGroup.height);
            for (let i = 0; i < 3; i++) {
                let star = new Sprite(loader.resources["assets/img/star_fill.svg"].texture);
                star.x = i * star.width * 1.5;
                star.visible = false;
                starGroup.addChild(star);
            }

            maxScoreBtn = new Text('Max Score: XXX', {fill: 0xffffff});
            maxScoreBtn.y = maxScoreBtn.height;
            maxScoreBtn.buttonMode = true;
            maxScoreBtn.interactive = true;
            maxScoreBtn.subscribe(['click', 'touchend'], onMaxSoreBtnClick);

            restartBtn = new Text('Replay', {fill: 0xffffff});
            restartBtn.y = maxScoreBtn.height * 2;
            restartBtn.buttonMode = true;
            restartBtn.interactive = true;
            restartBtn.subscribe(['click', 'touchend'], onRestartBtnClick);

            menuBtn = new Text('Menu', {fill: 0xffffff});
            menuBtn.y = menuBtn.height * 3;
            menuBtn.buttonMode = true;
            menuBtn.interactive = true;
            menuBtn.subscribe(['click', 'touchend'], onMenuBtnClick);

            btnGroup = new Container();
            btnGroup.addChild(maxScoreBtn);
            btnGroup.addChild(restartBtn);
            btnGroup.addChild(menuBtn);

            nextStepBtn = new Sprite(loader.resources["assets/img/arrow-right.png"].texture);
            nextStepBtn.scale.set(2, 2);
            nextStepBtn.buttonMode = true;
            nextStepBtn.interactive = true;
            nextStepBtn.x = app.screen.width - nextStepBtn.width;
            nextStepBtn.y = (app.screen.height - nextStepBtn.height) / 2;
            nextStepBtn.visible = false;
            nextStepBtn.subscribe(['click', 'touchend'], onNextStepBtnClick);

            background = new Graphics();
            background.beginFill(0x000000);
            background.drawRect(0, 0, 100, 100);
            background.endFill();
            background.pivot.set(background.width / 2, background.height / 2);
            background.position.set(app.screen.width / 2, app.screen.height / 2);

            scoreGround = new Graphics();
            scoreGround.lineStyle(8, 0x000000, 1);
            scoreGround.beginFill(0xffffff);
            scoreGround.drawCircle(0, 0, 60);
            scoreGround.endFill();
            scoreGround.alpha = 0;

            scoreTxt = new Text(data.score, {fontSize: 50});
            scoreTxt.anchor.set(0.5, 0.5);

            scorePane = new Container();
            scorePane.addChild(scoreGround);
            scorePane.addChild(scoreTxt);
            // 这里不能像处理background那样设置pivot，它本身的pivot就在其中心。
            // scorePane.pivot.set(scorePane.width / 2, scorePane.height / 2);
            scorePane.position.set(app.screen.width / 2, app.screen.height / 2);
            scorePane.scale.set(0.5, 0.5);

            //最佳方案动画演示区
            polygonPane = new Container();
            polygonPane.x = 100;

            this.addChild(nextStepBtn);
            this.addChild(polygonPane);
            this.addChild(background);
            this.addChild(scorePane);
            btnGroup.position.set(800, 400);
            this.addChild(btnGroup);
            this.addChild(starGroup);
        };

        root.load = function () {
            if (polygonBoard) polygonPane.removeChild(polygonBoard);
            data.ifRandom = false;
            updatePolygon();
            polygonBoard.visible = false;

            let result = getMaxValue(data.VT);
            maxScore = result.score;
            // TODO
            bestPath = convertPath(result.path, data.runtimePolygon) ;
            testNode.path = result.path;
            testNode.bestPath = bestPath;

            maxScoreBtn.text = 'Max Score: ' + maxScore;
            // 更新星星
            starNum = countStarsNum(data.score , maxScore);

            if(data.ifInvented) {
                data.starArr[data.edgeNum - 3] = starNum;
                localStorage.setItem('starArr', JSON.stringify(data.starArr));
            }
            starGroup.pivot.x = starGroup.width / 2;

            // 更新当前得分
            scoreTxt.text = data.score;

            // 先将动画元素复位
            background.scale.set(1, 1);
            scoreGround.alpha = 0;
            scorePane.scale.set(0.5, 0.5);

            app.ticker.add(anim);

        };

        root.exit = function () {
            menuBtn.style.fill = 0xffffff;
            restartBtn.style.fill = 0xffffff;
            maxScoreBtn.visible = true;
            nextStepBtn.visible = false;

            polygonBoard.visible = false;
            scorePane.y = app.screen.height / 2;
            scorePane.scale.set(0.5, 0.5);
            background.alpha = 1;
            starGroup.alpha = 1;
            // 星星复位
            for (let i = 0; i < starGroup.children.length; i++) {
                starGroup.children[i].visible = false;
            }
        };

        return root;
    }();

    // 游戏闯关场景
    let inventedScene = function () {
        let domContainer = document.getElementById('invented-scene');
        let root = new Container();

        root.init = function () {
            if (localStorage.getItem('starArr')) data.starArr = JSON.parse(localStorage.getItem('starArr'));
        };

        root.load = function () {
            domContainer.style.zIndex = 1002;

            if (localStorage.getItem('starArr')) data.starArr = JSON.parse(localStorage.getItem('starArr'));
            let flag = false;

            for (let i = 0; i < POLYGONPATH.length; i++) {
                // -1表示没有挑战过，未挑战或零星的关卡后的所有关卡均lock
                if (data.starArr[i] === undefined) data.starArr[i] = -1;

                let card = new Card( i + 3,  data.starArr[i], function () {
                    onCardClick(i);
                });

                if(flag) card.disabled();

                domContainer.appendChild(card.view);

                flag = (data.starArr[i] <= 0);
            }
        };

        root.exit = function () {
            domContainer.style.zIndex = 1000;
            //TODO 更新方式优化
            domContainer.innerHTML = "";
        };

        function onCardClick (i) {
            data.edgeNum = i + 3;
            data.VT = POLYGONPATH[i];
            root.exit();
            switchScene(2);
        }

        return root;
    } ();

    function init() {
        data = {
            runtimePolygon: null,
            prePolygon: [],
            edgeNum: data.edgeNum,
            ifInit: true, //标识是否刚开始游戏,
            score: -1
        }
    }

    function switchScene (serial) {
        app.stage.monoChildren(serial);
        app.stage.children[serial].load();
    }

    function generatePolygon(edgeNum, events) {
        if (edgeNum < 3) return null;
        if (!data.VT) return null;

        //TODO 这段逻辑要移除
        if (!data.runtimePolygon)
            data.runtimePolygon = generateLinkList(edgeNum - 3, data.VT);

        let p = data.runtimePolygon;
        // data.VT = getVT(p);

        let polygon = new Container();
        //pixi.js没有提供直接设置z-index

        for (let i = 0; i < edgeNum; i++) {
            //generate lines and install click function
            let tempCircle = new Graphics();
            tempCircle.lineStyle(8, 0x000000, 1);
            tempCircle.beginFill(0xffffff);
            tempCircle.drawCircle(p.x, p.y, 30);
            tempCircle.endFill();
            tempCircle.buttonMode = true;
            tempCircle.interactive = true;
            tempCircle.node = p;

            let tempValue = new Text(p.value, {fill: 'black'});
            tempValue.anchor.set(0.5, 0.5);
            tempValue.position.set(p.x, p.y);

            if (p.next) {
                let tempLine = new Graphics();
                tempLine.lineStyle(POLYGON_LINE_WIDTH, POLYGON_LINE_COLOR, 1);
                tempLine.moveTo(p.x, p.y);
                tempLine.lineTo(p.next.x, p.next.y);

                let tempType = new Text(p.nextOperation, {fontSize: 50, fill: 'red'});
                tempType.position.set((p.x + p.next.x - tempType.width ) / 2, (p.y + p.next.y - tempType.height) / 2);
                tempType.buttonMode = true;
                tempType.interactive = true;
                tempType.node = p;

                if (events) tempType.subscribe(events.type.t, events.type.e);

                p.UI = {
                    line: tempLine,
                    circle: tempCircle,
                    type: tempType,
                    value: tempValue
                };

                tempValue.zIndex = 3;
                tempCircle.zIndex = 2;
                tempType.zIndex = 1;
                tempLine.zIndex = 0;
                polygon.addChild(tempLine);
                polygon.addChild(tempCircle);
                polygon.addChild(tempType);
                polygon.addChild(tempValue);
                p = p.next;
            } else {
                p.UI = {
                    circle: tempCircle,
                    value: tempValue
                };
                tempValue.zIndex = 3;
                tempCircle.zIndex = 2;
                polygon.addChild(tempCircle);
                polygon.addChild(tempValue);
                break;
            }
        }

        polygon.sortChildren();

        return polygon;
    }

    (function () {
        startScene.init();
        customGameScene.init();
        playScene.init();
        resultScene.init();
        inventedScene.init();

        app.stage.addChild(startScene);
        app.stage.addChild(customGameScene);
        app.stage.addChild(playScene);
        app.stage.addChild(resultScene);
        app.stage.addChild(inventedScene);
        app.stage.monoChildren(0);
        // app.stage.addChild(star);
    })();
}