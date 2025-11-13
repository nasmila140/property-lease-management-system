import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { supabase, Property, Payment } from '../lib/supabase';

interface PropertySearchProps {
  onPropertySelect: (property: Property, payments: Payment[]) => void;
}

export default function PropertySearch({ onPropertySelect }: PropertySearchProps) {
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setLoading(true);
    setError('');

    try {
      const { data: property, error: propError } = await supabase
        .from('properties')
        .select('*')
        .eq('property_id', searchId.trim())
        .maybeSingle();

      if (propError) throw propError;

      if (!property) {
        setError('Property not found');
        setLoading(false);
        return;
      }

      const { data: payments, error: payError } = await supabase
        .from('payments')
        .select('*')
        .eq('property_id', property.id)
        .order('due_date', { ascending: false });

      if (payError) throw payError;

      onPropertySelect(property, payments || []);
    } catch (err) {
      setError('Error searching for property');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Search Property</h2>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Property ID"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Search
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
