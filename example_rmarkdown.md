# quick example of rCharts,metrics.js,rmarkdown
timelyportfolio  
Thursday, November 13, 2014  

<div id = 'metrics_chart' style= 'height:450px; width:600px'><svg></svg></div>



```r
library(xts)
library(rCharts)
library(jsonlite)
library(htmltools)
```


```r
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
```


```r
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
  dom = 'metrics_chart'
  ,data = jsonlite::fromJSON("http://metricsgraphicsjs.org/data/ufo-sightings.json")
  ,options = list(
    x_accessor = "year"
    ,y_accessor = "sightings"
    ,width = 600
    ,height = 400
    ,title = 'UFO Sightings'
  )
)
```


```r
#HTML(
#  sprintf(
#    "<div id = '%s' style= 'height:%spx; width:%spx'><svg></svg></div>"
#    ,rM$params$dom
#    ,rM$params$options$height + 50
#    ,rM$params$options$width
#  )
#)
HTML(rM$html())
```

<!--html_preserve-->
    <script>

    var opts = {
 "dom": "metrics_chart",
"width":    800,
"height":    400,
"xAxis": {
 "type": "addCategoryAxis",
"showPercent": false 
},
"yAxis": {
 "type": "addMeasureAxis",
"showPercent": false 
},
"zAxis": [],
"colorAxis": [],
"defaultColors": [],
"layers": [],
"legend": [],
"controls": [],
"filters": [],
"options": {
 "x_accessor": "year",
"y_accessor": "sightings",
"width":    600,
"height":    400,
"title": "UFO Sightings" 
},
"id": "metrics_chart" 
};
    opts.options.data =  [{"year":"1945","sightings":6},{"year":"1946","sightings":8},{"year":"1947","sightings":34},{"year":"1948","sightings":8},{"year":"1949","sightings":15},{"year":"1950","sightings":25},{"year":"1951","sightings":20},{"year":"1952","sightings":48},{"year":"1953","sightings":34},{"year":"1954","sightings":50},{"year":"1955","sightings":31},{"year":"1956","sightings":38},{"year":"1957","sightings":67},{"year":"1958","sightings":40},{"year":"1959","sightings":47},{"year":"1960","sightings":64},{"year":"1961","sightings":39},{"year":"1962","sightings":55},{"year":"1963","sightings":75},{"year":"1964","sightings":77},{"year":"1965","sightings":167},{"year":"1966","sightings":169},{"year":"1967","sightings":178},{"year":"1968","sightings":183},{"year":"1969","sightings":138},{"year":"1970","sightings":126},{"year":"1971","sightings":110},{"year":"1972","sightings":146},{"year":"1973","sightings":209},{"year":"1974","sightings":241},{"year":"1975","sightings":279},{"year":"1976","sightings":246},{"year":"1977","sightings":239},{"year":"1978","sightings":301},{"year":"1979","sightings":221},{"year":"1980","sightings":211},{"year":"1981","sightings":146},{"year":"1982","sightings":182},{"year":"1983","sightings":132},{"year":"1984","sightings":172},{"year":"1985","sightings":192},{"year":"1986","sightings":173},{"year":"1987","sightings":193},{"year":"1988","sightings":203},{"year":"1989","sightings":220},{"year":"1990","sightings":217},{"year":"1991","sightings":210},{"year":"1992","sightings":228},{"year":"1993","sightings":285},{"year":"1994","sightings":381},{"year":"1995","sightings":1336},{"year":"1996","sightings":862},{"year":"1997","sightings":1248},{"year":"1998","sightings":1812},{"year":"1999","sightings":2906},{"year":"2000","sightings":2780},{"year":"2001","sightings":3105},{"year":"2002","sightings":3176},{"year":"2003","sightings":3896},{"year":"2004","sightings":4208},{"year":"2005","sightings":3996},{"year":"2006","sightings":3590},{"year":"2007","sightings":4195},{"year":"2008","sightings":4705},{"year":"2009","sightings":4297},{"year":"2010","sightings":2531}];

    opts.options.target = '#' + opts.dom

    //handle date data - crude but works for now
    if( opts.options.x_accessor === 'date' && typeof opts.options.data[0][opts.options.x_accessor] ) {
      opts.options.data = convert_dates( opts.options.data, 'date' );
    }
    
    data_graphic(
      opts.options
    )
    </script>
  <!--/html_preserve-->
