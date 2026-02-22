import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import {
    LineChart,
    BarChart,
    PieChart,
    HeatmapChart
} from 'echarts/charts'
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    VisualMapComponent,
    GraphicComponent
} from 'echarts/components'

use([
    CanvasRenderer,
    LineChart,
    BarChart,
    PieChart,
    HeatmapChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    VisualMapComponent,
    GraphicComponent
])
