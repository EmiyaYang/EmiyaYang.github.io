(function () {

    let barGraph = d3.select('#bar-graph');
    let svg = barGraph.append('svg');

    let dataset = [0.3,0.9,1,2,2.5];

    //构造一个线性比例尺，domain，range分别为其定义域与值域
    let linear = d3
        .scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([0, 300]);

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', function (d, i) {
            return 20
        })
        .attr('y', function (d, i) {
            return 20 * i;
        })
        .attr('width', function (d, i) {
//            return 50 * d;
            return linear(d);
        })
        .attr('height', function (d, i) {
            return 15;
        })
        .attr('fill', 'blue');

    //添加坐标轴
    let axis = d3.axisBottom()
        .scale(linear)  //指定比例尺
        .ticks(5);      //设置刻度数

    svg.append('g')
        .attr('transform', 'translate(20, 125)')
        .call(axis);

}) ();


(function () {

    let barGraph = d3.select('#bar-graph-horizon');
    let svg = barGraph.append('svg');

    let dataset = [0.3,0.9,1,2,2.5];

    //构造一个线性比例尺，domain，range分别为其定义域与值域
    let linear = d3
        .scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([0, 300]);

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', function (d, i) {
            return 20
        })
        .attr('y', function (d, i) {
            return 20 * i;
        })
        .attr('width', function (d, i) {
//            return 50 * d;
            return linear(d);
        })
        .attr('height', function (d, i) {
            return 15;
        })
        .attr('fill', 'blue');

    //添加坐标轴
    let axis = d3.axisBottom()
        .scale(linear)  //指定比例尺
        .ticks(5);      //设置刻度数

    svg.append('g')
        .attr('transform', 'translate(20, 125)')
        .call(axis);

}) ();


(function () {
    let container = d3.select('#bar-graph-vertical');
    let svg = container
        .append('svg')
        .attr('width', 500)
        .attr('height', 500);

    let dataset = [10, 20, 30, 40, 33, 24, 12, 5];

    //设置比例尺
    let linearX = d3
        .scaleLinear()
        .domain([0, dataset.length])  //根据数据个数对坐标轴x进行切分
        .range([0, 400]);

    let linearY = d3
        .scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([400, 0]);

    let axisX = d3
        .axisBottom()
        .scale(linearX)
        .ticks(dataset.length);

    let axisY = d3
        .axisLeft()
        .scale(linearY)
        .ticks(dataset.length);

    let gapY = 80; //svg的原点坐标在最左上角，故而需要预留点位置
    let gapX = 30;

    svg.append('g')
        .attr('transform','translate(' + gapX + ',' + gapY +')')
        .call(axisY);
    svg.append('g')
        .attr('transform','translate(' + gapX + ',' + (400 + gapY) +')')
        .call(axisX);

    let rectWidth  = 20;

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', function (d, i) {
            return linearX(i + 1) + gapX - rectWidth / 2;  //这样处理是为了让矩形位于坐标轴的各点的中心
        })
        .attr('y', function (d, i) {
            return linearY(d) + gapY;
        })
        .attr('width', rectWidth)
        .attr('height', function (d, i) { //为了保证矩形的底部持平
            return 400 - linearY(d);
        })
        .attr('fill', 'blue');
})();
