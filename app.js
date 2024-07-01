let chart; // グローバル変数としてチャートを宣言

document.addEventListener('DOMContentLoaded', function() {
    const analyzeButton = document.getElementById('analyzeButton');
    const resizeChartButton = document.getElementById('resizeChart');
    const updateAxisRangeButton = document.getElementById('updateAxisRange');
    const updateUnitsButton = document.getElementById('updateUnits');

    analyzeButton.addEventListener('click', processFile);
    resizeChartButton.addEventListener('click', resizeChart);
    updateAxisRangeButton.addEventListener('click', updateAxisRange);
    updateUnitsButton.addEventListener('click', updateAxisUnits);

    // 初期チャートの作成
    createChart([]);
});

function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert("Please select a file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // 読み込まれたデータをコンソールに出力
        console.log("Loaded data:", json);

        processData(json);
    };

    reader.onerror = function(e) {
        console.error("ファイルの読み込み中にエラーが発生しました:", e);
    };

    reader.readAsBinaryString(file);
}

function resizeChart() {
    console.log("Resizing chart...");
    const width = parseInt(document.getElementById('chartWidth').value, 10);
    const height = parseInt(document.getElementById('chartHeight').value, 10);
    const depth = parseInt(document.getElementById('chartDepth').value, 10); // z軸のサイズを取得

    if (chart) {
        chart.update({
            chart: {
                width: width,
                height: height,
                options3d: {
                    depth: depth // z軸のサイズを更新
                }
            }
        });
        console.log("Chart resized to width:", width, "height:", height, "depth:", depth);
    } else {
        console.error("Chart not found.");
    }
}

function updateAxisUnits() {
    console.log("Updating axis units...");
    if (chart) {
        chart.xAxis[0].setTitle({ text: document.getElementById('xAxisUnit').value });
        chart.yAxis[0].setTitle({ text: document.getElementById('yAxisUnit').value });
        chart.zAxis[0].setTitle({ text: document.getElementById('zAxisUnit').value });
        console.log("Axis units updated.");
    } else {
        console.error("Chart not found.");
    }
}

function updateAxisRange() {
    console.log("Updating axis range...");
    if (chart) {
        chart.xAxis[0].update({
            min: parseFloat(document.getElementById('xMin').value),
            max: parseFloat(document.getElementById('xMax').value)
        });
        chart.yAxis[0].update({
            min: parseFloat(document.getElementById('yMin').value),
            max: parseFloat(document.getElementById('yMax').value)
        });
        chart.zAxis[0].update({
            min: parseFloat(document.getElementById('zMin').value),
            max: parseFloat(document.getElementById('zMax').value)
        });
        console.log("Axis range updated.");
    } else {
        console.error("Chart not found.");
    }
}

function processData(data) {
    const dataArray = [];
    for (let i = 1; i < data.length; i++) { // ヘッダー行をスキップ
        const row = data[i];
        if (Array.isArray(row) && row.length >= 4) { // 少なくとも4列があることを確認
            const x = parseFloat(row[0]);
            const y = parseFloat(row[1]);
            const z = parseFloat(row[2]);
            const country = row[3];
            const color = 'rgba(0, 105, 255, ' + (1 - (z / 5)) + ')'; // zの範囲に応じた色の設定

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
    chart = Highcharts.chart('container', {
        chart: {
            renderTo: 'container',
            type: 'scatter3d',
            margin: [80, 80, 80, 80], // マージンを調整
            options3d: {
                enabled: true,
                alpha: 10,
                beta: 30,
                depth: 250,
                viewDistance: 5,
                fitToPlot: true, // fitToPlotをtrueに設定
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
        xAxis: {
            min: parseFloat(document.getElementById('xMin').value),
            max: parseFloat(document.getElementById('xMax').value),
            gridLineWidth: 1,
            title: {
                text: document.getElementById('xAxisUnit').value
            }
        },
        yAxis: {
            min: parseFloat(document.getElementById('yMin').value),
            max: parseFloat(document.getElementById('yMax').value),
            title: {
                text: document.getElementById('yAxisUnit').value
            }
        },
        zAxis: {
            min: parseFloat(document.getElementById('zMin').value),
            max: parseFloat(document.getElementById('zMax').value),
            showFirstLabel: false,
            title: {
                text: document.getElementById('zAxisUnit').value
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Data',
            colorByPoint: true,
            data: dataArray,
            keys: ['x', 'y', 'z', 'name', 'color'] // データのキーを指定
        }],
        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b><br>GDP per capita: {point.x}<br>Population: {point.y}<br>Medals: {point.z}'
        }
    });
    console.log(chart); // チャートオブジェクトの確認

    // 3D散布図のマウスイベントを追加
    (function (H) {
        function dragStart(eStart) {
            eStart = chart.pointer.normalize(eStart);

            const posX = eStart.chartX;
            const posY = eStart.chartY;
            const alpha = chart.options.chart.options3d.alpha;
            const beta = chart.options.chart.options3d.beta;
            const sensitivity = 5;  // lower is more sensitive
            const handlers = [];

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
}

// 初期チャートの設定とデフォルトデータ
const defaultData = [
    [5.6, 7.0, 4.73, 'United States of America'],
    [8.07, 9.06, 4.48, "People's Republic of China"],
    [9.66, 10.55, 4.06, 'Japan'],
    [7.02, 8.58, 5.17, 'Great Britain'],
    [10.1, 9.29, 3.26, 'ROC']
    // 必要に応じて追加のデフォルトデータを追加
];

createChart(defaultData);
