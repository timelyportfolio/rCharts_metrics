library(rCharts)
library(jsonlite)
library(quantmod)
library(pipeR)

#set up rCharts
#key is to define how to handle the data
rChartsMetrics <- setRefClass(
  'rChartsMetrics',
  contains = 'Dimple',
  methods = list(
    initialize = function(){
      callSuper(); 
    },
    getPayload = function (chartId) {
      # use jsonlite
      if(is.xts(params$data)){
        data = jsonlite::toJSON( data.frame(
          date = format(index(params$data))
          ,params$data
        ))
      } else {
        data = jsonlite::toJSON( params$data )
      }
      
      chart = toChain(params$chart, 'myChart')
      opts = toJSON2(params[!(names(params) %in% c('data', 'chart'))])
      list(opts = opts, data = data, chart = chart, chartId = chartId)
    },
    render = function (chartId = NULL, cdn = F, static = T, standalone = F) 
    {
      params$dom <<- chartId %||% params$dom
      params$height <<- params$options$height
      params$width <<- params$options$width
      template = read_template(getOption("RCHART_TEMPLATE", templates$page))
      assets = Map("c", get_assets(LIB, static = static, cdn = cdn, 
                                   standalone = standalone), html_assets)
      html = render_template(
        template
        , list(
          params = params
          , assets = assets
          , chartId = params$dom
          , width = params$options$width
          , height = params$options$height
          , script = .self$html(params$dom)
          , CODE = srccode
          , lib = LIB$name
          , tObj = tObj
          , container = container
        )
        , partials = list(
          chartDiv = templates$chartDiv
          , afterScript = templates$afterScript %||% "<script></script>"
        )
      )
    }
  )
)

# now make a rChart with our rChartsMetrics

rM <- rChartsMetrics$new()
rM$setLib('http://timelyportfolio.github.io/rCharts_metrics')
#rM$setLib('.')
rM$lib = 'metrics'
rM$LIB$name = 'metrics'
rM$setTemplate(
  script = "
    <script>

    var opts = {{{ opts }}};
    opts.options.data =  {{{ data }}};

    opts.options.target = '#' + opts.dom

    //handle date data - crude but works for now
    if( opts.options.x_accessor === 'date' && typeof opts.options.data[0][opts.options.x_accessor] ) {
      opts.options.data = convert_dates( opts.options.data, 'date' );
    }
    
    data_graphic(
      opts.options
    )
    </script>
  "
)


rM$set(
  data = jsonlite::fromJSON("http://metricsgraphicsjs.org/data/ufo-sightings.json")
  ,options = list(
    x_accessor = "year"
    ,y_accessor = "sightings"
    ,width = 600
    ,height = 400
    ,title = 'UFO Sightings'
  )
)
rM

#rM$publish( "rCharts + metrics.js", id = "b826d93166334528f226" )

rM <- rChartsMetrics$new()
rM$setLib('http://timelyportfolio.github.io/rCharts_metrics')
#rM$setLib('.')
rM$lib = 'metrics'
rM$LIB$name = 'metrics'
rM$setTemplate(
  script = "
    <script>

    var opts = {{{ opts }}};
    opts.options.data =  {{{ data }}};

    opts.options.target = '#' + opts.dom

    //handle date data - crude but works for now
    if( opts.options.x_accessor === 'date' && typeof opts.options.data[0][opts.options.x_accessor] ) {
      opts.options.data = convert_dates( opts.options.data, 'date' );
    }
    
    data_graphic(
      opts.options
    )
    </script>
  "
)



rM$set(
  data = na.omit(getSymbols('DGS10',src = 'FRED', auto.assign = F)["2010::",])
  ,options = list(
    x_accessor = "date"
    ,y_accessor = "DGS10"
    ,width = 600
    ,height = 400
    ,title = 'US 10y Yield (source: St. Louis Federal Reserve)'
  )
)
rM


rM$set(
  options = list(
    area = FALSE
    # if confidence band in data columns such as l for lower and u for upper
    #,show_confidence_band =  "#!['l', 'u']!#"
  )
)
rM

rM <- rChartsMetrics$new()
rM$setLib('http://timelyportfolio.github.io/rCharts_metrics')
#rM$setLib('.')
rM$lib = 'metrics'
rM$LIB$name = 'metrics'
rM$setTemplate(
  script = "
  <script>
  
  var opts = {{{ opts }}};
  opts.options.data =  {{{ data }}};
  
  opts.options.target = '#' + opts.dom
  
  //handle date data - crude but works for now
  if( opts.options.x_accessor === 'date' && typeof opts.options.data[0][opts.options.x_accessor] ) {
  opts.options.data = convert_dates( opts.options.data, 'date' );
  }
  
  data_graphic(
  opts.options
  )
  </script>
  "
)

rM$set(
  data = data.frame( mtcars )
  ,options = list(
    chart_type = 'point'
    ,title = 'mtcars from R'
    ,x_accessor = 'hp'
    ,y_accessor = 'mpg'
    ,color_accessor = 'cyl'
    ,color_type = 'category'
    ,y_rug = T
    ,x_rug = T
    ,height=400
    ,width=400
    ,least_squares = T
  )
)
rM
#rM$publish ( "rCharts + metrics.js using mtcars")
