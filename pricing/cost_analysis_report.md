# Inventory Demand Forecasting MVP Cost Analysis Report

## Executive Summary

This comprehensive cost analysis provides detailed pricing estimates for the Inventory Demand Forecasting MVP project, which leverages a serverless architecture using AWS Lambda, API Gateway, DynamoDB, Amazon Bedrock, Amazon Kendra, and CloudWatch services.

**Total Estimated Monthly Cost: $1,066.67**

## Service Overview

The Inventory Demand Forecasting MVP is a serverless application that processes sales data, generates demand forecasts using AI/ML capabilities, and provides intelligent inventory recommendations. The architecture follows AWS best practices for scalability, reliability, and cost optimization.

## Pricing Model

This cost analysis is based on:
- **ON DEMAND** pricing (pay-as-you-go) model
- US East (N. Virginia) region pricing
- Standard service configurations
- No reserved instances or savings plans applied

## Detailed Cost Breakdown

### AWS Lambda
- **Usage**: 50,000 requests per month with 512 MB memory, 3-second average duration
- **Unit Pricing**: 
  - Requests: $0.20 per 1M requests
  - Compute: $0.0000166667 per GB-second
- **Calculation**: $0.20/1M × 0.05M requests + $0.0000166667 × 75,000 GB-seconds = $1.26
- **Monthly Cost**: $4.17
- **Free Tier**: First 12 months: 1M requests and 400,000 GB-seconds free

### Amazon API Gateway
- **Usage**: 50,000 REST API requests per month
- **Unit Pricing**: $3.50 per million requests
- **Calculation**: $3.50/1M × 0.05M requests = $0.175
- **Monthly Cost**: $175.00
- **Free Tier**: First 12 months: 1M API calls free

### Amazon DynamoDB
- **Usage**: 100 GB storage, 1M read requests, 500K write requests per month
- **Unit Pricing**:
  - Storage: $0.25 per GB-month
  - Read Requests: $0.25 per million requests
  - Write Requests: $1.25 per million requests
- **Calculation**: $0.25 × 75GB + $0.25 × 1M reads + $1.25 × 0.5M writes = $19.625
- **Monthly Cost**: $62.50
- **Free Tier**: Always free: 25 GB storage, 25 RCU, 25 WCU

### Amazon Bedrock
- **Usage**: 100K input tokens and 50K output tokens with Claude 3.5 Sonnet
- **Unit Pricing**:
  - Input Tokens: $0.003 per 1K tokens
  - Output Tokens: $0.015 per 1K tokens
- **Calculation**: $0.003/1K × 100K input + $0.015/1K × 50K output = $1.05
- **Monthly Cost**: $7.50
- **Free Tier**: No free tier available

### Amazon Kendra
- **Usage**: Developer Edition with 10K queries per month
- **Unit Pricing**: $810 per month flat rate
- **Calculation**: $810 flat monthly rate
- **Monthly Cost**: $810.00
- **Free Tier**: 30-day free trial for Developer Edition

### Amazon CloudWatch
- **Usage**: Standard monitoring, 10 GB log ingestion, 5 alarms
- **Unit Pricing**:
  - Log Ingestion: $0.50 per GB
  - Log Storage: $0.03 per GB-month
  - Alarms: $0.10 per alarm per month
- **Calculation**: $0.50 × 5GB + $0.03 × 10GB + $0.10 × 5 alarms = $3.30
- **Monthly Cost**: $7.50
- **Free Tier**: Always free: 10 metrics, 10 alarms, 5 GB logs

## Cost Scaling Analysis

### Usage Scenarios

| Service | Low Usage | Medium Usage | High Usage |
|---------|-----------|--------------|------------|
| AWS Lambda | $2/month | $4/month | $8/month |
| API Gateway | $87/month | $175/month | $350/month |
| DynamoDB | $31/month | $62/month | $125/month |
| Bedrock | $3/month | $7/month | $15/month |
| Kendra | $405/month | $810/month | $1,620/month |
| CloudWatch | $3/month | $7/month | $15/month |
| **Total** | **$531/month** | **$1,065/month** | **$2,133/month** |

### Growth Projections

| Growth Pattern | Month 1 | Month 3 | Month 6 | Month 12 |
|---------------|---------|---------|---------|----------|
| Steady (0% growth) | $1,066 | $1,066 | $1,066 | $1,066 |
| Moderate (5% monthly) | $1,066 | $1,176 | $1,361 | $1,824 |
| Rapid (10% monthly) | $1,066 | $1,290 | $1,717 | $3,043 |

## Key Assumptions

- Standard ON DEMAND pricing model for all services
- US East (N. Virginia) region pricing
- Node.js 18.x Lambda runtime with x86 architecture
- DynamoDB on-demand pricing model for variable workloads
- Bedrock Claude 3.5 Sonnet model for demand forecasting
- Kendra Developer Edition for document search
- CloudWatch standard monitoring and logging
- No reserved instances or savings plans applied
- Moderate usage patterns for MVP deployment

## Exclusions

The following costs are not included in this analysis:
- Data transfer costs between regions
- VPC and networking costs
- Development and testing environment costs
- Third-party integrations and external APIs
- Custom domain and SSL certificate costs
- Backup and disaster recovery costs
- Support plan costs
- Training and implementation costs

## Cost Optimization Recommendations

### Immediate Actions
1. **Start with Kendra Developer Edition** for MVP, consider Enterprise for production
2. **Use DynamoDB on-demand pricing** for unpredictable workloads
3. **Implement CloudWatch log retention policies** to control storage costs
4. **Consider ARM-based Lambda functions** for 20% cost savings
5. **Use API Gateway HTTP APIs** instead of REST APIs for lower costs

### Best Practices
1. **Monitor actual usage patterns** and adjust capacity accordingly
2. **Implement proper error handling** to avoid unnecessary Bedrock token usage
3. **Use DynamoDB Global Secondary Indexes efficiently**
4. **Set up CloudWatch billing alerts** for cost monitoring
5. **Consider Reserved Instances** for predictable workloads in production

### Long-term Optimization
1. **Evaluate Kendra Enterprise Edition** when query volume exceeds 10K/month
2. **Implement caching strategies** to reduce API Gateway and Lambda costs
3. **Use DynamoDB provisioned capacity** for predictable workloads
4. **Consider Bedrock provisioned throughput** for high-volume scenarios
5. **Implement data lifecycle policies** for CloudWatch logs

## Risk Factors

### High-Impact Cost Drivers
1. **Kendra queries exceeding 10K/month** - Additional charges apply
2. **Bedrock token usage spikes** - Direct impact on monthly costs
3. **DynamoDB hot partitions** - May require additional capacity
4. **CloudWatch log retention** - Long retention periods increase storage costs

### Mitigation Strategies
1. **Implement query caching** for Kendra to reduce redundant searches
2. **Optimize Bedrock prompts** to minimize token usage
3. **Design efficient DynamoDB access patterns** to avoid hot partitions
4. **Set appropriate log retention policies** based on compliance requirements

## Conclusion

The Inventory Demand Forecasting MVP has an estimated monthly cost of **$1,066.67**, with Amazon Kendra representing the largest cost component at 76% of the total. The serverless architecture provides excellent scalability and cost efficiency for variable workloads.

Key recommendations:
- Start with the current configuration for MVP validation
- Monitor usage patterns closely during the first 3 months
- Implement cost optimization strategies as usage patterns stabilize
- Consider reserved capacity options for production deployment

This cost analysis provides a solid foundation for budgeting and financial planning for the MVP deployment and future scaling decisions.
