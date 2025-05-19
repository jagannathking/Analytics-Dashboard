import React, { useState, useEffect, useCallback } from 'react';
import {
  getSummaryStats,
  getLeadsOverTime,
  getCampaignPerformance,
  getCampaignOptions,
  getLeads, // For the leads table
  deleteLead as apiDeleteLead // For deleting leads
} from '../services/api';

import FilterBar from '../components/Dashboard/FilterBar.jsx';
import SummaryCard from '../components/Dashboard/SummaryCard.jsx';
import LeadsOverTimeChart from '../components/Dashboard/LeadsOverTimeChart.jsx';
import CampaignPerformanceTable from '../components/Dashboard/CampaignPerformanceTable.jsx';
import LeadsTable from '../components/Dashboard/LeadsTable.jsx';
import LoadingSpinner from '../components/Common/LoadingSpinner.jsx';

import '../components/Dashboard/Dashboard.css'; // Styles for the dashboard layout elements

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [leadsOverTime, setLeadsOverTime] = useState([]);
  const [campaignPerformance, setCampaignPerformance] = useState([]);
  const [campaignOptions, setCampaignOptions] = useState([]);
  const [leadsData, setLeadsData] = useState({ list: [], totalPages: 1, currentPage: 1, totalLeads: 0 });

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    campaignId: 'all', // This will be the Campaign._id or 'all'
    scoreMin: '',
    scoreMax: '',
    status: 'all',
    page: 1, // For leads table pagination
    limit: 10 // For leads table pagination
  });

  const [loadingState, setLoadingState] = useState({
    summary: true,
    leadsOverTime: true,
    campaignPerformance: true,
    campaignOptions: true,
    leadsTable: true,
  });

  const setIsLoading = (key, value) => {
    setLoadingState(prev => ({ ...prev, [key]: value }));
  };

  // Unified data fetching function
  const fetchData = useCallback(async (currentFilters) => {
    // Prepare API filters (remove 'page' and 'limit' for summary/chart calls)
    const dashboardApiFilters = {
      startDate: currentFilters.startDate,
      endDate: currentFilters.endDate,
      ...(currentFilters.campaignId !== 'all' && { campaignId: currentFilters.campaignId }),
      // scoreMin, scoreMax, status could also be passed if your backend supports them for summary/charts
    };

    const leadsApiFilters = { ...currentFilters }; // All filters for leads table

    // Fetch campaign options once or if they might change
    if (campaignOptions.length === 0 && loadingState.campaignOptions) {
      try {
        setIsLoading('campaignOptions', true);
        const campOptRes = await getCampaignOptions();
        setCampaignOptions(campOptRes.data || []);
      } catch (error) {
        console.error("Failed to fetch campaign options:", error);
      } finally {
        setIsLoading('campaignOptions', false);
      }
    }

    // Fetch dashboard widgets
    const fetchWidgets = async () => {
      setIsLoading('summary', true);
      setIsLoading('leadsOverTime', true);
      setIsLoading('campaignPerformance', true);
      try {
        const [summaryRes, leadsOverTimeRes, campaignPerfRes] = await Promise.all([
          getSummaryStats(dashboardApiFilters),
          getLeadsOverTime(dashboardApiFilters),
          getCampaignPerformance(dashboardApiFilters)
        ]);
        setSummary(summaryRes.data);
        setLeadsOverTime(leadsOverTimeRes.data);
        setCampaignPerformance(campaignPerfRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard widgets:", error);
        // Set error states for individual widgets if needed
      } finally {
        setIsLoading('summary', false);
        setIsLoading('leadsOverTime', false);
        setIsLoading('campaignPerformance', false);
      }
    };

    // Fetch leads table data
    const fetchLeads = async () => {
      setIsLoading('leadsTable', true);
      try {
        const leadsRes = await getLeads(leadsApiFilters);
        setLeadsData({
          list: leadsRes.data.leads || [],
          totalPages: leadsRes.data.totalPages || 1,
          currentPage: leadsRes.data.currentPage || 1,
          totalLeads: leadsRes.data.totalLeads || 0
        });
      } catch (error) {
        console.error("Failed to fetch leads:", error);
        setLeadsData({ list: [], totalPages: 1, currentPage: 1, totalLeads: 0 }); // Reset on error
      } finally {
        setIsLoading('leadsTable', false);
      }
    };

    fetchWidgets();
    fetchLeads();

  }, [campaignOptions.length, loadingState.campaignOptions]); // Only re-bind if campaignOptions length changes (initial fetch)

  useEffect(() => {
    fetchData(filters);
  }, [filters, fetchData]); // Re-fetch when filters change

  const handleFilterChange = (newAppliedFilters) => {
    // When filters from FilterBar change, reset page to 1 for leads table
    setFilters(prev => ({
      ...prev,
      ...newAppliedFilters,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleEditLead = (lead) => {
    console.log("Edit lead:", lead);
    // Implement modal or navigation to an edit page
    // For now, just log. You'd typically set state to show an edit form/modal.
    alert(`Editing Lead: ${lead.email}\n(Implement edit functionality)`);
  };

  const handleDeleteLead = async (leadId) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await apiDeleteLead(leadId);
        // alert("Lead deleted successfully!");
        // Refetch leads data to update the table
        setFilters(prev => ({ ...prev })); // Trigger re-fetch by "changing" filters
      } catch (error) {
        console.error("Failed to delete lead:", error);
        alert(`Failed to delete lead: ${error.response?.data?.message || error.message}`);
      }
    }
  };


  const overallLoading = Object.values(loadingState).some(val => val === true);

  return (
    <div className="dashboard-page">
      <h1>Marketing Dashboard Overview</h1>
      <FilterBar
        onFilterChange={handleFilterChange}
        initialFilters={filters} // Pass relevant parts of filters
        campaignOptions={campaignOptions}
        isLoading={loadingState.campaignOptions}
      />

      {/* Conditional rendering for initial full page load could be here */}
      {/* {overallLoading && !summary && <LoadingSpinner fullPage message="Fetching dashboard data..." />} */}

      <div className="dashboard-grid">
        <section className="summary-cards-container">
          <SummaryCard title="Total Leads" value={summary?.totalLeads?.toLocaleString() || "0"} isLoading={loadingState.summary} subValue={leadsData.totalLeads ? `(Showing ${leadsData.list.length} of ${leadsData.totalLeads})` : ''} />
          <SummaryCard title="Conversion Rate" value={`${summary?.conversionRate?.toFixed(1) || "0.0"}%`} isLoading={loadingState.summary} />
          <SummaryCard title="Avg. Cost/Lead" value={`$${summary?.costPerLead?.toFixed(2) || "0.00"}`} isLoading={loadingState.summary} />
          <SummaryCard title="Avg. Lead Score" value={summary?.averageScore?.toFixed(1) || "0.0"} isLoading={loadingState.summary} />
        </section>

        <section className="charts-container card"> {/* Wrap chart in a card */}
          <LeadsOverTimeChart data={leadsOverTime} isLoading={loadingState.leadsOverTime} />
        </section>

        <section className="table-section-container">
          <CampaignPerformanceTable performanceData={campaignPerformance} isLoading={loadingState.campaignPerformance} />
        </section>

        <section className="table-section-container">
          <LeadsTable
            leads={leadsData.list}
            isLoading={loadingState.leadsTable}
            totalPages={leadsData.totalPages}
            currentPage={leadsData.currentPage}
            onPageChange={handlePageChange}
            onEditLead={handleEditLead}
            onDeleteLead={handleDeleteLead}
          />
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;