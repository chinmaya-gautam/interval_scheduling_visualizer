//var data = [[0,100],[100,500],[200,300],[500,1000]];
var data = [[722, 1669], [217, 806], [453, 776], [5, 936], [123, 400], [369, 574], [270, 597], [618, 1614], [288, 1125], [715, 1575]];

// Global Vars
var border = 1;
var bordercolor = "black";
var rectHeight = 20;

var defaultData = data.map(function(arr) {
    return arr.slice();
});



var processData = function(){
        /*return array of objects*/
    var dataObj = [];
    for (var i = 0; i<data.length; i ++){
        dataObj[i] = {
            start:data[i][0],
            end:data[i][1],
            id:"id_"+i,
            xpos:data[i][0],
            ypos:i*rectHeight + i,
            width:data[i][1] - data[i][0],
            overlapping:(function(){
                var overlapping_nodes = [];
                for (var j = 0; j<data.length; j++){
                    if (i == j){continue}
                    else if ((data[i][0]<data[j][0] && data[j][0]<data[i][1]) || 
                             (data[i][0]<data[j][1] && data[j][1]<data[i][1]) ||
                             (data[i][0]>=data[j][0] && data[i][1]<=data[j][1])){
                         overlapping_nodes.push("id_"+j);
                    }
                }
                return overlapping_nodes;
            })()
        }
    }

    //console.log(dataObj);

    return dataObj;
};

var handleMouseOver = function(obj){
    d3.select(this).attr("fill", "orange");
    for (var i = 0; i<obj.overlapping.length; i++){
        d3.select("#"+obj.overlapping[i]).attr("fill", "orange");
    }
};

var handleMouseOut = function(obj){
    d3.selectAll("rect").attr("fill", "black");
};

var addData = function(){
    dataObj = processData();
    var rescale = d3.scaleLinear()
        .domain([0, d3.max(dataObj, function(d){return d['end'] - d['start'];})])
        .range([0, d3.min([500, d3.max(dataObj, function(d){return d['end'];})])]);

    rescaled_max_X= rescale(d3.max(dataObj, function(d){return d['end'];}));
    var xscale = d3.scaleLinear().domain([0,d3.max(dataObj, function(d){return d['end'];})]).range([0,rescaled_max_X]);
    var axis = d3.axisBottom(xscale);


    var svg = d3.select("body")
        .append("svg")
        .attr("width", rescaled_max_X + 50)
        .attr("height", (rectHeight + 10) * dataObj.length)
        .attr("transform", "translate(20,20)");
        
    var container = svg.append("g")
        .attr("class", "container")
        .attr("transform", "translate(20,20)");

    var g = container.selectAll("g")
        .data(dataObj)
        .enter()
        .append("g")

    g.append("rect")
    g.append("text")

    g.selectAll("rect")
        .attr("x", function(d){return rescale(d['xpos']);})
        .attr("y", function(d){return d['ypos'];})
        .attr("height", rectHeight)
        .attr("width", function(d){return rescale(d['width']);})
        .attr("fill", "black")
        .attr("id", function(d){return d['id'];})
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    g.selectAll("text")
        .attr("x",function(d){return rescale(d['xpos'] + 5);})
        .attr("y", function(d){return d['ypos'] + 15})
        .attr("fill", "crimson")
        .attr("font-size", "12")
        .attr("font-weight", "bold")
        .text(function(d){return "("+d['start'] +","+d['end']+")"});
        ;   

    axis = container.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + ((rectHeight + 1) * dataObj.length) +")")
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

var randInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
var randomData = function(){
    var number_of_data = randInt(3, 20);
    var arr = [];
    var s;
    for (var i = 0; i<number_of_data; i++){
        s = randInt(0,1000);
        arr.push([s, s+randInt(0, 1000)]); 
    }

    data = arr.map(function(arr) {
        return arr.slice();
    });
    defaultData = arr.map(function(arr) {
        return arr.slice();
    });
    updateChart();

}