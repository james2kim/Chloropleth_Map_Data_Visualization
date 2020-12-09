document.addEventListener('DOMContentLoaded', function(){
    let eduData;
    let countyData;
    async function ajaxRequest(){
      try {
           const res = await axios.get('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json')
           eduData=res.data
           const resTwo = await axios.get('https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json')
           countyData=resTwo.data
      } catch(e){
        console.log("Catched error")
      }
    }
    ajaxRequest()
    .then(()=>{
        let padding = 80;
        let width = 1000;
        let height = 600;
        const path = d3.geoPath()
        let myColor = d3.scaleLinear()
                      .domain([0, 100])
                      .range(['white', 'red']);
  
        const svg = d3.select('body')
                    .append('svg')
                    .attr('height', height)
                    .attr('width', width)
      
      const geojson = topojson.feature(countyData, countyData.objects.counties);
      
      const tooltip = d3.select('body')
                        .append('div')
                        .attr('id', 'tooltip')
                        .style('opacity', 0)

      const handleMouseOn = (d) => {
        let edu = eduData.find(x => x.fips === d.id).bachelorsOrHigher;
        let county = eduData.find(x => x.fips === d.id).area_name;
        let state = eduData.find(x => x.fips === d.id).state;
        tooltip.style('opacity', .9)
               .attr('data-education', edu)
               .html(`${county},
                     ${state}: ${edu}%`)
               .style('left', (d3.event.pageX + 15) + 'px')
               .style('top', (d3.event.pageY + 15) + 'px')
      }
      
      const handleMouseOut = (d) =>  {
        tooltip.style('opacity', 0)
      }

      console.log(path)
      svg.selectAll('path')
         .data(geojson.features)
         .enter()
         .append('path')
         .attr('d', path)
         .attr('fill', (d) => myColor(eduData.find(x => x.fips === d.id).bachelorsOrHigher))
         .attr('class', 'county')
         .attr('data-fips', (d) => eduData.find(x => x.fips === d.id).fips)
         .attr('data-education', (d) => eduData.find(x => x.fips === d.id).bachelorsOrHigher)
         .on('mouseover',  handleMouseOn)
         .on('mouseout', handleMouseOut)
    })
  
  .catch((err)=>{
    alert("Unable to Load Map")
    })
  })