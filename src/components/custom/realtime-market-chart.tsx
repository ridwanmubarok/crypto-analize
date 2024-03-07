import { useIndodax } from '@/app/hooks/useIndodax';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const RealTimeMarketChart = ({ currency_id }: { currency_id: string }) => {
    const { chartData } = useIndodax({ InitchartTick: true, pair_id: currency_id });
    const series = [{
      name: "Price",
      data: chartData.series[0].data.map(item => ({
          x: item.x,
          y: item.y
      }))
    }];

    // Function to format number as IDR currency
    const formatIDR = (value: number) => {
      return `Rp ${value.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    };

    const options: ApexOptions = {
      chart: {
          height: 350,
          type: 'line',
      },
      title: {
          text: `Price Chart for ${currency_id.toUpperCase()}`,
          align: 'left'
      },
      xaxis: {
          type: 'datetime'
      },
      yaxis: {
          labels: {
              formatter: function (value) {
                return formatIDR(value);
              }
          }
      },
      tooltip: {
          x: {
              format: 'dd MMM yyyy HH:mm'
          },
          y: {
              formatter: function (value) {
                return formatIDR(value);
              }
          }
      },
      stroke: {
          curve: 'smooth'
      },
    };

    return (
        <div>
            <ReactApexChart options={options} series={series} height={750}/>
        </div>
    );
};
export default RealTimeMarketChart;
