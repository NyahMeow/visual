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
            console.log(json);  // デバッグ用にデータを確認
            processData(json);
        };
        reader.readAsArrayBuffer(fileUpload);
    } else {
        alert("Please select a file.");
    }
});

function processData(data) {
    var dataArray = [];
    for (var i = 1; i < data.length; i++) { // ヘッダー行をスキップ
        var row = data[i];
        if (row.length >= 4) { // 少なくとも4列があることを確認
            var x = parseFloat(row[0]);
            var y = parseFloat(row[1]);
            var z = parseFloat(row[2]);
            var country = row[3];
            var color = 'rgba(0, 105, 255, ' + (1 - (z / 5)) + ')'; // zの範囲に応じた色の設定
            dataArray.push({
                'x': x,
                'y': y,
                'z': z,
                'name': country,
                'color': color
            });
        }
    }
    console.log(dataArray);  // デバッグ用にデータを確認
    createChart(dataArray);
}

function createChart(dataArray) {
    console.log("Creating chart with data:", dataArray); // デバッグ用ログ
    var chart = Highcharts.chart('container', {
        chart: {
            renderTo: 'container',
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
            max: 30,
            title: {
                text: 'Y-Axis'
            }
        },
        xAxis: {
            min: 0,
            max: 30,
            gridLineWidth: 1,
            title: {
                text: 'X-Axis'
            }
        },
        zAxis: {
            min: 0,
            max: 30,
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
        }],
        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b><br>GDP per capita: {point.x}<br>Population: {point.y}<br>Medals: {point.z}'
        }
    });
    console.log(chart); // チャートオブジェクトの確認
}

// 初期チャートの設定とデフォルトデータ
var defaultData = [
    [19.6, 11.0, 4.73, 'United States of America'],
    [21.07, 9.06, 4.48, "People's Republic of China"],
    [18.66, 10.55, 4.06, 'Japan'],
    [18.02, 10.58, 4.17, 'Great Britain'],
    [18.8, 9.29, 4.26, 'ROC']
    // 必要に応じて追加のデフォルトデータを追加
];

processData(defaultData);
