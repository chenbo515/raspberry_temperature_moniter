function update_chart() {
    $.ajax({
            url: '/api/temp',
            type: 'GET',
            dataType: 'json',
        })
        .done(function(data) {
            $('#container').highcharts({
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: '当前室内温度'
                },
                subtitle: {
                    text: document.ontouchstart === undefined ?
                        'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: '摄氏度'
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [{
                    type: 'area',
                    name: '当前温度',
                    data: _.map(data, function(x) {
                        return [parseInt(x[0]) * 1000 + 480 * 60000, x[1]==null?0:parseFloat(x[1])]
                    }),
                }]
            });
        })
        .fail(function() {
            console.log("error");
        })
        .always(function() {
            console.log("complete");
        });

}
jQuery(document).ready(function($) {

    update_chart();

});
