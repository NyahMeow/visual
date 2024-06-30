// Include the xlsx library
// <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js"></script>

// Function to handle file upload and read Excel file
document.getElementById('uploadBtn').addEventListener('click', function () {
    var fileUpload = document.getElementById('fileUpload').files[0];
    if (fileUpload) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
            var sheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[sheetName];
            var json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            processData(json);
        };
        reader.readAsArrayBuffer(fileUpload);
    } else {
        alert("Please select a file.");
    }
});

function processData(data) {
    var dataArray = [];
    for (var i = 1; i < data.length; i++) { // Start from 1 to skip header row
        var row = data[i];
        if (row.length >= 4) { // Ensure there are at least 4 columns
            var x = parseFloat(row[0]);
            var y = parseFloat(row[1]);
            var z = parseFloat(row[2]);
            var country = row[3];
            var color = 'rgba(0, 105, 255, ' + (1 - ((1 - ((0 - 1) / (0 - 5)) * z))) + ')';
            dataArray.push({
                'x': x,
                'y': y,
                'z': z,
                'Country': country,
                'color': color
            });
        }
    }
    createChart(dataArray);
}

function createChart(dataArray) {
    Highcharts.chart('container', {
        chart: {
            type: 'scatter3d',
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 30,
                depth: 250,
                viewDistance: 5,
                fitToPlot: false,
                frame: {
                    bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
                    back: { size: 1, color: 'rgba(0,0,0,0.04)' },
                    side: { size: 1, color: 'rgba(0,0,0,0.06)' }
                }
            }
        },
        title: {
            text: '3D Scatter Plot'
        },
        subtitle: {
            text: 'Highcharts 3D Scatter Chart'
        },
        plotOptions: {
            scatter: {
                width: 10,
                height: 10,
                depth: 10
            }
        },
        yAxis: {
            min: 0,
            max: 10,
            title: {
                text: 'Y-Axis'
            }
        },
        xAxis: {
            min: 0,
            max: 10,
            gridLineWidth: 1,
            title: {
                text: 'X-Axis'
            }
        },
        zAxis: {
            min: 0,
            max: 10,
            showFirstLabel: false,
            title: {
                text: 'Z-Axis'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Data',
            colorByPoint: true,
            data: dataArray
        }]
    });
}

// Initial chart setup with default data
var defaultData = [
    [19.6, 11.0, 4.73, 'United States of America'],
    [21.07, 9.06, 4.48, "People's Republic of China"],
    // ... Add more default data if necessary
];

processData(defaultData);
