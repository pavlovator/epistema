<template>
  <div>
    <h1>Insertion Sort</h1>
    <p>{{ arr }}</p>
    <vue3-slider 
      v-model="sliderValue"
      @dragging="sliderDragging()"
      tooltipText='%v'
      color="black"
      track-color="grey" tooltip width="300px" height="15" :min="0" :max="maxNoNumbers" :step="1" />
    <div class="input-manual">
        <input type="text" 
          placeholder="Enter spaced integers from 0 to 20" 
          v-model="arrayString" 
          @input="inputTextChanged()" 
          style="width:500px">
    </div>
    <button @click="insertionSort()">Sort</button>
    <button @click="randomArr()">Randomize</button>
    <button @click="shuffleArr()">Shuffle</button>

    <Toggle v-model="toggleValue" class="toggle-mode" 
      onLabel="Arr"
      offLabel="Col"
      @change="toggleSwitched()"/>
    <svg class="svg"></svg>
    <pre>
    <code>
    <div class="lines" id="line1">1  for i = 1 to A.length</div>
    <div class="lines" id="line2">2    key = A[i]</div>
    <div class="lines" id="line3">3    j = i - 1</div>
    <div class="lines" id="line4">4    while j >= 0 and A[j] > key</div>
    <div class="lines" id="line5">5      A[j+1] = A[j]</div>
    <div class="lines" id="line6">6      j = j - 1</div>
    <div class="lines" id="line7">7    A[j+1] = key</div>
    </code>
    </pre> 
  </div>
</template>

<script>
import * as d3 from 'd3';
import slider from "vue3-slider"
import Toggle from '@vueform/toggle'

export default {
  name: 'InsertionSort',
  components: {
    "vue3-slider": slider,
    Toggle
  },
  data() {
    return {
      width: 800,
      height: 300,
      maxArrCell: 90,
      arr: [3,2,1],
      rectangles: null,
      sliderValue: 3,
      arrayString: "3 2 1",
      maxNoNumbers: 32,
      toggleValue: true,
      sortHistory: [],
      sortedArr: []
    };
  },
  methods: {
    toggleSwitched(){
      this.refreshChart();
    },
    validateTextInput(){
      // Replace multiple spaces with a single space
      this.arrayString = this.arrayString.replace(/\s+/g, " ");
      
      // Replace consecutive numeric characters greater than two digits with their first two digits
      this.arrayString = this.arrayString.replace(/(\d{3,})/g, (match, digits) => {
        return digits.slice(0, 2);
      });

      // Remove any non-numeric characters, except allowed characters, from the input value
      this.arrayString = this.arrayString.replace(/[^0-9\s-]/g, "");

      // Remove spaces after "-"
      this.arrayString = this.arrayString.replace(/-\s/g, "-");
      
      // Remove consecutive "-" characters
      this.arrayString = this.arrayString.replace(/--+/g, "-");

      // Remove consecutive "0" characters
      this.arrayString = this.arrayString.replace(/00+/g, "0");

      let parts = this.arrayString.split(" ");
      this.arrayString = parts.slice(0, this.maxNoNumbers).join(" ");
    },
    inputTextChanged(){
      this.validateTextInput();
      this.arr = [];
      const input_arr = this.arrayString.split(" ");
      for (let i=0; i<input_arr.length; i++){
        const num_element = parseInt(input_arr[i]);
        if (!isNaN(num_element)){
          this.arr.push(num_element);
        }
      }
      this.refreshChart();
      this.sliderValue = this.arr.length;
    },
    getArrayString(){
      return this.arr.join(" ");
    },
    sliderDragging(){
      this.arrayString = this.getArrayString();
      const diff = this.sliderValue - this.arr.length ;
      if (diff < 0){
        this.arr.splice(diff);
      } else if (diff > 0){
        for (let i=0; i<diff; i++){
          this.arr.push(Math.floor(Math.random() * 100));
        }
      }
      this.sliderValue = this.arr.length;
      this.refreshChart()
    },
    insertionSort(){
      this.sortedArr = [...this.arr];
      this.sortHistory = [];
      for (let i=1; i<this.sortedArr.length; i++){ //1
        this.sortHistory.push([1, i]);
        let key = this.sortedArr[i]; //2
        this.sortHistory.push([2, i]);
        let j = i-1; //3
        this.sortHistory.push([3, j])
        while (j >= 0 && this.sortedArr[j] > key){ //4
          this.sortHistory.push([4, j>=0 && this.sortedArr[j] > key]);
          this.sortedArr[j+1] = this.sortedArr[j]; //5
          this.sortHistory.push([5, j]);
          j = j-1; //6
          this.sortHistory.push([6, j]);
        }
        this.sortedArr[j+1] = key; //7
        this.sortHistory.push([7, j+1, key]);
      }
      //this.arrayString = this.getArrayString();      
      //this.refreshChart();
      this.animateInsertionSort();
    },
    animateLineOne(currentStep){
      const i = currentStep[1];
      if (i == 1){
        d3.select("#index_i")
          .text("i="+i)
          .attr("transform", "translate(" + (this.getTranslateValues("#rect" +i, 0) + this.getSquareSize()/2) + ',' 
                                          + (this.getTranslateValues("#rect" +i, 1) + 4*this.getSquareSize()/3) +')');
      } else {
        d3.select("#index_i")
          .transition()
          .duration(1000)
          .text("i="+i)
          .attr("transform", "translate(" + (this.getTranslateValues("#rect" +i, 0) + this.getSquareSize()/2) + ',' 
                                          + (this.getTranslateValues("#rect" +i, 1) + 4*this.getSquareSize()/3) +')');
      }
    },
    animateLineTwo(currentStep){
      const i = currentStep[1];
      d3.select("#assignText")
        .text(this.arr[i])
        .attr("transform", "translate(" + ( parseFloat(d3.select('#arrayCellText' + i).attr('x')) + this.getTranslateValues("#rect" +i, 0) ) + ',' 
                                        + ( parseFloat(d3.select('#arrayCellText' + i).attr('y')) + this.getTranslateValues("#rect" +i, 1) ) + ')')
        .transition()
        .duration(1500)
        .styleTween('font', () => {
          return d3.interpolate(Math.floor(this.getSquareSize()/4) + "px" , Math.floor(this.maxArrCell/8) +"px")
        })
        .attr("transform", "translate(" + ( parseFloat(d3.select('#keyText').attr('x')) + this.getTranslateValues('#keyRect', 0) ) + ','
                                        + ( parseFloat(d3.select('#keyText').attr('y')) + this.getTranslateValues('#keyRect', 1) ) + ')');

    },
    animateLineThreeAndSix(currentStep){
      const j = currentStep[1];
      if (j <= 0){
        console.log('00000')
        d3.select("#index_j")
          .text("j="+j)
          .attr("transform", "translate(" + (this.getTranslateValues("#rect" +0, 0) + this.getSquareSize()/2) + ',' 
                                          + (this.getTranslateValues("#rect" +0, 1) + 4*this.getSquareSize()/3) +')');
      } else {
        console.log('11111')
        d3.select("#index_j")
          .transition()
          .duration(1000)
          .text("j="+j)
          .attr("transform", "translate(" + (this.getTranslateValues("#rect" +j, 0) + this.getSquareSize()/2) + ',' 
                                          + (this.getTranslateValues("#rect" +j, 1) + 4*this.getSquareSize()/3) +')');
      }

    },
    animateLineFive(currentStep){
      const j = currentStep[1];
      d3.select('#rect' + (j+1))
        .select('rect')
        .transition()
        .duration(750)
        .attr("fill-opacity", 1)
        .transition()
        .duration(750)
        .attr("fill-opacity", 0)

      d3.select('#rect' + j)
        .select('rect')
        .transition()
        .duration(750)
        .attr("fill-opacity", 1)
        .transition()
        .duration(750)
        .attr("fill-opacity", 0)

      d3.select("#rect" + (j+1))
        .select("text")
        .transition()
        .delay(1500)
        .duration(1000)
        .style('opacity', 0);
  
      d3.select("#assignText")
        .text(this.arr[j])
        .attr("transform", "translate(" + ( parseFloat(d3.select('#arrayCellText' + j).attr('x')) + this.getTranslateValues("#rect" +j, 0) ) + ',' 
                                        + ( parseFloat(d3.select('#arrayCellText' + j).attr('y')) + this.getTranslateValues("#rect" +j, 1) ) + ')')
        .transition()
        .delay(2250)
        .duration(1500)
        .attr("transform", "translate(" + ( parseFloat(d3.select('#arrayCellText' + (j+1)).attr('x')) + this.getTranslateValues("#rect" +(j+1), 0) ) + ','
                                        + ( parseFloat(d3.select('#arrayCellText' + (j+1)).attr('y')) + this.getTranslateValues("#rect" +(j+1), 1) ) + ')');
      
      d3.select("#assignText")
        .transition()
        .delay(3750)
        .duration(0)
        .text("");
      d3.select("#rect" + (j+1))
        .select("text")
        .transition()
        .delay(3750)
        .duration(0)
        .text(this.arr[j])
        .style('opacity', 1);
      
    },
    animateLineSeven(currentStep){
      const j = currentStep[1];
      const key = currentStep[2];
      d3.select("#rect" + (j)).select("text")
        .transition()
        .duration(500)
        .style('opacity', 0)
        .text(key)
        .transition()
        .duration(500)
        .style('opacity', 1);
    },

    async animateInsertionSort(){
      for (let k=0; k<this.sortHistory.length; k++){
        if (k != 0){
          const linePastIdx = this.sortHistory[k-1][0]; 
          d3.select("#line" + linePastIdx).style("background-color", "bisque").transition().duration(100);
        }
        const lineIdx = this.sortHistory[k][0]; 
        d3.select("#line" + lineIdx).style("background-color", "grey").transition().duration(100);
        await this.sleep(100);
        const currentStep = this.sortHistory[k];
        if (lineIdx == 1){
          this.animateLineOne(currentStep);
          await this.sleep(1000);
        } else if (lineIdx == 2){
          this.animateLineTwo(currentStep);
          await this.sleep(1500)
        } else if (lineIdx == 3){
          this.animateLineThreeAndSix(currentStep);
          await this.sleep(1000);
        } else if (lineIdx == 4){
          console.log(1);
        } else if (lineIdx == 5){
          this.animateLineFive(currentStep);
          const j = currentStep[1];
          await this.sleep(3750)
          this.arr[j+1] = this.arr[j];
        } else if (lineIdx == 6){
          this.animateLineThreeAndSix(currentStep);
        } else if (lineIdx == 7){
          const j = currentStep[1];
          const key = currentStep[2];
          this.animateLineSeven(currentStep)
          await this.sleep(1000);
          this.arr[j] = key;
        }
      }
    },
    getTranslateValues(element_id, idx){
      console.log(element_id);
      const translateValues = d3.select(element_id).attr("transform").match(/translate\(([^)]+)\)/)[1].split(",");
      return parseFloat(translateValues[idx])
    },

    async randomArr(){
      this.animateRandom(true);
      await this.sleep(500);
      for (let i=0; i<this.arr.length; i++){
        this.arr[i] = Math.floor(Math.random() * 100);
        d3.select("#rect"+i)
          .select("text")
          .text(this.arr[i]);
      }
      this.animateRandom(false);
      await this.sleep(500);
      this.arrayString = this.getArrayString();
      this.refreshChart();
    },
    animateRandom(fadeIn){
      d3.selectAll(".arrChart")
      .select("text")
      .transition()
      .duration(500)
      .style('opacity', () => {
        if (fadeIn){
          return 0;
        } else {
          return 1;
        }
      })
    },
    async shuffleArr(){
      for (let i = this.arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.arr[i], this.arr[j]] = [this.arr[j], this.arr[i]];
      }
      this.arrayString = this.getArrayString();
      this.animateShuffle();
      await this.sleep(800);
      this.refreshChart();
    },
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    animateShuffle(){
      let arr = [...this.arr];
      d3.selectAll(".arrChart")
        .transition()
        .duration(800)
        .attr("transform", (d) => {
          const newIdx = arr.indexOf(d);
          arr[newIdx] = -1;
          return d3.select("#rect" + newIdx).attr("transform");
        })
    },
    refreshChart(){
      d3.select(".svg").selectAll('*').remove();
      if (this.toggleValue){
        this.drawArrChart()
      } else {
        this.drawColumnChart()
      }
    },

    drawColumnChart(){
      this.rectangles = d3.select('.svg')
        .selectAll("g")
        .data(this.arr)
        .enter()
        .append("g")
        .attr("id", (d,i) => {return "rect" + i})
        .attr("transform", (d, i) => { 
          return "translate("+ i * (this.getSquareSize()) + "," + (this.height - d*3) +")"; 
        });

      this.rectangles.append("rect")
        .attr("width", this.getSquareSize())
        .attr("height", (d) => {return d*3})
        .attr("fill", "white")
        .attr("stroke", "black");

      this.rectangles.append("text")
        .attr("y", 40 / 2)
        .attr("x", 15)
        .style("text-anchor", "middle")
        .attr("dy", ".35em")
        .text(function(d) { return d; });
    },

    drawArrChart() {
      this.rectangles = d3.select('.svg')
        .selectAll("g")
        .data(this.arr)
        .enter()
        .append("g")
        .attr("class", "arrChart")
        .attr("id", (d,i) => {return "rect" + i})
        .attr("transform", (d, i) => { 
          if (this.width/this.arr.length > this.maxArrCell) {
            return "translate("+ ( (this.width/2 - (this.arr.length - i) * (this.getSquareSize()/2) ) + i*this.getSquareSize()/2 ) +
                    "," + (2*this.height/3 - this.getSquareSize() / 2 ) +")";
          } 
          return "translate("+ i * (this.getSquareSize()) + "," + (2*this.height/3 - this.getSquareSize() / 2 ) +")"; 
        });

      this.rectangles.append("rect")
        .attr("width", this.getSquareSize())
        .attr("height", this.getSquareSize())
        .attr("rx", "8")
        .attr("ry", "8")
        .attr("fill", "grey")
        .attr("fill-opacity", 0)
        .attr("stroke", "black");

      this.rectangles.append("text")
        .attr("id", (d,i) => {return "arrayCellText" + i} )
        .attr("y", this.getSquareSize() - this.getSquareSize()/3)
        .attr("x", this.getSquareSize() - this.getSquareSize()/2)
        .style("text-anchor", "middle")
        .style("font-size", Math.floor(this.getSquareSize()/2) + "px")
        .text(function(d) { return d; });

      this.rectangles.append("text")
          .attr("y", this.getSquareSize() - (9*this.getSquareSize())/8)
          .attr("x", this.getSquareSize() - this.getSquareSize()/2)
          .style("text-anchor", "middle")
          .style("font-size", Math.floor(this.getSquareSize()/3) + "px")
          .text(function(d, i) { return i; });

      d3.select('.svg')
        .append('text')
        .attr("id", "assignText")
        .attr("y", 0)
        .attr("x", 0)
        .style("text-anchor", "middle")
        .style("font-size", Math.floor(this.getSquareSize()/2) + "px")
        .text("");

      d3.select('.svg')
        .append('text')
        .attr("id", "index_i")
        .attr('x', 0)
        .attr('y', 0)
        .style("text-anchor", "middle")
        .style("font-size", Math.floor(this.getSquareSize()/3) + "px")
        .text("");

      d3.select('.svg')
        .append('text')
        .attr("id", "index_j")
        .attr('x', 0)
        .attr('y', 0)
        .style("text-anchor", "middle")
        .style("font-size", Math.floor(this.getSquareSize()/3) + "px")
        .text("");

      const key_group = d3.select(".svg")
        .append("g")
        .attr("id", "keyRect")
        .attr("transform", "translate(" + (this.width/2 - this.maxArrCell/4) + ",30)");
      
      key_group.append("rect")
        .attr("width", this.maxArrCell/2)
        .attr("height", this.maxArrCell/2)
        .attr("rx", "8")
        .attr("ry", "8")
        .attr("fill", "grey")
        .attr("fill-opacity", 0)
        .attr("stroke", "black");

      key_group.append("text")
        .attr("y", this.maxArrCell - (9*this.maxArrCell)/8)
        .attr("x", this.maxArrCell/2 - this.maxArrCell/4)
        .style("text-anchor", "middle")
        .style("font-size", Math.floor(this.maxArrCell/4) + "px")
        .text("key");
      
      key_group.append("text")
        .attr("id", "keyText")
        .attr("y", this.maxArrCell/2 - (this.maxArrCell)/6)
        .attr("x", this.maxArrCell/2 - this.maxArrCell/4)
        .style("text-anchor", "middle")
        .style("font-size", Math.floor(this.maxArrCell/4) + "px")
        .text("4");
    },
    getSquareSize(){
      if (this.width/this.arr.length > this.maxArrCell) {
        return this.maxArrCell;
      } 
      return this.width/this.arr.length;
    }
  },
  mounted() {
    d3.select('.svg')
      .attr('width', this.width)
      .attr('height', this.height);
    this.drawArrChart();
  },
  
};
</script>

<style lang="scss" scoped>
div {
  margin: 20px;
  background-color: gainsboro;
}

.lines {
  margin: 0;
  padding: 0;
  display: inline;
  background-color: bisque;
}

svg {
  background-color: white;
}
.toggle-mode {
  --toggle-bg-on: black;
  --toggle-border-on: white;
}
</style>

<style src="@vueform/toggle/themes/default.css">

</style>