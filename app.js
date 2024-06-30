// Here is the Javascript code

// your dataset as an array of arrays. each array is a row of your dataset (x,y,z)
// Added country name
 var raw_data= [
 [19.6, 11.0, 4.73, 'United States of America'],
 [21.07, 9.06, 4.48, "People's Republic of China"],
 [18.66, 10.55, 4.06, 'Japan'],
 [18.02, 10.58, 4.17, 'Great Britain'],
 [18.8, 9.29, 4.26, 'ROC'],
 [17.02, 10.89, 3.83, 'Australia'],
 [16.65, 10.8, 3.58, 'Netherlands'],
 [17.99, 10.59, 3.5, 'France'],
 [18.23, 10.71, 3.61, 'Germany'],
 [17.92, 10.37, 3.69, 'Italy'],
 [17.42, 10.71, 3.18, 'Canada'],
 [19.15, 9.2, 3.04, 'Brazil'],
 [15.36, 10.68, 3.0, 'New Zealand'],
 [16.24, 9.05, 2.71, 'Cuba'],
 [16.09, 9.57, 3.0, 'Hungary'],
 [17.75, 10.31, 3.0, 'Republic of Korea'],
 [17.45, 9.54, 2.64, 'Poland'],
 [16.18, 9.92, 2.4, 'Czech Republic'],
 [17.73, 7.36, 2.3, 'Kenya'],
 [15.48, 11.23, 2.08, 'Norway'],
 [14.89, 8.53, 2.2, 'Jamaica'],
 [17.66, 10.25, 2.83, 'Spain'],
 [16.11, 10.9, 2.2, 'Sweden'],
 [15.95, 11.29, 2.56, 'Switzerland'],
 [15.56, 10.96, 2.4, 'Denmark'],
 [15.25, 9.49, 2.08, 'Croatia'],
 [18.21, 8.64, 1.95, 'Islamic Republic of Iran'],
 [15.99, 8.45, 2.2, 'Serbia'],
 [16.25, 10.68, 1.95, 'Belgium'],
 [15.78, 9.01, 1.79, 'Bulgaria'],
 [14.55, 10.06, 1.61, 'Slovenia'],
 [17.28, 7.35, 1.61, 'Uzbekistan'],
 [15.2, 8.23, 2.08, 'Georgia'],
 [18.21, 9.26, 2.56, 'Turkey'],
 [16.17, 9.86, 1.39, 'Greece'],
 [17.53, 6.45, 1.39, 'Uganda'],
 [16.64, 8.73, 1.1, 'Ecuador'],
 [15.37, 11.15, 1.39, 'Ireland'],
 [15.92, 10.67, 1.39, 'Israel'],
 [14.82, 11.02, 1.1, 'Qatar'],
 [12.85, 10.37, 0.69, 'Bahamas'],
 [17.61, 7.83, 2.94, 'Ukraine'],
 [16.06, 8.66, 1.95, 'Belarus'],
 [16.79, 9.29, 1.39, 'Romania'],
 [21.01, 7.59, 1.95, 'India'],
 [15.8, 10.75, 1.79, 'Hong Kong, China'],
 [18.47, 8.0, 1.39, 'Philippines'],
 [15.51, 9.77, 1.39, 'Slovakia'],
 [17.86, 8.72, 1.1, 'South Africa'],
 [15.99, 10.76, 1.95, 'Austria'],
 [18.38, 7.8, 1.79, 'Egypt'],
 [19.39, 8.25, 1.61, 'Indonesia'],
 [18.48, 6.63, 1.39, 'Ethiopia'],
 [16.15, 9.97, 1.39, 'Portugal'],
 [16.25, 8.16, 0.69, 'Tunisia'],
 [14.09, 9.91, 0.69, 'Estonia'],
 [13.68, 8.66, 0.69, 'Fiji'],
 [14.48, 9.66, 0.69, 'Latvia'],
 [18.05, 8.79, 0.69, 'Thailand'],
 [17.39, 8.03, 0.0, 'Morocco'],
 [17.71, 8.77, 1.61, 'Colombia'],
 [16.1, 8.33, 1.95, 'Azerbaijan'],
 [16.17, 8.89, 1.61, 'Dominican Republic'],
 [14.9, 8.27, 1.39, 'Armenia'],
 [15.64, 7.11, 1.1, 'Kyrgyzstan'],
 [14.95, 8.21, 1.39, 'Mongolia'],
 [17.6, 9.58, 1.1, 'Argentina'],
 [10.42, 10.79, 1.1, 'San Marino'],
 [16.1, 8.32, 0.69, 'Jordan'],
 [17.25, 9.22, 0.69, 'Malaysia'],
 [19.07, 7.59, 0.69, 'Nigeria'],
 [14.22, 10.07, 0.0, 'Bahrain'],
 [17.32, 9.94, 0.0, 'Saudi Arabia'],
 [14.86, 9.72, 0.0, 'Lithuania'],
 [14.55, 8.6, 0.0, 'North Macedonia'],
 [14.69, 8.62, 0.0, 'Namibia'],
 [15.57, 8.79, 0.0, 'Turkmenistan'],
 [16.71, 9.11, 2.08, 'Kazakhstan'],
 [18.64, 9.13, 1.39, 'Mexico'],
 [15.52, 10.73, 0.69, 'Finland'],
 [14.61, 8.97, 0.0, 'Botswana'],
 [16.77, 6.46, 0.0, 'Burkina Faso'],
 [17.01, 7.33, 0.0, "Côte d'Ivoire"],
 [17.19, 7.61, 0.0, 'Ghana'],
 [11.62, 9.23, 0.0, 'Grenada'],
 [15.22, 10.3, 0.0, 'Kuwait']
 ]
           
     // Here we need to affect a color and intensity to each z value
     // compute RGB color based on z value
     var dataArray = [];
     // Here we iterate over all the dataset index 0 to the total length of the dataset
     for (var i = 0; i < raw_data.length; i++) {
     
        // Define RGB color : modify the RGB composition (between 0 and 255) to change the color.
        var red_value=0;
        var green_value=105;
        var blue_value= 255;    
        // Define the alpha value (color intensity). this value must between 0 and 1 (full intensity)
        // lets define it as a function of z which is the 3 elements of each sub array 
        // NB. arrays index starts at 0 so 3rd element is index [2]
        var alpha_value=1-((1-((0-1)/(0-5))*raw_data[i][2]))
 				// now we can define the actual color
        var color='rgba('+red_value+','+green_value+','+blue_value+','+alpha_value+')'
        
        // new data structure
        dataArray[i] = {
            'x': raw_data[i][1],
            'y': raw_data[i][0],
            'z': raw_data[i][2],
            'Country':raw_data[i][3], // country name added
            'color': color };
            
    				} // end of our loop
            // we now have a proper data structure (stored in object 'dataArray') 
            // it now includes the color and intensity for each data point
            
            
// Set up the chart and parameters. here you can modify the Chart title, axis titles etc.
var chart = new Highcharts.Chart({
    chart: {
        renderTo: 'container',
        margin: 100,
        type: 'scatter3d',
        animation: true,
        options3d: {
            enabled: true,
            alpha: 10,
            beta: 30,
            depth: 250,
            viewDistance: 5,
            fitToPlot: false,
            frame: {
                bottom: {
                    size: 1, color: 'rgba(0,0,0,0.05)'
                }
            },
          
        }
    },
    title: {
        text: 'Tokyo Olympic Medals, versus GDP and Population'
    },
    subtitle: {
        text: 'Click and drag the plot area to rotate in space'
    },
    plotOptions: {
        scatter: {
            width: 10,
            height: 10,
            depth: 10
        }
    },
     xAxis: {
        min: 5,
        max: 12,
        gridLineWidth: 1,
        title: {'text':'x: GDP per capita (in log)'}
    },
    yAxis: {
        min: 8,
        title: {'text':'y: Population (in log)'}
    },
       
    zAxis: {
        min: 0,
        max: 5,
        showFirstLabel: false,
        title: {'text':'z: Total Medals (in log)'}
    },
    // Custom tooltip with HTML formatting pretty self explanatory
      tooltip: {
        headerFormat: '',
          pointFormat: '<br><b>{point.Country}:</b><br>Population: {point.x} <br> GDP per capita: {point.y}<br>Medals: {point.z}'
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Medals gain relationship with GDP and population',
        data: dataArray,
         stickyTracking: false // this option makes the tooltip disapear when mouse move away.
    }]
});


// Some magic here for the interactive feattures
//Add mouse and touch events for rotation
(function (H) {
    function dragStart(eStart) {
        eStart = chart.pointer.normalize(eStart);

        var posX = eStart.chartX,
            posY = eStart.chartY,
            alpha = chart.options.chart.options3d.alpha,
            beta = chart.options.chart.options3d.beta,
            sensitivity = 5,  // lower is more sensitive
            handlers = [];

        function drag(e) {
            // Get e.chartX and e.chartY
            e = chart.pointer.normalize(e);

            chart.update({
                chart: {
                    options3d: {
                        alpha: alpha + (e.chartY - posY) / sensitivity,
                        beta: beta + (posX - e.chartX) / sensitivity
                    }
                }
            }, undefined, undefined, false);
        }

        function unbindAll() {
            handlers.forEach(function (unbind) {
                if (unbind) {
                    unbind();
                }
            });
            handlers.length = 0;
        }

        handlers.push(H.addEvent(document, 'mousemove', drag));
        handlers.push(H.addEvent(document, 'touchmove', drag));
        handlers.push(H.addEvent(document, 'mouseup', unbindAll));
        handlers.push(H.addEvent(document, 'touchend', unbindAll));
    }
    H.addEvent(chart.container, 'mousedown', dragStart);
    H.addEvent(chart.container, 'touchstart', dragStart);
    
  
}(Highcharts));


// ENd of the javascript section
