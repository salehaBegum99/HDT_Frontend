import React, { useEffect, useState } from 'react';
import { User, Phone, Mail, Calendar, MapPin, Shield } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';
import API from '../API/axios';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = React.useRef(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await API.get('/applications/my-application');
        setApplication(res.data.application);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="prof__info-row">
      <div className="prof__info-icon"><Icon size={16} /></div>
      <div>
        <p className="prof__info-label">{label}</p>
        <p className="prof__info-value">{value || '—'}</p>
      </div>
    </div>
  );

  return (
    <PageLayout headerProps={{ showBack: true, title: 'Profile' }} showBottomNav>
      <div className="prof">

        {/* Avatar */}
        <div className="prof__hero">
          <div className="prof__avatar">
            {user?.name?.slice(0, 2).toUpperCase() || 'AP'}
          </div>
          <h2 className="prof__name">{user?.name || 'Applicant'}</h2>
          <span className="prof__role-badge">Applicant</span>
        </div>

        {/* Application Info */}
        {application && (
          <div className="prof__card">
            <h3 className="prof__card-title">Application Details</h3>
            <InfoRow icon={Shield} label="Application ID"
              value={application.applicationDisplayId || application.candidateId} />
            <InfoRow icon={Shield} label="Status" value={application.status} />
          </div>
        )}

        {/* Personal Info */}
        {application?.personal && (
          <div className="prof__card">
            <h3 className="prof__card-title">Personal Information</h3>
            <InfoRow icon={User}    label="Full Name"
              value={`${application.personal.firstName} ${application.personal.lastName}`} />
            <InfoRow icon={MapPin}  label="Address"     value={application.personal.address} />
            <InfoRow icon={MapPin}  label="City"        value={application.personal.cityVillage} />
            <InfoRow icon={MapPin}  label="Pincode"     value={application.personal.pincode} />
          </div>
        )}

        {/* Academic Info */}
        {application?.academic && (
          <div className="prof__card">
            <h3 className="prof__card-title">Academic Information</h3>
            <InfoRow icon={Calendar} label="Educational Level" value={application.academic.educationalLevel} />
            <InfoRow icon={Calendar} label="Academic Year"     value={application.academic.academicYear} />
            <InfoRow icon={Calendar} label="Grade"             value={application.academic.currentGrade} />
            <InfoRow icon={Calendar} label="Percentage"        value={application.academic.currentGradePercentage + '%'} />
          </div>
        )}

        {/* Logout Button */}
        <button
          className="prof__logout"
          onClick={async () => { await logout(); window.location.href = '/'; }}
        >
          Logout
        </button>

      </div>
    </PageLayout>
  );
};

export default ProfilePage;