# Inventory Demand Forecasting MVP

A comprehensive cloud-native solution for inventory demand forecasting using AWS services and machine learning capabilities.

## 🏗️ Architecture Overview

This project implements a scalable inventory demand forecasting system with the following key components:

- **Frontend**: React-based web application with interactive dashboards
- **Backend**: AWS Lambda functions for API endpoints
- **Data Processing**: AWS SageMaker for ML model training and inference
- **Storage**: Amazon S3 for data lake and DynamoDB for real-time data
- **Analytics**: Amazon QuickSight for business intelligence
- **Infrastructure**: AWS CDK for Infrastructure as Code

## 📁 Project Structure

```
├── frontend/                    # React web application
│   ├── src/                    # Source code
│   ├── public/                 # Static assets
│   └── package.json           # Dependencies
├── inventory-forecasting-cdk/   # AWS CDK infrastructure
│   ├── lib/                   # CDK stack definitions
│   ├── bin/                   # CDK app entry point
│   └── test/                  # Infrastructure tests
├── generated-diagrams/         # Architecture diagrams
├── specs/                     # Technical specifications
├── pricing/                   # Cost analysis reports
├── tasks/                     # Project task definitions
└── qr-code/                   # Repository QR code
```

## 🚀 Features

### Core Functionality
- **Demand Forecasting**: ML-powered inventory demand predictions
- **Real-time Analytics**: Live dashboards for inventory insights
- **Data Integration**: Support for multiple data sources
- **Scalable Architecture**: Auto-scaling based on demand
- **Cost Optimization**: Efficient resource utilization

### Technical Features
- **Serverless Architecture**: AWS Lambda-based microservices
- **Machine Learning**: SageMaker integration for forecasting models
- **Real-time Processing**: Kinesis for streaming data
- **Security**: IAM roles and VPC configuration
- **Monitoring**: CloudWatch integration for observability

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Recharts for data visualization
- Tailwind CSS for styling
- Redux for state management

### Backend & Infrastructure
- AWS CDK (TypeScript)
- AWS Lambda (Node.js)
- Amazon SageMaker
- Amazon DynamoDB
- Amazon S3
- Amazon Kinesis
- Amazon QuickSight

### Development Tools
- Jest for testing
- ESLint for code quality
- AWS CLI for deployment

## 📋 Prerequisites

- Node.js 18+ and npm
- AWS CLI configured with appropriate credentials
- AWS CDK CLI installed globally
- Docker (for local development)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/pandson7/sp-inventory-demand-forecasting-112720251128.git
cd sp-inventory-demand-forecasting-112720251128
```

### 2. Deploy Infrastructure
```bash
cd inventory-forecasting-cdk
npm install
npm run build
cdk deploy
```

### 3. Start Frontend Development
```bash
cd ../frontend
npm install
npm start
```

The application will be available at `http://localhost:3000`

## 📊 Architecture Diagrams

The project includes comprehensive architecture diagrams:

- **High-Level Architecture**: Overall system design
- **API Architecture**: REST API structure and endpoints
- **Data Flow Architecture**: Data processing pipeline
- **Deployment Architecture**: AWS infrastructure layout
- **Security & Monitoring**: Security controls and monitoring setup

View diagrams in the `generated-diagrams/` directory.

## 💰 Cost Analysis

Detailed cost analysis and optimization recommendations are available in the `pricing/` directory, including:

- Monthly cost estimates for different usage scenarios
- Cost optimization strategies
- Resource utilization recommendations

## 🔧 Configuration

### Environment Variables
```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=your-account-id

# Application Configuration
REACT_APP_API_ENDPOINT=your-api-gateway-url
```

### CDK Configuration
Update `cdk.json` for environment-specific settings:
```json
{
  "app": "npx ts-node --prefer-ts-exts bin/inventory-forecasting-cdk.ts",
  "context": {
    "environment": "production",
    "enableMonitoring": true
  }
}
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Infrastructure Tests
```bash
cd inventory-forecasting-cdk
npm test
```

## 📈 Monitoring & Observability

The system includes comprehensive monitoring:

- **CloudWatch Dashboards**: Real-time metrics and logs
- **X-Ray Tracing**: Distributed tracing for performance analysis
- **Custom Metrics**: Business-specific KPIs
- **Alerting**: Automated notifications for critical events

## 🔒 Security

Security features implemented:

- **IAM Roles**: Least privilege access control
- **VPC Configuration**: Network isolation
- **Encryption**: Data encryption at rest and in transit
- **API Security**: Authentication and authorization
- **Compliance**: SOC 2 and GDPR considerations

## 🚀 Deployment

### Production Deployment
```bash
# Deploy infrastructure
cd inventory-forecasting-cdk
cdk deploy --profile production

# Build and deploy frontend
cd ../frontend
npm run build
aws s3 sync build/ s3://your-frontend-bucket --profile production
```

### CI/CD Pipeline
The project supports automated deployment through:
- GitHub Actions workflows
- AWS CodePipeline integration
- Automated testing and validation

## 📚 Documentation

Additional documentation available:

- [Technical Specifications](specs/requirements.md)
- [API Documentation](specs/design.md)
- [Development Tasks](specs/tasks.md)
- [Cost Analysis Report](pricing/cost_analysis_report.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Review the documentation in the `specs/` directory

## 🏷️ Version

Current Version: 1.0.0 (MVP Release)

---

**Built with ❤️ using AWS Cloud Services and modern web technologies**
