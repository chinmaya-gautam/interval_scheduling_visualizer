var data = [[21,272],[121,377],[133,396],[198,361],[242,567],[325,461],[362,710],[370,719],[405,549],[465,842],[619,791],[645,769],[669,781],[837,1030],[867,1022],[878,1086],[896,1156],[903,1120],[960,1127]]
// Global Vars
var border = 1;
var bordercolor = "black";
var rectHeight = 20;
var axis;

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
            color:"black",
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


    return dataObj;
};

var handleMouseOver = function(obj){
    d3.select(this).attr("fill", "orange");
    for (var i = 0; i<obj.overlapping.length; i++){
        d3.select("#"+obj.overlapping[i]).attr("fill", "orange");
    }
};

var handleMouseOut = function(obj){
    d3.selectAll("rect").attr("fill", function(d){return d.color;});
};

var addData = function(){
    var rescale = d3.scaleLinear()
        .domain([0, d3.max(dataObj, function(d){return d['end'] - d['start'];})])
        .range([0, d3.min([300, d3.max(dataObj, function(d){return d['end'];})])]);

    rescaled_max_X= rescale(d3.max(dataObj, function(d){return d['end'];}));
    var xscale = d3.scaleLinear().domain([0,d3.max(dataObj, function(d){return d['end'];})]).range([0,rescaled_max_X]);
   
    axis = d3.axisBottom(xscale);


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
        .attr("fill", function(d){return d['color'];})
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
    dataObj=processData();
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
dataObj=processData();
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
    d3.select("#rad_0").property("checked", "True");
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
        arr.push([s, s+randInt(100, 400)]); 
    }

    data = arr.map(function(arr) {
        return arr.slice();
    });
    defaultData = arr.map(function(arr) {
        return arr.slice();
    });
    d3.select("#rad_0").property("checked", "True");
    updateChart();
}


var PQueue = function(){
    this.data = [];
    this.push = function(data, priority){
        this.data.push([data, priority]);
        if (this.length() > 1){
            var idx = this.length() - 1;
            while (idx > 0){
                parent = Math.floor((idx-1)/2);
            
                if (this.data[idx][1] < this.data[parent][1]){
            var temp = this.data[idx];
            this.data[idx] = this.data[parent];
            this.data[parent] = temp;
            idx = parent;
            }else{
                break;
            }
            }
        } 
    };

    this.pop = function(){
        if (this.isEmpty()){
            return null;
        }else{
            returnData = this.data[0];
        this.data[0] = this.data[this.length() - 1]
        this.data.pop();
        idx = 0;
        while (idx < this.length()){
                    var lchild = 2*idx + 1;
            var rchild = lchild + 1;
            var swap = lchild;
            
            if (rchild < this.length()){
                if (this.data[rchild][1] < this.data[lchild][1]){
                swap = rchild;
            }
            }
            
            if (lchild < this.length()){
                if (this.data[swap][1] < this.data[idx][1]){
                var temp = this.data[idx];
                this.data[idx] = this.data[swap];
                this.data[swap] = temp;
                idx = swap;
                continue;
            }else{
                break;
            }
            }else{
                break
            }
        }
    }
    return returnData;
  };
  
  
    this.peek = function(){return this.data[0];}
    this.isEmpty = function(){return this.data.length==0;};
    this.length = function(){return this.data.length};

};

var intervalPartition = function(){
    sortByStart(); //updates chart and populated dataObj

    var colors = ["Aqua", "Yellow", "Silver", "YellowGreen", "Blue", "Chartreuse", "Navy", "Lime", "Wheat", "Turquoise"];
        //If there are more categories, we will randomly generate colors

    var Pq = new PQueue;
    Pq.push('0', dataObj[0]['end']);
    var groups = [[dataObj[0]]];
    var depth = 0;
    dataObj[0].ypos = depth*rectHeight + depth;
    dataObj[0].color = colors[0];

    for (var i = 1; i<dataObj.length; i++){

        if (Pq.peek()[1] <= dataObj[i].start){
            //compatible
            dataObj[i].ypos = groups[+Pq.peek()[0]][0].ypos;
            dataObj[i].color = groups[+Pq.peek()[0]][0].color;
            groups[+Pq.peek()[0]].push(dataObj[i])
            temp = Pq.pop();
            temp[1] = dataObj[i].end;
            Pq.push(temp[0], temp[1]);
        }else{
            //incompatible
            depth += 1;
            dataObj[i].ypos = depth * rectHeight + depth;
            dataObj[i].color = depth < 10?colors[depth]:randInt(0,255);
            groups[depth] = [dataObj[i]]
            Pq.push(depth+"", dataObj[i].end);  
        }        
    }
    collapsed_chart(groups);
    return groups;

};


var intervalSchedule = function(){
    //alert("not yet implemented!!");
    sortByEnd();
    var groups = [[dataObj[0]]];
    dataObj[0].color="lightgreen";
    var counter = 0;
    for (var i = 1; i<dataObj.length; i++){
        if (dataObj[i].start >= groups[0][groups[0].length -1].end){
            dataObj[i].ypos = 0;
            dataObj[i].color = "lightgreen";
            groups[0].push(dataObj[i]);
        }else{
            counter += 1
            dataObj[i].ypos = counter * rectHeight + counter;
            dataObj[i].color = "grey";
            groups.push([[dataObj[i]]]);
        }
    }
    collapsed_chart(groups);
}

var collapsed_chart = function(groups){
    clear();
    addData();
    d3.select("svg").attr("height", (rectHeight + 10) * groups.length);

    d3.selectAll("rect")
        .attr("y", function(d){return d['ypos'];});
    d3.selectAll("text")
        .attr("y", function(d){return d['ypos'] + 15});   


   var rescale = d3.scaleLinear()
        .domain([0, d3.max(dataObj, function(d){return d['end'] - d['start'];})])
        .range([0, d3.min([300, d3.max(dataObj, function(d){return d['end'];})])]);

   var rescaled_max_X= rescale(d3.max(dataObj, function(d){return d['end'];}));
   var xscale = d3.scaleLinear().domain([0,d3.max(dataObj, function(d){return d['end'];})]).range([0,rescaled_max_X]);
   
   var axis = d3.axisBottom(xscale);
   d3.select(".x-axis").attr("transform", "translate(0," + ((rectHeight + 2) * groups.length) +")").call(axis);

}