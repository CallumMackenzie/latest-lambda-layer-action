const core = require('@actions/core');
const github = require('@actions/github');
import Lambda from 'aws-sdk/clients/lambda';

const run = async () => {
	try {
		// Extract name
		const lambda_function_name = core.getInput('function_name', { required: true });
		const lambda_config = {
			accessKeyId: core.getInput('aws_access_key_id', { required: true }),
			apiVersion: '2015-03-31',
			maxRetries: 2,
			region: core.getInput('aws_region', { required: true }),
			secretAccessKey: core.getInput('aws_secret_access_key', { required: true }),
			sslEnabled: true
		};

		// Create lambda API client
		const lambda = new Lambda(lambda_config);

		core.info("Getting lambda layers for function");


		const lambda_function_data = await lambda.getFunctionConfiguration({
			FunctionName: "arn:aws:lambda:" + lambda_config.region + "::function:" + lambda_function_name,
		}).promise();

		core.info("Received lambda function information.");
		const new_layer_list = [];
		await lambda_function_data.Layers.forEach(async (layer, index, arr) => {
			const lambda_layer_data = await lambda.listLayerVersions({
				LayerName: layer.Arn
			}).promise();
			core.info("Recieved lambda versions for layer (" + index + "/" + arr.length + ")");

			const target_layer = lambda_layer_data.LayerVersions.sort((a, b) => b.Version - a.Version)[0];
			new_layer_list.push(target_layer.LayerVersionArn);
		}).promise();

		core.info("Updating function layers");
		const update_lambda_config = await lambda.updateFunctionConfiguration({
			FunctionName: lambda_function_name,
			Layers: new_layer_list
		}).promise();

		core.info("Layer update success");
	} catch (error) {
		core.setFailed(error.message);
	}
};

run();