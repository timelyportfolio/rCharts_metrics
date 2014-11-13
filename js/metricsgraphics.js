'use strict';

var charts = {};
var globals = {};
globals.link = false;
globals.version = "1.0";

function data_graphic() {
    var moz = {};
    moz.defaults = {};
    moz.defaults.all = {
        missing_is_zero: false,       // if true, missing values will be treated as zeros
        legend: '' ,                  // an array identifying the labels for a chart's lines
        legend_target: '',            // if set, the specified element is populated with a legend
        error: '',                    // if set, a graph will show an error icon and log the error to the console
        animate_on_load: false,       // animate lines on load
        top: 40,                      // the size of the top margin
        bottom: 30,                   // the size of the bottom margin
        right: 10,                    // size of the right margin
        left: 50,                     // size of the left margin
        buffer: 8,                    // the buffer between the actual chart area and the margins
        width: 350,                   // the width of the entire graphic
        height: 220,                  // the height of the entire graphic
        small_height_threshold: 120,  // the height threshold for when smaller text appears
        small_width_threshold: 160,   // the width  threshold for when smaller text appears
        small_text: false,            // coerces small text regardless of graphic size
        xax_count: 6,                 // number of x axis ticks
        xax_tick_length: 5,           // x axis tick length
        yax_count: 5,                 // number of y axis ticks
        yax_tick_length: 5,           // y axis tick length
        x_extended_ticks: false,      // extends x axis ticks across chart - useful for tall charts
        y_extended_ticks: false,      // extends y axis ticks across chart - useful for long charts
        y_scale_type: 'linear',
        max_x: null,
        max_y: null,
        min_x: null,
        min_y: null,
        point_size: 2.5,              // the size of the dot that appears on a line on mouse-over
        x_accessor: 'date',
        xax_units: '',
        x_label: '',
        x_axis: true,
        y_axis: true,
        y_accessor: 'value',
        y_label: '',
        yax_units: '',
        transition_on_update: true,
        rollover_callback: null,
        show_rollover_text: true,
        show_confidence_band: null,   // given [l, u] shows a confidence at each point from l to u
        xax_format: function(d) {
            var df = d3.time.format('%b %d');
            var pf = d3.formatPrefix(d);

            // format as date or not, of course user can pass in 
            // a custom function if desired
            switch($.type(args.data[0][0][args.x_accessor])) {
                case 'date':
                    return df(d);
                    break;
                case 'number':
                    return pf.scale(d) + pf.symbol;
                    break;
                default:
                    return d;
            }
        },
        area: true,
        chart_type: 'line',   
        data: [],
        decimals: 2,                  // the number of decimals in any rollover
        format: 'count',              // format = {count, percentage}
        inflator: 10/9,               // for setting y axis max
        linked: false,                // links together all other graphs with linked:true, so rollovers in one trigger rollovers in the others
        list: false,
        baselines: null,              // sets the baseline lines
        markers: null,                // sets the marker lines
        scalefns: {},
        scales: {},
        show_years: true,
        target: '#viz',
        interpolate: 'cardinal',       // interpolation method to use when rendering lines
        custom_line_color_map: [],     // allows arbitrary mapping of lines to colors, e.g. [2,3] will map line 1 to color 2 and line 2 to color 3
        max_data_size: null            // explicitly specify the the max number of line series, for use with custom_line_color_map
    }
    moz.defaults.point = {
        buffer: 16,
        ls: false,
        lowess: false,
        point_size: 2.5,
        size_accessor: null,
        color_accessor: null,
        size_range: null,              // when we set a size_accessor option, this array determines the size range, e.g. [1,5]
        color_range: null,             // e.g. ['blue', 'red'] to color different groups of points
        size_domain: null,
        color_domain: null,
        color_type: 'number'           // can be either 'number' - the color scale is quantitative - or 'category' - the color scale is qualitative.
    }
    moz.defaults.histogram = {
        rollover_callback: function(d, i) {
            $('#histogram svg .active_datapoint')
                .html('Frequency Count: ' + d.y);
        },
        binned: false,
        bins: null,
        processed_x_accessor: 'x',
        processed_y_accessor: 'y',
        processed_dx_accessor: 'dx',
        bar_margin: 1
    }
    moz.defaults.bar = {
        y_accessor: 'factor',
        x_accessor: 'value',
        baseline_accessor: null,
        predictor_accessor: null,
        predictor_proportion: 5,
        dodge_acessor: null,
        binned: true,
        padding_percentage: .1,
        outer_padding_percentage: .1,
        height: 500,
        top: 20,
        bar_height: 20,
        left: 70
    }
    moz.defaults.missing = {
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        width: 350,
        height: 220
    }

    var args = arguments[0];
    if (!args) { args = {}; }
    //args = merge_with_defaults(args, moz.defaults.all);

    var g = '';
    if (args.list) {
        args.x_accessor = 0;
        args.y_accessor = 1;
    }
    
    //build the chart
    if(args.chart_type == 'missing-data'){
        args = merge_with_defaults(args, moz.defaults.missing);
        charts.missing(args);
    }
    else if(args.chart_type == 'point'){
        var a = merge_with_defaults(moz.defaults.point, moz.defaults.all);
        args = merge_with_defaults(args, a);
        charts.point(args).mainPlot().markers().rollover();
    }
    else if(args.chart_type == 'histogram'){
        var a = merge_with_defaults(moz.defaults.histogram, moz.defaults.all);
        args = merge_with_defaults(args, a);
        charts.histogram(args).mainPlot().markers().rollover();
    }
    else if (args.chart_type == 'bar'){
        var a = merge_with_defaults(moz.defaults.bar, moz.defaults.all);
        args = merge_with_defaults(args, a);
        charts.bar(args).mainPlot().markers().rollover();
    }
    else {
        args = merge_with_defaults(args, moz.defaults.all);
        charts.line(args).markers().mainPlot().rollover();
    }

    return args.data;
}

function chart_title(args) {
    //is chart title different than existing, if so, clear the fine 
    //gentleman, otherwise, move along
    if(args.title && args.title !== $(args.target + ' h2.chart_title').text())
        $(args.target + ' h2.chart_title').remove();
    else
        return;

    if (args.target && args.title) {
        //only show question mark if there's a description
        var optional_question_mark = (args.description)
            ? '<i class="fa fa-question-circle fa-inverse"></i>'
            : '';
    
        $(args.target).prepend('<h2 class="chart_title">' 
            + args.title + optional_question_mark + '</h2>');
            
        //activate the question mark if we have a description
        if (args.description){
            var $elem = $(this);

            $(args.target + ' h2.chart_title')
                .popover({html: true,
                    'animation': false,
                    'content': args.description,
                    'trigger': 'hover',
                    'placement': 'top',
                    'container': $(args.target + ' h2.chart_title')});
        }   
    }
    
    if(args.error) {
        error(args);
    }
}

function y_axis(args) {
    var svg = d3.select(args.target + ' svg');
    var g;

    var min_y, max_y;

    args.scalefns.yf = function(di) {
        return args.scales.Y(di[args.y_accessor]);
    }

    var min_y, max_y;

    var _set = false;
    for (var i=0; i < args.data.length; i++) {
        var a = args.data[i];

        if (args.y_scale_type == 'log') {
            // filter positive values
            a = a.filter(function(d) { return d[args.y_accessor] > 0; });
        }

        if (a.length > 0) {
            // get min/max in one pass
            var extent = d3.extent(a,function(d) {
                return d[args.y_accessor];
            });

            if (!_set) {
                // min_y and max_y haven't been set
                min_y = extent[0];
                max_y = extent[1];
                _set = true;
            } else {
                min_y = Math.min(extent[0], min_y);
                max_y = Math.max(extent[1], max_y);
            }
        }
    }

    min_y = args.min_y ? args.min_y : min_y;
    max_y = args.max_y ? args.max_y : max_y;

    if (args.y_scale_type != 'log') {
        // we are currently saying that if the min val > 0, set 0 as min y.
        if (min_y >= 0){
            min_y = 0;
            args.y_axis_negative = false;
        } else {
            min_y = min_y  - (max_y * (args.inflator-1));
            args.y_axis_negative = true;
        }
    }

    if (args.y_scale_type == 'log'){
        if (args.chart_type == 'histogram') {
            // log histogram plots should start just below 1
            // so that bins with single counts are visible
            min_y = 0.2;
        } else {
            if (min_y <= 0) {
                min_y = 1;
            }
        }
        args.scales.Y = d3.scale.log()
        .domain([min_y, max_y * args.inflator])
        .range([args.height - args.bottom - args.buffer, args.top])
        .clamp(true);
    } else {
        args.scales.Y = d3.scale.linear()
            .domain([min_y, max_y * args.inflator])
            .range([args.height - args.bottom - args.buffer, args.top]);
    }

    // used for ticks and such, and designed to be paired with log or linear.
    args.scales.Y_axis = d3.scale.linear()
            .domain([min_y, max_y * args.inflator])
            .range([args.height - args.bottom - args.buffer, args.top]);

    var yax_format;
    if (args.format == 'count') {
        yax_format = function(f) {
            if (f < 1.0) {
                // Don't scale tiny values.
                return args.yax_units + d3.round(f, args.decimals);
            } else {
                var pf = d3.formatPrefix(f);
                return args.yax_units + pf.scale(f) + pf.symbol;
            }
        };
    }
    else {
        yax_format = function(d_) {
            var n = d3.format('%p');
            return n(d_);
        }
    }

    //remove the old y-axis, add new one
    if($(args.target + ' svg .y-axis').length > 0) {
        $(args.target + ' svg .y-axis')
            .remove();
    }

    if (!args.y_axis) return this;

    //y axis
    g = svg.append('g')
        .classed('y-axis', true)
        .classed('y-axis-small', args.use_small_class);

    //are we adding a label?
    if(args.y_label) {
        g.append('text')
            .attr('class', 'label')
            .attr('x', function() {
                return -1 * (args.top + args.buffer + 
                        ((args.height - args.bottom - args.buffer)
                            - (args.top + args.buffer)) / 2);
            })
            .attr('y', function() {
                return args.left / 2;
            })
            .attr("dy", "0.4em")
            .attr('text-anchor', 'middle')
            .text(function(d) {
                return args.y_label;
            })
            .attr("transform", function(d) {
                return "rotate(-90)";
            });
    }

    var scale_ticks = args.scales.Y.ticks(args.yax_count);

    function log10(val) {
         //return Math.log(val) / Math.LN10;
         if (val==1000){
            return 3;
         }
         if (val==1000000){
            return 7;
         }
         return Math.log(val) / Math.LN10;
    }

    if (args.y_scale_type == 'log'){
        // get out only whole logs.
        scale_ticks = scale_ticks.filter(function(d){
            return Math.abs(log10(d)) % 1 < 1e-6 || Math.abs(log10(d)) % 1 > 1-1e-6;
        });
    }

    //filter out fraction ticks if our data is ints and if ymax > number of generated ticks
    var number_of_ticks = args.scales.Y.ticks(args.yax_count).length;
    
    //is our data object all ints?
    var data_is_int = true;
    $.each(args.data, function(i, d) {
        $.each(d, function(i, d) {
            if(d[args.y_accessor] % 1 !== 0) {
                data_is_int = false;
                return false;
            }
        });
    });

    if(data_is_int && number_of_ticks > max_y && args.format == 'count') {
        //remove non-integer ticks
        scale_ticks = scale_ticks.filter(function(d){
            return d % 1 === 0;
        });
    }

    var last_i = scale_ticks.length-1;
    if(!args.x_extended_ticks && !args.y_extended_ticks) {
        g.append('line')
            .attr('x1', args.left)
            .attr('x2', args.left)
            .attr('y1', args.scales.Y(scale_ticks[0]))
            .attr('y2', args.scales.Y(scale_ticks[last_i]));
    }

    //add y ticks
    g.selectAll('.yax-ticks')
        .data(scale_ticks).enter()
            .append('line')
                .classed('extended-y-ticks', args.y_extended_ticks)
                .attr('x1', args.left)
                .attr('x2', function() {
                    return (args.y_extended_ticks)
                        ? args.width - args.right
                        : args.left - args.yax_tick_length;
                })
                .attr('y1', args.scales.Y)
                .attr('y2', args.scales.Y);

    g.selectAll('.yax-labels')
        .data(scale_ticks).enter()
            .append('text')
                .attr('x', args.left - args.yax_tick_length * 3 / 2)
                .attr('dx', -3).attr('y', args.scales.Y)
                .attr('dy', '.35em')
                .attr('text-anchor', 'end')
                .text(function(d, i) {
                    var o = yax_format(d);
                    return o;
                })

    return this;
}

function y_axis_categorical(args) {
    // first, come up with y_axis 
    var svg_height = args.height;
    if (args.chart_type=='bar' && svg_height==null){
        // we need to set a new height variable.
    }

    args.scales.Y = d3.scale.ordinal()
        .domain(args.categorical_variables)
        .rangeRoundBands([args.height - args.bottom - args.buffer, args.top], args.padding_percentage, args.outer_padding_percentage);

    args.scalefns.yf = function(di) {
        return args.scales.Y(di[args.y_accessor]);
    }

    var svg = d3.select(args.target + ' svg');

    var g = svg.append('g')
        .classed('y-axis', true)
        .classed('y-axis-small', args.use_small_class);


    if (!args.y_axis) return this;

    g.selectAll('text').data(args.categorical_variables).enter().append('svg:text')
        .attr('x', args.left)
        .attr('y', function(d){return args.scales.Y(d) + args.scales.Y.rangeBand()/2 +(args.buffer)*args.outer_padding_percentage  })
        .attr('dy', '.35em')
        .attr('text-anchor', 'end')
        .text(String)
    // plot labels


    return this;
}

function x_axis(args) {
    var svg = d3.select(args.target + ' svg');
    var g;
    var min_x;
    var max_x;

    args.scalefns.xf = function(di) {
        return args.scales.X(di[args.x_accessor]);
    }

    if (args.chart_type == 'point') {
        // figure out 
        var min_size, max_size, min_color, max_color, size_range, color_range, size_domain, color_domain;
        if (args.color_accessor != null){
            if (args.color_domain == null){
                if (args.color_type=='number'){
                    min_color = d3.min(args.data[0], function(d){return d[args.color_accessor]});
                    max_color = d3.max(args.data[0], function(d){return d[args.color_accessor]});        
                    color_domain = [min_color, max_color];
                } else if (args.color_type=='category'){
                    color_domain = d3.set(args.data[0].map(function(d){
                        return d[args.color_accessor];
                    })).values();
                    color_domain.sort();
                }
            } else {
                color_domain = args.color_domain;
            }

            if (args.color_range == null){
                if (args.color_type=='number'){
                    color_range = ['blue', 'red'];    
                } else {
                    color_range = null;
                }
                
            } else {
                color_range = args.color_range;
            }
            

            if (args.color_type=='number'){
                args.scales.color = d3.scale.linear().domain(color_domain).range(color_range).clamp(true);    
            } else {
                args.scales.color = args.color_range != null ? d3.scale.ordinal().range(color_range) : (color_domain.length > 10 ? d3.scale.category20() : d3.scale.category10() );
                args.scales.color.domain(color_domain);
                
            }

            

            args.scalefns.color = function(di){
                return args.scales.color(di[args.color_accessor]);
            };
        }

        if (args.size_accessor != null) {

            if (args.size_domain == null){
                min_size = d3.min(args.data[0], function(d){return d[args.size_accessor]});
                max_size = d3.max(args.data[0], function(d){return d[args.size_accessor]});
                size_domain = [min_size, max_size];
            } else {
                size_domain = args.size_domain;
            }
            if (args.size_range == null){
                size_range = [1,5];//args.size_domain;
            } else {
                size_range = args.size_range;
            }
            
            args.scales.size=d3.scale.linear().domain(size_domain).range(size_range).clamp(true);

            args.scalefns.size = function(di){
                return args.scales.size(di[args.size_accessor]);
            };
        }
    }

    var last_i;

    if(args.chart_type == 'line') {
        for(var i=0; i<args.data.length; i++) {
            last_i = args.data[i].length-1;

            if(args.data[i][0][args.x_accessor] < min_x || !min_x)
                min_x = args.data[i][0][args.x_accessor];

            if(args.data[i][last_i][args.x_accessor] > max_x || !max_x)
                max_x = args.data[i][last_i][args.x_accessor];
        }
    }
    else if(args.chart_type == 'point') {
        max_x = d3.max(args.data[0], function(d){return d[args.x_accessor]});
        min_x = d3.min(args.data[0], function(d){return d[args.x_accessor]});
    }
    else if(args.chart_type == 'histogram') {
        min_x = d3.min(args.data[0], function(d){return d[args.x_accessor]});
        max_x = d3.max(args.data[0], function(d){return d[args.x_accessor]});
        
        //force override xax_format
        //todo revisit to see if this makes sense        
        args.xax_format = function(f) {
            if (f < 1.0) {
                //don't scale tiny values
                return args.yax_units + d3.round(f, args.decimals);
            }
            else {
                var pf = d3.formatPrefix(f);
                return args.xax_units + pf.scale(f) + pf.symbol;
            }
        }
    }
    else if(args.chart_type == 'bar') {
        //min_x = d3.min(args.data[0], function(d){return d[args.value_accessor]});

        min_x = 0; // TODO: think about what actually makes sense.
        max_x = d3.max(args.data[0], function(d){
            var trio = [];
            trio.push(d[args.x_accessor]);

            if (args.baseline_accessor!=null){
                trio.push(d[args.baseline_accessor]);
            };

            if (args.predictor_accessor!=null){
                trio.push(d[args.predictor_accessor]);
            }

            return Math.max.apply(null, trio);
        }); //
        args.xax_format = function(f) {
            if (f < 1.0) {
                //don't scale tiny values
                return args.yax_units + d3.round(f, args.decimals);
            }
            else {
                var pf = d3.formatPrefix(f);
                return args.xax_units + pf.scale(f) + pf.symbol;
            }
        }
    }

    min_x = args.min_x ? args.min_x : min_x;
    max_x = args.max_x ? args.max_x : max_x;
    args.x_axis_negative = false;
    if (!args.time_series) {
        if (min_x < 0){
            min_x = min_x  - (max_x * (args.inflator-1));
            args.x_axis_negative = true;
        }
    }

    // this is for some charts that might need additional buffer, such as the bar chart.
    var additional_buffer;

    if (args.chart_type == 'bar'){
        additional_buffer = args.buffer*5;
    } else {
        additional_buffer = 0;
    }

    args.scales.X = (args.time_series) 
        ? d3.time.scale() 
        : d3.scale.linear();

    args.scales.X
        .domain([min_x, max_x])
        .range([args.left + args.buffer, args.width - args.right - args.buffer - additional_buffer]);

    //remove the old x-axis, add new one
    if($(args.target + ' svg .x-axis').length > 0) {
        $(args.target + ' svg .x-axis')
            .remove();
    }

    if (!args.x_axis) return this;

    //x axis
    g = svg.append('g')
        .classed('x-axis', true)
        .classed('x-axis-small', args.use_small_class);

    var last_i = args.scales.X.ticks(args.xax_count).length-1;

    //are we adding a label?
    if(args.x_label) {
        g.append('text')
            .attr('class', 'label')
            .attr('x', function() {
                return args.left + args.buffer
                    + ((args.width - args.right - args.buffer)
                        - (args.left + args.buffer)) / 2;
            })
            .attr('y', args.height - args.bottom / 2)
            .attr('dy', '.50em')
            .attr('text-anchor', 'middle')
            .text(function(d) {
                return args.x_label;
            })
    }

    if(args.chart_type != 'bar' && !args.x_extended_ticks && !args.y_extended_ticks) {
        //extend axis line across bottom, rather than from domain's min..max
        g.append('line')
            .attr('x1', 
                (args.concise == false || args.xax_count == 0)
                    ? args.left + args.buffer
                    : args.scales.X(args.scales.X.ticks(args.xax_count)[0])
            )
            .attr('x2', 
                (args.concise == false || args.xax_count == 0)
                    ? args.width - args.right - args.buffer
                    : args.scales.X(args.scales.X.ticks(args.xax_count)[last_i])
            )
            .attr('y1', args.height - args.bottom)
            .attr('y2', args.height - args.bottom);
    }

    //add x ticks
    g.selectAll('.xax-ticks')
        .data(args.scales.X.ticks(args.xax_count)).enter()
            .append('line')
                .attr('x1', args.scales.X)
                .attr('x2', args.scales.X)
                .attr('y1', args.height - args.bottom)
                .attr('y2', function() {
                    return (args.x_extended_ticks)
                        ? args.top
                        : args.height - args.bottom + args.xax_tick_length;
                })
                .attr('class', function() {
                    if(args.x_extended_ticks)
                        return 'extended-x-ticks';
                });

    g.selectAll('.xax-labels')
        .data(args.scales.X.ticks(args.xax_count)).enter()
            .append('text')
                .attr('x', args.scales.X)
                .attr('y', args.height - args.bottom + args.xax_tick_length * 7 / 3)
                .attr('dy', '.50em')
                .attr('text-anchor', 'middle')
                .text(function(d) {
                    return args.xax_units + args.xax_format(d);
                })

    //are we adding years to x-axis
    if (args.time_series && args.show_years) {
        var min_x;
        var max_x;

        for (var i=0; i<args.data.length; i++) {
            last_i = args.data[i].length-1;

            if(args.data[i][0][args.x_accessor] < min_x || !min_x)
                min_x = args.data[i][0][args.x_accessor];
            if(args.data[i][last_i][args.x_accessor] > max_x || !max_x)
                max_x = args.data[i][last_i][args.x_accessor];
        }

        var years = d3.time.years(min_x, max_x);

        if (years.length == 0){
            var first_tick = args.scales.X.ticks(args.xax_count)[0];
            years = [first_tick];
        }

        //append year marker to x-axis group
        g = g.append('g')
            .classed('year-marker', true)
            .classed('year-marker-small', args.use_small_class); 

        g.selectAll('.year_marker')
            .data(years).enter()
                .append('line')
                    .attr('x1', args.scales.X)
                    .attr('x2', args.scales.X)
                    .attr('y1', args.top)
                    .attr('y2', args.height - args.bottom);

        var yformat = d3.time.format('%Y');
        g.selectAll('.year_marker')
            .data(years).enter()
                .append('text')
                    .attr('x', args.scales.X)
                    .attr('y', args.height - args.bottom + args.xax_tick_length * 7 / 1.3)
                    .attr('dy', args.use_small_class ? -3 : 0)//(args.y_extended_ticks) ? 0 : 0 )
                    .attr('text-anchor', 'middle')
                    .text(function(d) {
                        return yformat(d);
                    });
    };    

    return this;
}

function init(args) {
    var defaults = {
        target: null,
        title: null,
        description: null
    };

    var args = arguments[0];
    if (!args) { args = {}; }
    args = merge_with_defaults(args, defaults);

    //this is how we're dealing with passing in a single array of data, 
    //but with the intention of using multiple values for multilines, etc.

    //do we have a time_series?
    if($.type(args.data[0][0][args.x_accessor]) == 'date') {
        args.time_series = true;
    }
    else {
        args.time_series = false;
    }

    var linked;

    var svg_width = args.width;
    var svg_height = args.height;

    if (args.chart_type=='bar' && svg_height == null){
        svg_height = args.height = args.data[0].length * args.bar_height + args.top + args.bottom;
    }
    //remove the svg if the chart type has changed
    if(($(args.target + ' svg .main-line').length > 0 && args.chart_type != 'line')
            || ($(args.target + ' svg .points').length > 0 && args.chart_type != 'point')
            || ($(args.target + ' svg .histogram').length > 0 && args.chart_type != 'histogram')
        ) {
        $(args.target).empty();

    }

    //add svg if it doesn't already exist
    if($(args.target).is(':empty')) {
        //add svg
        d3.select(args.target)
            .append('svg')
                .classed('linked', args.linked)
                .attr('width', svg_width)
                .attr('height', svg_height);
    }

    var svg = d3.select(args.target).selectAll('svg');

    //has the width or height changed?
    if(args.width != Number(svg.attr('width')))
        svg.attr('width', args.width)

    if(args.height != Number(svg.attr('height')))
        svg.attr('height', args.height)

    // remove missing class
    svg.classed('missing', false);
    // remove missing text
    svg.selectAll('.missing-text').remove();

    //add chart title if it's different than existing one
    chart_title(args);

    //draw axes
    args.use_small_class = args.height - args.top - args.bottom - args.buffer 
            <= args.small_height_threshold && args.width - args.left-args.right - args.buffer*2 
            <= args.small_width_threshold || args.small_text;

    //if we're updating an existing chart and we have fewer lines than
    //before, remove the outdated lines, e.g. if we had 3 lines, and we're calling
    //data_graphic() on the same target with 2 lines, remove the 3rd line
    if(args.data.length < $(args.target + ' svg .main-line').length) {
        //now, the thing is we can't just remove, say, line3 if we have a custom
        //line-color map, instead, see which are the lines to be removed, and delete those    
        if(args.custom_line_color_map.length > 0) {
            var array_full_series = function(len) {
                var arr = new Array(len);
                for(var i=0;i<arr.length;i++) { arr[i] = i+1; }
                return arr;
            }

            //get an array of lines ids to remove
            var lines_to_remove = arrDiff(
                array_full_series(args.max_data_size), 
                args.custom_line_color_map);

            for(var i=0; i<lines_to_remove.length; i++) {
                $(args.target + ' svg .main-line.line' + lines_to_remove[i] + '-color')
                    .remove();
            }
        }
        //if we don't have a customer line-color map, just remove the lines from the end
        else {
            var num_of_new = args.data.length;
            var num_of_existing = $(args.target + ' svg .main-line').length;

            for(var i=num_of_existing; i>num_of_new; i--) {
                $(args.target + ' svg .main-line.line' + i + '-color').remove();
            }
        }
    }

    return this;
}

function markers(args) {
    var svg = d3.select(args.target + ' svg');
    var gm;
    var gb;

    if(args.markers) {
        if($(args.target + ' svg .markers').length > 0) {
            $(args.target + ' svg .markers')
                .remove();
        }

        gm = svg.append('g')
            .attr('class', 'markers');

        gm.selectAll('.markers')
            .data(args.markers.filter(function(d){
                return (args.scales.X(d[args.x_accessor]) > args.buffer + args.left)
                    && (args.scales.X(d[args.x_accessor]) < args.width - args.buffer - args.right);
            }))
            .enter()
            .append('line')
                .attr('x1', function(d) {
                    return args.scales.X(d[args.x_accessor])
                })
                .attr('x2', function(d) {
                    return args.scales.X(d[args.x_accessor])
                })
                .attr('y1', args.top)
                .attr('y2', function() {
                    return args.height - args.bottom - args.buffer;
                })
                .attr('stroke-dasharray', '3,1');

        gm.selectAll('.markers')
            .data(args.markers.filter(function(d){
                return (args.scales.X(d[args.x_accessor]) > args.buffer + args.left)
                    && (args.scales.X(d[args.x_accessor]) < args.width - args.buffer - args.right);
            }))
            .enter()
            .append('text')
                .attr('x', function(d) {
                    return args.scales.X(d[args.x_accessor])
                })
                .attr('y', args.top - 8)
                .attr('text-anchor', 'middle')
                .text(function(d) {
                    return d['label'];
                });
    }

    if(args.baselines) {
        svg.selectAll('.baselines').remove();
        gb = svg.append('g')
            .attr('class', 'baselines');

        gb.selectAll('.baselines')
            .data(args.baselines)
            .enter().append('line')
                .attr('x1', args.left + args.buffer)
                .attr('x2', args.width-args.right-args.buffer)
                .attr('y1', function(d){
                    return args.scales.Y(d['value'])})
                .attr('y2', function(d){return args.scales.Y(d['value'])});

        gb.selectAll('.baselines')
            .data(args.baselines)
            .enter().append('text')
                .attr('x', args.width-args.right - args.buffer)
                .attr('y', function(d){return args.scales.Y(d['value'])})
                .attr('dy', -3)
                .attr('text-anchor', 'end')
                .text(function(d) {
                    return d['label'];
                });
    }

    return this;
}

var button_layout = function(target) {
    this.target = target;
    this.feature_set = {};
    this.public_name = {};
    this.sorters = {};
    this.manual = [];
    this.manual_map = {};
 