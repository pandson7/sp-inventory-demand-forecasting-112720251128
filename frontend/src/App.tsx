import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = 'https://izcyor2lx3.execute-api.us-east-1.amazonaws.com/prod';

interface DashboardMetrics {
  totalSales: number;
  totalRevenue: number;
  avgForecastAccuracy: number;
  totalProducts: number;
  totalForecasts: number;
}

interface TopProduct {
  productId: string;
  quantity: number;
  revenue: number;
  transactions: number;
}

interface SalesTrend {
  date: string;
  quantity: number;
}

interface DashboardData {
  metrics: DashboardMetrics;
  topProducts: TopProduct[];
  salesTrend: SalesTrend[];
  recentActivity: {
    salesLast30Days: number;
    forecastsGenerated: number;
  };
}

interface Recommendation {
  productId: string;
  productName: string;
  currentStock: number;
  reorderPoint: number;
  recommendedOrderQuantity: number;
  urgency: string;
  reasoning: string;
  forecastAccuracy: number;
}

interface ForecastData {
  forecast: Array<{ date: string; predictedDemand: number }>;
  confidenceInterval: { low: number; high: number };
  accuracy: number;
  patterns: string[];
}

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [csvData, setCsvData] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const [forecastProductId, setForecastProductId] = useState('');
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboardData();
    } else if (activeTab === 'inventory') {
      loadRecommendations();
    }
  }, [activeTab]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/dashboard`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/inventory/recommendations`);
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCsvUpload = async () => {
    try {
      setLoading(true);
      setUploadStatus('Processing...');
      
      // Parse CSV data
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        return row;
      });

      const response = await axios.post(`${API_BASE_URL}/upload`, {
        csvData: data
      });

      setUploadStatus(`Success: ${response.data.recordsProcessed} records processed`);
      setCsvData('');
    } catch (error: any) {
      setUploadStatus(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateForecast = async () => {
    if (!forecastProductId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/forecast/${forecastProductId}`);
      setForecastData(response.data);
    } catch (error: any) {
      console.error('Error generating forecast:', error);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderDashboard = () => (
    <div className="dashboard">
      <h2>Dashboard</h2>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : dashboardData ? (
        <div>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>Total Sales</h3>
              <div className="metric-value">{dashboardData.metrics.totalSales}</div>
            </div>
            <div className="metric-card">
              <h3>Total Revenue</h3>
              <div className="metric-value">${dashboardData.metrics.totalRevenue}</div>
            </div>
            <div className="metric-card">
              <h3>Forecast Accuracy</h3>
              <div className="metric-value">{(dashboardData.metrics.avgForecastAccuracy * 100).toFixed(1)}%</div>
            </div>
            <div className="metric-card">
              <h3>Total Products</h3>
              <div className="metric-value">{dashboardData.metrics.totalProducts}</div>
            </div>
          </div>

          <div className="section">
            <h3>Top Products by Revenue</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                    <th>Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.topProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{product.productId}</td>
                      <td>{product.quantity}</td>
                      <td>${product.revenue.toFixed(2)}</td>
                      <td>{product.transactions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="section">
            <h3>Recent Activity</h3>
            <p>Sales in last 30 days: {dashboardData.recentActivity.salesLast30Days}</p>
            <p>Forecasts generated: {dashboardData.recentActivity.forecastsGenerated}</p>
          </div>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );

  const renderDataUpload = () => (
    <div className="data-upload">
      <h2>Data Upload</h2>
      <div className="section">
        <h3>Upload Historical Sales Data</h3>
        <p>CSV format: productId, timestamp, quantity, price, storeLocation, category</p>
        <textarea
          value={csvData}
          onChange={(e) => setCsvData(e.target.value)}
          placeholder="Paste CSV data here..."
          rows={10}
          cols={80}
        />
        <br />
        <button onClick={handleCsvUpload} disabled={loading || !csvData.trim()}>
          {loading ? 'Processing...' : 'Upload Data'}
        </button>
        {uploadStatus && <div className="status">{uploadStatus}</div>}
      </div>

      <div className="section">
        <h3>Sample CSV Data</h3>
        <pre className="sample-data">
{`productId,timestamp,quantity,price,storeLocation,category
LAPTOP001,2024-11-01T10:00:00Z,2,1200,store1,electronics
PHONE001,2024-11-01T11:00:00Z,3,800,store1,electronics
TABLET001,2024-11-01T12:00:00Z,1,600,store1,electronics
LAPTOP001,2024-11-02T10:00:00Z,1,1200,store1,electronics
PHONE001,2024-11-02T11:00:00Z,4,800,store1,electronics`}
        </pre>
      </div>
    </div>
  );

  const renderForecast = () => (
    <div className="forecast">
      <h2>Demand Forecasting</h2>
      <div className="section">
        <h3>Generate Forecast</h3>
        <input
          type="text"
          value={forecastProductId}
          onChange={(e) => setForecastProductId(e.target.value)}
          placeholder="Enter Product ID (e.g., LAPTOP001)"
        />
        <button onClick={generateForecast} disabled={loading || !forecastProductId}>
          {loading ? 'Generating...' : 'Generate Forecast'}
        </button>
      </div>

      {forecastData && (
        <div className="section">
          <h3>Forecast Results for {forecastProductId}</h3>
          <div className="forecast-summary">
            <p><strong>Accuracy:</strong> {(forecastData.accuracy * 100).toFixed(1)}%</p>
            <p><strong>Confidence Interval:</strong> {forecastData.confidenceInterval.low} - {forecastData.confidenceInterval.high}</p>
            <p><strong>Patterns:</strong> {forecastData.patterns.join(', ')}</p>
          </div>

          <div className="forecast-table">
            <h4>30-Day Forecast</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Predicted Demand</th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.forecast.slice(0, 10).map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.predictedDemand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {forecastData.forecast.length > 10 && (
              <p>Showing first 10 days of 30-day forecast...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderInventory = () => (
    <div className="inventory">
      <h2>Inventory Recommendations</h2>
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="section">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Reorder Point</th>
                  <th>Recommended Order</th>
                  <th>Urgency</th>
                  <th>Reasoning</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((rec, index) => (
                  <tr key={index} className={rec.urgency === 'HIGH' ? 'high-urgency' : ''}>
                    <td>{rec.productId}</td>
                    <td>{rec.productName}</td>
                    <td>{rec.currentStock}</td>
                    <td>{rec.reorderPoint}</td>
                    <td>{rec.recommendedOrderQuantity}</td>
                    <td className={`urgency ${rec.urgency.toLowerCase()}`}>{rec.urgency}</td>
                    <td>{rec.reasoning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recommendations.length === 0 && (
            <p>No recommendations available. Upload sales data and generate forecasts first.</p>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>Inventory Demand Forecasting MVP</h1>
        <nav>
          <button 
            className={activeTab === 'dashboard' ? 'active' : ''} 
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={activeTab === 'upload' ? 'active' : ''} 
            onClick={() => setActiveTab('upload')}
          >
            Data Upload
          </button>
          <button 
            className={activeTab === 'forecast' ? 'active' : ''} 
            onClick={() => setActiveTab('forecast')}
          >
            Forecasting
          </button>
          <button 
            className={activeTab === 'inventory' ? 'active' : ''} 
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
        </nav>
      </header>

      <main className="App-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'upload' && renderDataUpload()}
        {activeTab === 'forecast' && renderForecast()}
        {activeTab === 'inventory' && renderInventory()}
      </main>
    </div>
  );
}

export default App;
