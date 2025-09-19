const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export class GeminiService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async generateInsights(data) {
    if (!this.apiKey) {
      throw new Error('Gemini API key is required');
    }

    // Prepare data summary for AI analysis
    const dataSummary = this.prepareDataSummary(data);
    
    const prompt = `
You are a data analyst AI. Analyze this dataset and provide exactly 2 key insights about the data patterns, plus chart recommendations.

Dataset Summary:
- Rows: ${dataSummary.rows}
- Columns: ${dataSummary.columns.join(', ')}
- Numeric columns: ${dataSummary.numericColumns.join(', ')}
- Categorical columns: ${dataSummary.categoricalColumns.join(', ')}
- Sample data: ${JSON.stringify(dataSummary.sampleData)}
- Column statistics: ${JSON.stringify(dataSummary.statistics)}

Available chart types for recommendations:
- Basic Charts: Line Chart, Bar Chart, Scatter Plot, Pie Chart, Area Chart
- Advanced Charts: Bubble Chart, 3D Scatter, Heatmap, Contour Plot, 3D Surface
- Specialized Charts: Sankey Diagram, Treemap, Chord Diagram

Please provide your response in this exact JSON format (no additional text):
{
  "insights": [
    {
      "title": "Insight Title 1",
      "description": "Detailed insight about data patterns, trends, or relationships found",
      "type": "trend|correlation|distribution|outlier",
      "confidence": 0.8
    },
    {
      "title": "Insight Title 2", 
      "description": "Another detailed insight about the data",
      "type": "trend|correlation|distribution|outlier",
      "confidence": 0.9
    }
  ],
  "chartRecommendations": [
    {
      "chartType": "exact_chart_name_from_list",
      "reason": "Why this chart is recommended for this specific data",
      "priority": "high|medium|low",
      "columns": ["suggested_x_column", "suggested_y_column"]
    },
    {
      "chartType": "another_chart_name",
      "reason": "Why this second chart would be valuable", 
      "priority": "high|medium|low",
      "columns": ["suggested_columns"]
    }
  ]
}
`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      const generatedText = result.candidates[0]?.content?.parts[0]?.text;
      
      if (!generatedText) {
        throw new Error('No response generated from Gemini API');
      }

      // Parse the JSON response
      const cleanedText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
      const parsedResponse = JSON.parse(cleanedText);
      
      return parsedResponse;
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error(`Failed to generate AI insights: ${error.message}`);
    }
  }

  prepareDataSummary(data) {
    if (!data || !data.data || data.data.length === 0) {
      throw new Error('Invalid data provided');
    }

    // Get sample of data (first 5 rows max)
    const sampleData = data.data.slice(0, Math.min(5, data.data.length));
    
    // Identify column types
    const numericColumns = [];
    const categoricalColumns = [];
    const statistics = {};

    data.columns.forEach(column => {
      const values = data.data.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
      const numericValues = values.map(val => parseFloat(val)).filter(val => !isNaN(val) && isFinite(val));
      
      if (numericValues.length > values.length * 0.5) { // More than 50% are numeric
        numericColumns.push(column);
        
        // Basic statistics for numeric columns
        if (numericValues.length > 0) {
          const sorted = numericValues.sort((a, b) => a - b);
          statistics[column] = {
            min: sorted[0],
            max: sorted[sorted.length - 1],
            mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
            median: sorted[Math.floor(sorted.length / 2)],
            count: numericValues.length
          };
        }
      } else {
        categoricalColumns.push(column);
        
        // Basic statistics for categorical columns
        const uniqueValues = [...new Set(values)];
        statistics[column] = {
          uniqueCount: uniqueValues.length,
          totalCount: values.length,
          topValues: uniqueValues.slice(0, 3) // Top 3 values
        };
      }
    });

    return {
      rows: data.data.length,
      columns: data.columns,
      numericColumns,
      categoricalColumns,
      sampleData,
      statistics
    };
  }
}

// Default instance - will be configured with API key later
export default new GeminiService();