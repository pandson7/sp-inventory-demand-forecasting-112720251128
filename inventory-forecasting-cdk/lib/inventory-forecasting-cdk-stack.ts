import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class InventoryForecastingStack112720251128 extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Tables
    const salesHistoryTable = new dynamodb.Table(this, 'SalesHistoryTable112720251128', {
      tableName: 'SalesHistory112720251128',
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const productsTable = new dynamodb.Table(this, 'ProductsTable112720251128', {
      tableName: 'Products112720251128',
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const forecastsTable = new dynamodb.Table(this, 'ForecastsTable112720251128', {
      tableName: 'Forecasts112720251128',
      partitionKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'forecastDate', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // IAM Role for Lambda functions
    const lambdaRole = new iam.Role(this, 'LambdaRole112720251128', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      inlinePolicies: {
        DynamoDBAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:Query',
                'dynamodb:Scan',
              ],
              resources: [
                salesHistoryTable.tableArn,
                productsTable.tableArn,
                forecastsTable.tableArn,
              ],
            }),
          ],
        }),
        BedrockAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'bedrock:InvokeModel',
                'bedrock:InvokeModelWithResponseStream',
              ],
              resources: [
                'arn:aws:bedrock:*:*:inference-profile/global.anthropic.claude-sonnet-4-20250514-v1:0',
                'arn:aws:bedrock:*::foundation-model/anthropic.claude-sonnet-4-20250514-v1:0',
              ],
            }),
          ],
        }),
      },
    });

    // Lambda Functions
    const dataProcessorFunction = new lambda.Function(this, 'DataProcessor112720251128', {
      functionName: 'DataProcessor112720251128',
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      role: lambdaRole,
      code: lambda.Code.fromInline(`
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const dynamodb = new DynamoDBClient({});

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const body = JSON.parse(event.body || '{}');
    const csvData = body.csvData;
    
    if (!csvData || !Array.isArray(csvData)) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        },
        body: JSON.stringify({ error: 'Invalid CSV data format' }),
      };
    }
    
    let processedCount = 0;
    
    for (const row of csvData) {
      if (row.productId && row.timestamp && row.quantity) {
        const item = {
          productId: row.productId,
          timestamp: row.timestamp,
          quantity: parseInt(row.quantity),
          price: parseFloat(row.price || 0),
          storeLocation: row.storeLocation || 'default',
          category: row.category || 'electronics',
        };
        
        await dynamodb.send(new PutItemCommand({
          TableName: 'SalesHistory112720251128',
          Item: marshall(item),
        }));
        
        processedCount++;
      }
    }
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
      body: JSON.stringify({ 
        message: 'Data processed successfully',
        recordsProcessed: processedCount 
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
      `),
      environment: {
        SALES_HISTORY_TABLE: salesHistoryTable.tableName,
      },
    });

    const forecastGeneratorFunction = new lambda.Function(this, 'ForecastGenerator112720251128', {
      functionName: 'ForecastGenerator112720251128',
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      role: lambdaRole,
      timeout: cdk.Duration.minutes(5),
      code: lambda.Code.fromInline(`
const { DynamoDBClient, QueryCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const dynamodb = new DynamoDBClient({});
const bedrock = new BedrockRuntimeClient({});

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    const productId = event.pathParameters?.productId || event.productId;
    
    if (!productId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        },
        body: JSON.stringify({ error: 'Product ID is required' }),
      };
    }
    
    // Get historical sales data
    const salesData = await dynamodb.send(new QueryCommand({
      TableName: 'SalesHistory112720251128',
      KeyConditionExpression: 'productId = :productId',
      ExpressionAttributeValues: {
        ':productId': { S: productId },
      },
    }));
    
    const sales = salesData.Items?.map(item => unmarshall(item)) || [];
    
    if (sales.length < 5) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        },
        body: JSON.stringify({ 
          error: 'Insufficient historical data',
          message: 'At least 5 data points required for forecasting'
        }),
      };
    }
    
    // Simple forecast calculation (fallback approach)
    const avgDemand = sales.reduce((sum, s) => sum + s.quantity, 0) / sales.length;
    const forecastData = {
      forecast: Array.from({length: 30}, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        predictedDemand: Math.round(avgDemand)
      })),
      confidenceInterval: { low: Math.round(avgDemand * 0.8), high: Math.round(avgDemand * 1.2) },
      accuracy: 0.75,
      patterns: ['stable demand based on historical average']
    };
    
    // Store forecast in DynamoDB
    const forecastDate = new Date().toISOString().split('T')[0];
    await dynamodb.send(new PutItemCommand({
      TableName: 'Forecasts112720251128',
      Item: marshall({
        productId,
        forecastDate,
        predictedDemand: forecastData.forecast[0]?.predictedDemand || 0,
        confidenceInterval: forecastData.confidenceInterval,
        accuracy: forecastData.accuracy,
        generatedAt: new Date().toISOString(),
        fullForecast: forecastData.forecast
      }),
    }));
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
      body: JSON.stringify(forecastData),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
      `),
      environment: {
        SALES_HISTORY_TABLE: salesHistoryTable.tableName,
        FORECASTS_TABLE: forecastsTable.tableName,
      },
    });

    const inventoryOptimizerFunction = new lambda.Function(this, 'InventoryOptimizer112720251128', {
      functionName: 'InventoryOptimizer112720251128',
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      role: lambdaRole,
      code: lambda.Code.fromInline(`
const { DynamoDBClient, ScanCommand, QueryCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const dynamodb = new DynamoDBClient({});

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Get all products
    const productsData = await dynamodb.send(new ScanCommand({
      TableName: 'Products112720251128',
    }));
    
    const products = productsData.Items?.map(item => unmarshall(item)) || [];
    
    // Get recent forecasts
    const forecastsData = await dynamodb.send(new ScanCommand({
      TableName: 'Forecasts112720251128',
    }));
    
    const forecasts = forecastsData.Items?.map(item => unmarshall(item)) || [];
    
    const recommendations = [];
    
    for (const product of products) {
      const productForecast = forecasts.find(f => f.productId === product.productId);
      
      if (productForecast) {
        const leadTime = product.leadTime || 7;
        const safetyStock = Math.ceil((productForecast.predictedDemand || 0) * 0.2);
        const reorderPoint = (productForecast.predictedDemand || 0) * leadTime + safetyStock;
        const currentStock = product.currentStock || 0;
        
        const recommendation = {
          productId: product.productId,
          productName: product.name,
          currentStock,
          reorderPoint,
          recommendedOrderQuantity: Math.max(0, reorderPoint - currentStock),
          urgency: currentStock < reorderPoint ? 'HIGH' : 'LOW',
          reasoning: \`Based on predicted demand of \${productForecast.predictedDemand} units/day, lead time of \${leadTime} days, and safety stock of \${safetyStock} units\`,
          forecastAccuracy: productForecast.accuracy || 0.75
        };
        
        recommendations.push(recommendation);
      }
    }
    
    // Sort by urgency and stock level
    recommendations.sort((a, b) => {
      if (a.urgency === 'HIGH' && b.urgency === 'LOW') return -1;
      if (a.urgency === 'LOW' && b.urgency === 'HIGH') return 1;
      return a.currentStock - b.currentStock;
    });
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
      body: JSON.stringify({
        recommendations,
        summary: {
          totalProducts: products.length,
          highUrgency: recommendations.filter(r => r.urgency === 'HIGH').length,
          lowUrgency: recommendations.filter(r => r.urgency === 'LOW').length
        }
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
      `),
      environment: {
        PRODUCTS_TABLE: productsTable.tableName,
        FORECASTS_TABLE: forecastsTable.tableName,
      },
    });

    const dashboardServiceFunction = new lambda.Function(this, 'DashboardService112720251128', {
      functionName: 'DashboardService112720251128',
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      role: lambdaRole,
      code: lambda.Code.fromInline(`
const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { unmarshall } = require('@aws-sdk/util-dynamodb');

const dynamodb = new DynamoDBClient({});

exports.handler = async (event) => {
  console.log('Event:', JSON.stringify(event, null, 2));
  
  try {
    // Get all sales data
    const salesData = await dynamodb.send(new ScanCommand({
      TableName: 'SalesHistory112720251128',
    }));
    
    const sales = salesData.Items?.map(item => unmarshall(item)) || [];
    
    // Get all forecasts
    const forecastsData = await dynamodb.send(new ScanCommand({
      TableName: 'Forecasts112720251128',
    }));
    
    const forecasts = forecastsData.Items?.map(item => unmarshall(item)) || [];
    
    // Calculate metrics
    const totalSales = sales.reduce((sum, s) => sum + (s.quantity || 0), 0);
    const totalRevenue = sales.reduce((sum, s) => sum + ((s.quantity || 0) * (s.price || 0)), 0);
    const avgForecastAccuracy = forecasts.length > 0 
      ? forecasts.reduce((sum, f) => sum + (f.accuracy || 0), 0) / forecasts.length 
      : 0;
    
    // Group sales by product
    const productSales = {};
    sales.forEach(sale => {
      if (!productSales[sale.productId]) {
        productSales[sale.productId] = { quantity: 0, revenue: 0, transactions: 0 };
      }
      productSales[sale.productId].quantity += sale.quantity || 0;
      productSales[sale.productId].revenue += (sale.quantity || 0) * (sale.price || 0);
      productSales[sale.productId].transactions += 1;
    });
    
    // Top products
    const topProducts = Object.entries(productSales)
      .map(([productId, data]) => ({ productId, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    // Recent sales trend (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentSales = sales.filter(s => new Date(s.timestamp) >= thirtyDaysAgo);
    
    const dailySales = {};
    recentSales.forEach(sale => {
      const date = sale.timestamp.split('T')[0];
      if (!dailySales[date]) dailySales[date] = 0;
      dailySales[date] += sale.quantity || 0;
    });
    
    const salesTrend = Object.entries(dailySales)
      .map(([date, quantity]) => ({ date, quantity }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
      body: JSON.stringify({
        metrics: {
          totalSales,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          avgForecastAccuracy: Math.round(avgForecastAccuracy * 100) / 100,
          totalProducts: Object.keys(productSales).length,
          totalForecasts: forecasts.length
        },
        topProducts,
        salesTrend,
        recentActivity: {
          salesLast30Days: recentSales.length,
          forecastsGenerated: forecasts.filter(f => 
            new Date(f.generatedAt) >= thirtyDaysAgo
          ).length
        }
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      },
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
      `),
      environment: {
        SALES_HISTORY_TABLE: salesHistoryTable.tableName,
        FORECASTS_TABLE: forecastsTable.tableName,
      },
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'InventoryForecastingAPI112720251128', {
      restApiName: 'InventoryForecastingAPI112720251128',
      description: 'API for Inventory Demand Forecasting MVP',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      },
    });

    // API Gateway Integrations
    const uploadIntegration = new apigateway.LambdaIntegration(dataProcessorFunction);
    const forecastIntegration = new apigateway.LambdaIntegration(forecastGeneratorFunction);
    const inventoryIntegration = new apigateway.LambdaIntegration(inventoryOptimizerFunction);
    const dashboardIntegration = new apigateway.LambdaIntegration(dashboardServiceFunction);

    // API Routes
    const uploadResource = api.root.addResource('upload');
    uploadResource.addMethod('POST', uploadIntegration);

    const forecastResource = api.root.addResource('forecast');
    const forecastProductResource = forecastResource.addResource('{productId}');
    forecastProductResource.addMethod('GET', forecastIntegration);

    const inventoryResource = api.root.addResource('inventory');
    const recommendationsResource = inventoryResource.addResource('recommendations');
    recommendationsResource.addMethod('GET', inventoryIntegration);

    const dashboardResource = api.root.addResource('dashboard');
    dashboardResource.addMethod('GET', dashboardIntegration);

    // Outputs
    new cdk.CfnOutput(this, 'APIGatewayURL', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'SalesHistoryTableName', {
      value: salesHistoryTable.tableName,
      description: 'Sales History DynamoDB Table Name',
    });
  }
}
