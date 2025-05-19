import React, { useState, useEffect } from 'react';
import './FilterBar.css';
import Button from '../Common/Button.jsx'; // Using the custom button

const FilterBar = ({ onFilterChange, initialFilters = {}, campaignOptions = [] }) => {
  const defaultFilters = {
    startDate: '',
    endDate: '',
    campaignId: 'all',
    scoreMin: '',
    scoreMax: '',
  };
  const [filters, setFilters] = useState({ ...defaultFilters, ...initialFilters });

  useEffect(() => {
    // Sync with parent if initialFilters change externally
    setFilters(prev => ({ ...prev, ...initialFilters }));
  }, [initialFilters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Prepare filters for API: remove empty strings for scores, 'all' for campaign
    const activeFilters = { ...filters };
    if (activeFilters.scoreMin === '') delete activeFilters.scoreMin;
    if (activeFilters.scoreMax === '') delete activeFilters.scoreMax;
    // The parent component (DashboardPage) will decide how to handle 'all' campaignId

    onFilterChange(activeFilters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onFilterChange(defaultFilters); // Also notify parent about reset
  };

  return (
    <form onSubmit={handleSubmit} className="filter-bar-form card">
      <div className="filter-item">
        <label htmlFor="startDate">Start Date</label>
        <input type="date" id="startDate" name="startDate" value={filters.startDate} onChange={handleChange} />
      </div>
      <div className="filter-item">
        <label htmlFor="endDate">End Date</label>
        <input type="date" id="endDate" name="endDate" value={filters.endDate} onChange={handleChange} />
      </div>
      <div className="filter-item">
        <label htmlFor="campaignId">Campaign</label>
        <select id="campaignId" name="campaignId" value={filters.campaignId} onChange={handleChange}>
          <option value="all">All Campaigns</option>
          {campaignOptions.map(campaign => (
            // Assuming campaign object has _id and name
            <option key={campaign._id} value={campaign._id}>
              {campaign.name} ({campaign.campaignIdString || campaign._id.slice(-6)})
            </option>
          ))}
        </select>
      </div>
      <div className="filter-item filter-item-score-group">
        <label>Lead Score</label>
        <div className="score-inputs">
          <input
            type="number"
            name="scoreMin"
            placeholder="Min"
            value={filters.scoreMin}
            onChange={handleChange}
            min="0" max="100"
          />
          <span>-</span>
          <input
            type="number"
            name="scoreMax"
            placeholder="Max"
            value={filters.scoreMax}
            onChange={handleChange}
            min="0" max="100"
          />
        </div>
      </div>
      <div className="filter-actions">
        <Button type="submit" variant="primary">Apply Filters</Button>
        <Button type="button" variant="secondary" onClick={handleReset}>Reset</Button>
      </div>
    </form>
  );
};
export default FilterBar;