export default function DevelopersPage() {
  // API endpoints
  const apiEndpoints = [
    {
      id: 1,
      endpoint: "/api/collections",
      method: "GET",
      description: "Returns a list of all hadith collections available on Sunnah.com",
      parameters: "None"
    },
    {
      id: 2,
      endpoint: "/api/collections/{collectionId}",
      method: "GET",
      description: "Returns detailed information about a specific hadith collection",
      parameters: "collectionId (string): The ID of the collection"
    },
    {
      id: 3,
      endpoint: "/api/collections/{collectionId}/books",
      method: "GET",
      description: "Returns a list of all books in a specific hadith collection",
      parameters: "collectionId (string): The ID of the collection"
    },
    {
      id: 4,
      endpoint: "/api/hadiths",
      method: "GET",
      description: "Search for hadiths across all collections",
      parameters: "q (string): Search query, collection (string, optional): Filter by collection"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Developers</h1>
      
      <div className="prose dark:prose-invert max-w-none mb-12">
        <p className="text-lg mb-6">
          Welcome to the Sunnah.com developer resources. We provide APIs and tools to help developers integrate hadith content into their applications.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">API Access</h2>
        <p>
          Our API allows developers to access hadith collections, search for specific hadiths, and retrieve detailed information about collections, books, and chapters.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Getting Started</h3>
        <ol className="list-decimal pl-6 mb-6">
          <li>Sign up for an API key by <a href="/contact" className="text-primary hover:underline">contacting us</a></li>
          <li>Read the documentation below to understand the available endpoints</li>
          <li>Implement the API in your application</li>
          <li>Follow our usage guidelines and attribution requirements</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Authentication</h3>
        <p>
          All API requests require an API key to be included in the request headers:
        </p>
        <pre className="bg-muted p-4 rounded-md overflow-x-auto">
          <code>
{`Authorization: Bearer YOUR_API_KEY`}
          </code>
        </pre>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">API Reference</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border px-4 py-2 text-left">Endpoint</th>
                <th className="border px-4 py-2 text-left">Method</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Parameters</th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map((endpoint) => (
                <tr key={endpoint.id}>
                  <td className="border px-4 py-2 font-mono text-sm">{endpoint.endpoint}</td>
                  <td className="border px-4 py-2">{endpoint.method}</td>
                  <td className="border px-4 py-2">{endpoint.description}</td>
                  <td className="border px-4 py-2">{endpoint.parameters}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Example Usage</h2>
        <div className="bg-muted p-4 rounded-md overflow-x-auto mb-6">
          <pre>
            <code>
{`// JavaScript example using fetch
const fetchCollections = async () => {
  try {
    const response = await fetch('https://api.sunnah.com/v1/collections', {
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    });
    
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error fetching collections:', error);
  }
};

fetchCollections();`}
            </code>
          </pre>
        </div>
        
        <div className="bg-muted p-4 rounded-md overflow-x-auto">
          <pre>
            <code>
{`# Python example using requests
import requests

def fetch_collections():
    try:
        response = requests.get(
            'https://api.sunnah.com/v1/collections',
            headers={'Authorization': 'Bearer YOUR_API_KEY'}
        )
        
        data = response.json()
        print(data)
    except Exception as e:
        print(f"Error fetching collections: {e}")

fetch_collections()`}
            </code>
          </pre>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Open Source Contributions</h2>
        <p className="mb-4">
          Sunnah.com is an open-source project, and we welcome contributions from developers. If you're interested in contributing to our codebase, check out our GitHub repository.
        </p>
        <div className="flex space-x-4">
          <a 
            href="#"
            className="inline-block bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium"
          >
            GitHub Repository
          </a>
          <a 
            href="/contact"
            className="inline-block bg-muted hover:bg-muted/80 px-4 py-2 rounded-md font-medium"
          >
            Contact the Dev Team
          </a>
        </div>
      </div>
    </div>
  );
}
