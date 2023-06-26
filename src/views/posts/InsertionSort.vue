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
    1  for j = 2 to A.length
    2    key = A[j]
    3    i = j - 1
    4    while i > 0 and A[i] > key
    5      A[i+1] = A[i]
    6      i = i - 1
    7    A[i+1] = key
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
      width: 1000,
      height: 300,
      maxArrCell: 125,
      arr: [3,2,1],
      rectangles: null,
      sliderValue: 3,
      arrayString: "3 2 1",
      maxNoNumbers: 32,
      toggleValue: true
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
      for (let j=1; j<this.arr.length; j++){
        let key = this.arr[j];
        let i = j-1;
        while (i >= 0 && this.arr[i] > key){
          this.arr[i+1] = this.arr[i];
          i = i-1;
        }
        this.arr[i+1] = key;
      }
      this.arrayString = this.getArrayString();      
      this.refreshChart();
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
      console.log("111")
      this.refreshChart()
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
                    "," + (this.height/2 - this.getSquareSize() / 2 ) +")";
          } 
          return "translate("+ i * (this.getSquareSize()) + "," + (this.height/2 - this.getSquareSize() / 2 ) +")"; 
        });

      this.rectangles.append("rect")
        .attr("width", this.getSquareSize())
        .attr("height", this.getSquareSize())
        .attr("rx", "10")
        .attr("ry", "10")
        .attr("fill", "white")
        .attr("stroke", "black");

      this.rectangles.append("text")
        .attr("y", this.getSquareSize() - this.getSquareSize()/3)
        .attr("x", this.getSquareSize() - this.getSquareSize()/2)
        .style("text-anchor", "middle")
        .style("font-size", Math.floor(this.getSquareSize()/2) + "px")
        .text(function(d) { return d; });
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