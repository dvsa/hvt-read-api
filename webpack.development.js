const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');

const GETALL_LAMBDA_NAME = "GetAllLambdaFunction";
const GET_LAMBDA_NAME = "GetLambdaFunction";

module.exports = merge(common, {
  mode: 'development',
  devtool: 'source-map',
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './.env', to: `.aws-sam/build/${GETALL_LAMBDA_NAME}/` },
        { from: './.env', to: `.aws-sam/build/${GET_LAMBDA_NAME}/` },
      ],
    }),
  ]
});
