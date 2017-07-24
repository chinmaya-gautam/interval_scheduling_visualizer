//var data = [[0,100],[100,500],[200,300],[500,1000]];
var data = [[722, 1669], [217, 806], [453, 776], [5, 936], [123, 400], [369, 574], [270, 597], [618, 1614], [288, 1125], [715, 1575]];

// Global Vars
var border = 1;
var bordercolor = "black";
var rectHeight = 20;



var defaultData = data.map(function(arr) {
    return arr.slice();
});

var rectPos = (function(d){
        ret = [];
        for (var i = 0; i < data.length; i++){
            ret.push([d[i], i*rectHeight + i]);
        }
        return ret;
    })(data);

var addData = function(){
    var rectPos = (function(d){
        ret = [];
        for (var i = 0; i < data.length; i++){
            ret.push([d[i], i*rectHeight + i]);
        }
        return ret;
    })(data);

    var rescale = d3.scaleLinear()
        .domain([0, d3.max(data, function(d){return d[1] - d[0];})])
        .range([0, d3.min([500, d3.max(data, function(d){return d[1];})])]);

    rescaled_max_X= rescale(d3.max(data, function(d){return d[1];}));
    var xscale = d3.scaleLinear().domain([0,d3.max(data, function(d){return d[1];})]).range([0,rescaled_max_X]);
    var axis = d3.axisBottom(xscale);


    var svg = d3.select("body")
        .append("svg")
        .attr("width", rescaled_max_X + 50)
        .attr("height", (rectHeight + 10) * data.length)
        .attr("transform", "translate(20,20)");
        
    var container = svg.append("g")
        .attr("class", "container")
        .attr("transform", "translate(20,20)");

    var g = container.selectAll("g")
        .data(rectPos)
        .enter()
        .append("g")

    g.append("rect")
    g.append("text")

    g.selectAll("rect")
        .attr("x", function(d){return rescale(d[0][0]);})
        .attr("y", function(d){ console.log(d); return d[1];})
        .attr("height", rectHeight)
        .attr("width", function(d){return rescale(d[0][1] - d[0][0]);})
        .attr("fill", "black");

    g.selectAll("text")
        .attr("x",function(d){return rescale(d[0][0] + 5);})
        .attr("y", function(d, i){return d[1] + 15})
        .attr("fill", "snow")
        .attr("font-size", "12")
        .text(function(d){return "("+d[0][0] +","+d[0][1]+")"});
        ;   

    axis = container.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + ((rectHeight + 1) * data.length) +")")
        .call(axis);


};


var clear = function(){
    d3.select("body").selectAll("svg").data([]).exit().remove();
}
var updateChart = function(){
    clear();
    addData();
};
var sortByStart = function(){
    data = data.sort(function(a,b){return a[0] - b[0];});
    updateChart();
};
var sortByEnd = function(){
    data = data.sort(function(a,b){return a[1] - b[1];});
    updateChart();
    
};
var sortByDefault = function(){
    data = defaultData.map(function(arr) {
        return arr.slice();
    });
    updateChart();
};

addData();

var loadData = function(){
    s = d3.select("body").select("#dataForm").select("#userData").property("value").trim();
    s = s.slice(1,s.length-1).trim();
    i = 0;
    j = 0;
    arr = [];
    while(i < s.length-1){
        while (i < s.length && s[i] != '['){i++;}
        j = i;
        while (i < s.length && s[i] != ']'){i++;}
        p = s.slice(j+1, i);
        arr.push(p.split(',').map(Number))
        //alert(arr[arr.length - 1]);
    }
    data = arr.map(function(arr) {
        return arr.slice();
    });
    defaultData = arr.map(function(arr) {
        return arr.slice();
    });
    updateChart();
}