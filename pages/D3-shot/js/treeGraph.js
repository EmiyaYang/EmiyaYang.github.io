(function() {

    let width = 500;
    let height = 500;

    //定义布局范围
    let treeWidth = width-50;
    let treeHeight = height-80;
//定义D3树布局范围
    let tree = d3.tree()
        .size([treeHeight, treeWidth-100])//注意D3布局跟svg坐标系无关,size(高，宽)
        .separation(function(a, b) { //设置相隔节点的间距，a、b节点相隔
            return (a.parent === b.parent ? 1 : 2);
        });

//定义连线生成器
//     let diagonal = d3.svg.diagonal()
//         .projection(function(d) { return [d.y, d.x]; });//设置连线点的变换器


//绘制svg图形
    let svg = d3.select("#tree-graph").append("svg")
        .attr("width", treeWidth)
        .attr("height", treeHeight)
        .append("g")
        .attr("transform", "translate(40,0)");//定义偏移量

    //加载数据
    d3.hierarchy("data/treeSample.json", function(error, root) {
        let nodes = tree(root);
        let links = tree.links(nodes);  //获取节点的连线信息集合

        //绘制连线
        let link = svg.selectAll(".link")
            .data(links)
            .enter()
            .append("path")
            .attr("class", "link");
            // .attr("d", diagonal);

        //绘制节点
        let node = svg.selectAll(".node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

        //添加节点图标
        node.append("circle")
            .attr("r", 4.5);

        //添加节点显示文本
        node.append("text")
            .attr("dx", function(d) { return d.children ? -8 : 8; })//定义文本显示x轴偏移量
            .attr("dy", 3)//定义文本显示y轴偏移量
            .style("text-anchor", function(d) { return d.children ? "end" : "start"; })//文字对齐显示
            .text(function(d) { return d.name; });
    });

})();