import React, { useState, useEffect, useCallback } from 'react';
import { getLeads, deleteLead as apiDeleteLead } from '../services/api.js'; // Make sure api.js path is correct
import Table from '../components/Common/Table.jsx';      // Generic table component
import Button from '../components/Common/Button.jsx';    // Custom button
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';
import { formatDateToReadable } from '../utils/formatDate.js'; // Date formatting utility
// import FilterBar from '../components/Dashboard/FilterBar.jsx'; // You might reuse or create a new filter bar for leads
// import LeadFormModal from '../components/Leads/LeadFormModal.jsx'; // You would create this for create/edit

// Optional: Add some basic CSS for this page if needed
// import './LeadsPage.css';

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 15, // Number of leads per page
    totalLeads: 0,
  });
  const [filters, setFilters] = useState({
    // Add any specific filters for this page, e.g.:
    // campaignId: 'all',
    // status: 'all',
    // searchTerm: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // const [showModal, setShowModal] = useState(false);
  // const [editingLead, setEditingLead] = useState(null);

  const fetchLeadsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        // ...spread other active filters from `filters` state
        // if (filters.campaignId && filters.campaignId !== 'all') params.campaignId = filters.campaignId;
        // if (filters.status && filters.status !== 'all') params.status = filters.status;
        // if (filters.searchTerm) params.search = filters.searchTerm; // Assuming backend supports 'search'
      };
      console.log("LeadsPage: Fetching leads with params:", params);
      const response = await getLeads(params);
      console.log("LeadsPage: API Response:", response.data);

      setLeads(response.data.leads || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.currentPage || 1,
        totalLeads: response.data.totalLeads || 0,
      }));
    } catch (err) {
      console.error("LeadsPage: Failed to fetch leads:", err);
      const errorMessage = err.response?.data?.message || "An error occurred while fetching leads.";
      setError(errorMessage);
      setLeads([]); // Clear leads on error
    } finally {
      setIsLoading(false);
    }
  }, [pagination.currentPage, pagination.limit, filters]); // Add all filter dependencies

  useEffect(() => {
    fetchLeadsData();
  }, [fetchLeadsData]); // Re-run when fetchLeadsData (and its dependencies) change

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleEditLead = (lead) => {
    console.log("Edit lead action on LeadsPage:", lead);
    // setEditingLead(lead);
    // setShowModal(true);
    alert(`ACTION: Edit Lead - ${lead.email}\n(Implement edit modal/form)`);
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm("Are you sure you want to delete this lead permanently?")) {
      try {
        setIsLoading(true); // Show loading indicator during delete
        await apiDeleteLead(leadId);
        // alert("Lead deleted successfully!");
        // Refetch leads data for the current page to update the table
        // If on last page and last item deleted, might need to go to previous page
        if (leads.length === 1 && pagination.currentPage > 1) {
            handlePageChange(pagination.currentPage - 1);
        } else {
            fetchLeadsData();
        }
      } catch (err) {
        console.error("LeadsPage: Failed to delete lead:", err);
        alert(`Error: Could not delete lead. ${err.response?.data?.message || err.message}`);
        setIsLoading(false);
      }
    }
  };

  // Define columns for the generic Table component
  const columns = [
    { header: 'Email', accessor: 'email', key: 'email', render: (email) => <a href={`mailto:${email}`}>{email}</a> },
    {
      header: 'Campaign',
      accessor: 'campaign',
      key: 'campaign',
      render: (campaign) => campaign?.name || 'N/A',
    },
    { header: 'Score', accessor: 'score', key: 'score', width: '70px' },
    { header: 'Status', accessor: 'status', key: 'status', width: '110px' },
    { header: 'Source', accessor: 'source', key: 'source' },
    {
      header: 'Cost',
      accessor: 'cost',
      key: 'cost',
      render: (cost) => cost != null ? `$${Number(cost).toFixed(2)}` : '-',
      width: '80px',
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDateToReadable(date),
      width: '130px',
    },
    {
      header: 'Actions',
      key: 'actions',
      width: '180px', // Adjusted width for two buttons
      render: (_, leadRow) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => handleEditLead(leadRow)} size="small" variant="secondary">
            Edit
          </Button>
          <Button onClick={() => handleDeleteLead(leadRow._id)} size="small" variant="danger">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Display loading spinner for the initial full load
  if (isLoading && leads.length === 0 && pagination.currentPage === 1) {
    return <LoadingSpinner fullPage message="Loading leads data..." />;
  }

  return (
    <div className="page-container leads-page"> {/* Added .page-container for general page styling */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Leads Management</h1>
        {/* <Button variant="primary" onClick={() => { setEditingLead(null); setShowModal(true); }}>
          Create New Lead
        </Button> */}
      </div>

      {/* TODO: Add a FilterBar component here for searching, filtering by status, campaign etc. */}
      {/* <FilterBar onFilterChange={setFilters} campaignOptions={...} ... /> */}

      {error && (
        <div className="card" style={{ borderColor: 'red', color: 'red', padding: '15px', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      <Table
        columns={columns}
        data={leads}
        isLoading={isLoading} // Let the table handle its own inline loading/no-data message
        noDataMessage="No leads found. Try adjusting your filters or create new leads."
        // onRowClick={(lead) => console.log("Row clicked:", lead)} // Example row click
      />

      {pagination.totalPages > 1 && (
        <div className="pagination-controls card" style={{ marginTop: '25px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', padding: '15px' }}>
          <Button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage === 1 || isLoading} size="small">
            Previous
          </Button>
          <span>Page {pagination.currentPage} of {pagination.totalPages} (Total: {pagination.totalLeads})</span>
          <Button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage === pagination.totalPages || isLoading} size="small">
            Next
          </Button>
        </div>
      )}

      {/* {showModal && (
        <LeadFormModal
          lead={editingLead}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchLeadsData(); // Refresh data after save
          }}
        />
      )} */}
    </div>
  );
};

export default LeadsPage;