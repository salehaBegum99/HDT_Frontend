import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import API from '../API/axios';
import './PaymentStatusPage.css';

const PaymentStatusPage = () => {
  const [tranches, setTranches] = useState([]);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const appRes = await API.get('/applications/my-application');
        const app = appRes.data.application;
        setApplication(app);
        if (app?._id) {
          const tRes = await API.get(`/supervisor/${app._id}/tranches`);
          setTranches(tRes.data.tranches || []);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const statusIcon = (status) => {
    if (status === 'DISBURSED') return <CheckCircle size={18} color="#16a34a" />;
    if (status === 'ON_HOLD')   return <AlertCircle size={18} color="#d97706" />;
    return <Clock size={18} color="#94a3b8" />;
  };

  const statusClass = (status) => {
    if (status === 'DISBURSED') return 'pay__tranche--disbursed';
    if (status === 'ON_HOLD')   return 'pay__tranche--hold';
    return 'pay__tranche--pending';
  };

  if (loading) return (
    <PageLayout headerProps={{ showBack: true, title: 'Payment Status' }} showBottomNav>
      <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>Loading...</p>
    </PageLayout>
  );

  return (
    <PageLayout headerProps={{ showBack: true, title: 'Payment Status' }} showBottomNav>
      <div className="pay">

        <div className="pay__header">
          <h2 className="pay__title">Payment Status</h2>
          <p className="pay__sub">Track your scholarship disbursements</p>
        </div>

        {/* Summary Card */}
        {application ? (
          <div className="pay__summary">
            <div className="pay__summary-icon">
              <CreditCard size={24} color="#4f46e5" />
            </div>
            <div>
              <p className="pay__summary-label">Approved Amount</p>
              <p className="pay__summary-amount">
                {application.approvedAmount
                  ? `₹${application.approvedAmount.toLocaleString('en-IN')}`
                  : 'Pending Approval'}
              </p>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <p className="pay__summary-label">Total Tranches</p>
              <p className="pay__summary-count">
                {tranches.filter(t => t.status === 'DISBURSED').length}
                /{application.totalTranches || '—'}
              </p>
            </div>
          </div>
        ) : (
          <div className="pay__empty">
            <CreditCard size={40} color="#cbd5e1" />
            <p>No application found</p>
            <p style={{ fontSize: '12px' }}>Submit your application to track payments</p>
          </div>
        )}

        {/* Tranches List */}
        {tranches.length > 0 ? (
          <div className="pay__list">
            <h3 className="pay__list-title">Disbursement History</h3>
            {tranches.map((t, i) => (
              <div key={t._id} className={`pay__tranche ${statusClass(t.status)}`}>
                <div className="pay__tranche-left">
                  {statusIcon(t.status)}
                  <div>
                    <p className="pay__tranche-label">Tranche {t.trancheNumber || i + 1}</p>
                    <p className="pay__tranche-date">
                      {t.disbursedDate
                        ? new Date(t.disbursedDate).toLocaleDateString('en-IN')
                        : 'Pending'}
                    </p>
                  </div>
                </div>
                <div className="pay__tranche-right">
                  <p className="pay__tranche-amount">
                    {t.amount ? `₹${t.amount.toLocaleString('en-IN')}` : '—'}
                  </p>
                  <p className={`pay__tranche-status pay__tranche-status--${t.status?.toLowerCase()}`}>
                    {t.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : application?.approvedAmount ? (
          <div className="pay__empty">
            <Clock size={40} color="#cbd5e1" />
            <p>No disbursements yet</p>
            <p style={{ fontSize: '12px' }}>Payments will appear here once processed</p>
          </div>
        ) : null}

      </div>
    </PageLayout>
  );
};

export default PaymentStatusPage;