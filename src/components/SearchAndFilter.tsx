import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFilterPriority: (priority: string | null) => void;
  onSort: (sortBy: 'name' | 'date' | 'priority' | 'status') => void;
  showPriorityFilter?: boolean;
  showSort?: boolean;
}

export function SearchAndFilter({
  onSearch,
  onFilterPriority,
  onSort,
  showPriorityFilter = true,
  showSort = true,
}: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'priority' | 'status'>('date');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handlePriorityFilter = (priority: string | null) => {
    setSelectedPriority(priority);
    onFilterPriority(priority);
  };

  const handleSort = (newSort: 'name' | 'date' | 'priority' | 'status') => {
    setSortBy(newSort);
    onSort(newSort);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="space-y-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 text-muted" size={20} />
        <input
          type="text"
          placeholder="Search activities by name or description..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-10 pr-10 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-3 text-muted hover:text-foreground transition-colors active:scale-95"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Priority Filter */}
        {showPriorityFilter && (
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-muted" />
            <span className="text-sm font-medium text-foreground">Priority:</span>
            <div className="flex gap-2">
              {[
                { label: 'All', value: null },
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Urgent', value: 'urgent' },
              ].map(({ label, value }) => (
                <button
                  key={label}
                  onClick={() => handlePriorityFilter(value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors active:scale-95 ${
                    selectedPriority === value
                      ? 'bg-primary text-white'
                      : 'bg-white border border-border text-foreground hover:bg-surface'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sort */}
        {showSort && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value as any)}
              className="px-3 py-1 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="date">Due Date</option>
              <option value="name">Name</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
