// filepath: d:\React Projects\test-and-learn-project\src\components\AxiosComponent\AxiosComponent.tsx
import { useState } from 'react';
import axios from 'axios';

export const AxiosComponent = () => {
  const [jsonData, setJsonData] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState<Error | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    setJsonData(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonData);
      const res = await axios.post('http://localhost:3000/api/data', parsedData);
      setResponse(res.data);
      setError(null);
    } catch (err) {
      setError(new Error(String(err)));
      setResponse(null);
    }
  };

  return (
    <div>
      <textarea
        className="border border-amber-300 rounded-lg p-1"
        value={jsonData}
        onChange={handleInputChange}
        rows={10}
        cols={50}
        placeholder="Enter JSON object here"
      />
      <br />
      <button onClick={handleSubmit}>Send</button>
      {response && <div>Response: {JSON.stringify(response)}</div>}
      {error && <div>Error: {String(error)}</div>}
    </div>
  );
};
