library(rCharts)
library(jsonlite)
library(xts)

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
      data = jsonlite::toJSON( params$data )
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


# now make a rChart with our rpart

rM <- rChartsMetrics$new()
#rM$setLib('http://timelyportfolio.github.io/rCharts_metrics')
rM$setLib('.')
rM$lib = 'metrics'
rM$LIB$name = 'metrics'
rM$setTemplate(
  script = "
    <script>

    var opts = {{{ opts }}};
    opts.options.data =  {{{ data }}};
    opts.options.target = '#' + opts.dom
    
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

#rM$publish( "rCharts + metrics.js" )



