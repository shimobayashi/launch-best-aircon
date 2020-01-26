import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
export async function lambdaHandler (event, context) {
    try {
        // 現在の室温を取得する。
        let currentTemperature:number;
        fetchCurrentTemperature: {
            const now:number = Math.floor(Date.now() / 1000);
            const ret:AxiosResponse = await axios({
                url: 'https://api.mackerelio.com/api/v0/services/home/metrics',
                params: {
                    name: 'natureremo.temperature.Remo',
                    // Mackerel内部では300秒ごとに値を保存しているようで、最新の値以外は要らないのでfromには300秒前を指定。
                    from: now - 300,
                    to:   now,
                },
                headers: {'X-Api-Key': process.env.MACKEREL_API_KEY},
            } as AxiosRequestConfig);
            currentTemperature = ret.data['metrics'].slice(-1)[0]['value'];
        }

        // 室温に応じて適切にエアコンを操作する。
        let message:string = 'Nothing to do';
        if (currentTemperature < 18.0) {
            const ret:AxiosResponse = await axios(`https://maker.ifttt.com/trigger/aircon_on_heater/with/key/${process.env.IFTTT_API_KEY}`);
            message = ret.data.trim();
        } else if (currentTemperature >= 30.0) {
            const ret:AxiosResponse = await axios(`https://maker.ifttt.com/trigger/aircon_on_cooler/with/key/${process.env.IFTTT_API_KEY}`);
            message = ret.data.trim();
        }

        response = {
            'statusCode': 200,
            'body': JSON.stringify({
                message: message,
            })
        }
    } catch (err) {
        console.log(err);
        return err;
    }

    return response
}