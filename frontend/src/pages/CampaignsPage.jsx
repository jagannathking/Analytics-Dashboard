import React, { useState, useEffect, useCallback } from 'react';
import {
  getCampaigns, // This will now hit /api/leads/campaigns/options
  createCampaign as apiCreateCampaign,
  // deleteCampaign as apiDeleteCampaign (TODO: Implement backend DELETE /api/campaigns/:id and update api.js)
} from '../services/api.js';
import Table from '../components/Common/Table.jsx';
import Button from '../components/Common/Button.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import { formatDateToReadable } from '../utils/formatDate.js';

const CampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Pagination will be client-side for now if using the options endpoint
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;


  const fetchCampaignsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Params for getCampaigns will be ignored by the current backend options endpoint
      console.log("CampaignsPage: Fetching campaigns...");
      const response = await getCampaigns(); // No params needed for /api/leads/campaigns/options
      console.log("CampaignsPage: API Response:", response.data);

      // The options endpoint directly returns an array of campaigns
      setCampaigns(response.data || []);
    } catch (err) {
      console.error("CampaignsPage: Failed to fetch campaigns:", err);
      const errorMessage = err.response?.data?.message || "An error occurred while fetching campaigns.";
      setError(errorMessage);
      setCampaigns([]);
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed for this simple fetch from options endpoint

  useEffect(() => {
    fetchCampaignsData();
  }, [fetchCampaignsData]);

  // Client-side pagination logic
  const indexOfLastCampaign = currentPage * itemsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - itemsPerPage;
  const currentCampaigns = campaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);
  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };


  const handleOpenCreateModal = () => {
    alert("ACTION: Create New Campaign\n(Implement create campaign modal/form)");
    // Example call (ensure apiCreateCampaign points to POST /api/leads/campaigns):
    /*
    const newCampaignData = { campaignIdString: "TEST_API_CREATE", name: "Test API Campaign", channel: "Email" };
    apiCreateCampaign(newCampaignData)
      .then(() => {
        alert("Campaign created (check DB) - refreshing list");
        fetchCampaignsData();
      })
      .catch(err => alert("Error creating campaign: " + err.message));
    */
  };

  const handleEditCampaign = (campaign) => {
    alert(`ACTION: Edit Campaign - ${campaign.name}\n(Implement edit modal/form & backend PUT /api/campaigns/:id)`);
  };

  const handleDeleteCampaign = async (campaignId) => {
    alert(`ACTION: Delete Campaign - ID: ${campaignId}\n(Implement backend DELETE /api/campaigns/:id and update api.js)`);
    // Example:
    /*
    if (window.confirm("Are you sure?")) {
      try {
        await apiDeleteCampaign(campaignId); // Make sure this function exists in api.js and calls DELETE /api/campaigns/:id
        fetchCampaignsData();
      } catch (err) {
        alert("Failed to delete: " + err.message);
      }
    }
    */
  };

  const columns = [
    { header: 'Name', accessor: 'name', key: 'name' },
    { header: 'Campaign ID', accessor: 'campaignIdString', key: 'campaignIdString', width: '200px' },
    { header: 'Channel', accessor: 'channel', key: 'channel', width: '150px' },
    {
      header: 'Start Date',
      accessor: 'startDate',
      key: 'startDate',
      render: (date) => date ? formatDateToReadable(date) : '-',
      width: '130px',
    },
    {
      header: 'End Date',
      accessor: 'endDate',
      key: 'endDate',
      render: (date) => date ? formatDateToReadable(date) : '-',
      width: '130px',
    },
    {
      header: 'Budget',
      accessor: 'budget',
      key: 'budget',
      render: (budget) => budget != null ? `$${Number(budget).toLocaleString()}` : '-',
      width: '120px',
    },
    {
      header: 'Actions',
      key: 'actions',
      width: '180px',
      render: (_, campaignRow) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => handleEditCampaign(campaignRow)} size="small" variant="secondary">
            Edit
          </Button>
          <Button onClick={() => handleDeleteCampaign(campaignRow._id)} size="small" variant="danger">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading && campaigns.length === 0) {
    return <LoadingSpinner fullPage message="Loading campaigns..." />;
  }

  return (
    <div className="page-container campaigns-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Campaign Management</h1>
        <Button variant="primary" onClick={handleOpenCreateModal}>
          Create New Campaign
        </Button>
      </div>

      {error && (
        <div className="card" style={{ borderColor: 'red', color: 'red', padding: '15px', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      <Table
        columns={columns}
        data={currentCampaigns} // Use client-side paginated data
        isLoading={isLoading}
        noDataMessage="No campaigns found."
      />

      {campaigns.length > 0 && totalPages > 1 && ( // Show pagination if there's data and more than one page
        <div className="pagination-controls card" style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1 || isLoading} size="small">
            Previous
          </Button>
          <span>Page {currentPage} of {totalPages} (Total: {campaigns.length})</span>
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || isLoading} size="small">
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;