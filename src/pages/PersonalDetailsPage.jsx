import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useApplication } from '../context/ApplicationContext';
import PageLayout from '../components/layout/PageLayout';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import './FormPage.css';

const STEPS = [
  { label: 'Personal', path: '/apply/personal' },
  { label: 'Documents', path: '/apply/documents' },
  { label: 'Consent', path: '/apply/consent' },
];

const StepIndicator = ({ currentStep }) => (
  <div className="step-indicator" aria-label="Application progress">
    {STEPS.map((step, i) => (
      <React.Fragment key={step.label}>
        <div
          className={`step-indicator__step ${
            i < currentStep
              ? 'step-indicator__step--done'
              : i === currentStep
              ? 'step-indicator__step--active'
              : ''
          }`}
        >
          <span className="step-indicator__number">
            {i < currentStep ? '✓' : i + 1}
          </span>
          <span className="step-indicator__label">{step.label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div
            className={`step-indicator__line ${
              i < currentStep ? 'step-indicator__line--done' : ''
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// Reusable select field styled like Input
const SelectField = ({ label, required, error, children, ...props }) => (
  <div className="input-wrapper" style={{ marginBottom: '16px' }}>
    <label className="input-label">
      {label} {required && <span style={{ color: 'red' }}>*</span>}
    </label>
    <select
      className={`input-field ${error ? 'input-field--error' : ''}`}
      style={{
        width: '100%', padding: '10px 12px', border: '1px solid #ddd',
        borderRadius: '8px', fontSize: '14px', background: 'white',
        color: '#333', outline: 'none',
      }}
      {...props}
    >
      {children}
    </select>
    {error && <p className="input-error">{error}</p>}
  </div>
);

const PersonalDetailsPage = () => {
  const navigate = useNavigate();
  const { setPersonal, setFamily, setAcademic, setBackground, setReason,
          personal, family, academic, background, reason } = useApplication();

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ...personal, ...family, ...academic, ...background, ...reason
    },
  });

  const onSubmit = (data) => {
    // Save each section to context
    setPersonal({
      firstName:      data.firstName,
      lastName:       data.lastName,
      address:        data.address,
      cityVillage:    data.cityVillage,
      pincode:        data.pincode,
      aadhaarNumber:  data.aadhaarNumber,
    });

    setFamily({
      fatherName:             data.fatherName,
      fatherProfession:       data.fatherProfession,
      motherName:             data.motherName,
      motherProfession:       data.motherProfession,
      guardianName:           data.guardianName,
      guardianProfession:     data.guardianProfession,
      guardianStatus:         data.guardianStatus,
      numberOfEarningMembers: Number(data.numberOfEarningMembers),
      isOrphan:               data.isOrphan === 'true',
      isSingleParent:         data.isSingleParent === 'true',
    });

    setAcademic({
      educationalLevel:       data.educationalLevel,
      academicYear:           data.academicYear,
      currentGrade:           data.currentGrade,
      currentGradePercentage: Number(data.currentGradePercentage),
    });

    setBackground({
      studentDisabilityStatus: data.studentDisabilityStatus,
      parentDisabilityStatus:  data.parentDisabilityStatus,
      isFirstGenLearner:       data.isFirstGenLearner === 'true',
      isMinorityCommunity:     data.isMinorityCommunity === 'true',
      mediumOfInstruction:     data.mediumOfInstruction,
    });

    setReason({
      reasonForApplying:    data.reasonForApplying,
      nextOptionIfNotGiven: data.nextOptionIfNotGiven,
    });

    navigate('/apply/documents');
  };

  return (
    <PageLayout headerProps={{ showBack: true, title: 'Application Form' }}>
      <StepIndicator currentStep={0} />

      <form onSubmit={handleSubmit(onSubmit)} className="form-page" noValidate>

        {/* ── PERSONAL DETAILS ── */}
        <section className="form-section">
          <h2 className="form-section__title">Personal Details</h2>

          <div className="form-row">
            <Input
              label="First Name" placeholder="First name" required
              error={errors.firstName?.message}
              {...register('firstName', { required: 'First name is required' })}
            />
            <Input
              label="Last Name" placeholder="Last name" required
              error={errors.lastName?.message}
              {...register('lastName', { required: 'Last name is required' })}
            />
          </div>

          <Input
            label="Address" placeholder="House no, Street, Area" required
            error={errors.address?.message}
            {...register('address', { required: 'Address is required' })}
          />

          <div className="form-row">
            <Input
              label="City / Village" placeholder="City or Village" required
              error={errors.cityVillage?.message}
              {...register('cityVillage', { required: 'City/Village is required' })}
            />
            <Input
              label="Pincode" placeholder="500001" required
              error={errors.pincode?.message}
              {...register('pincode', {
                required: 'Pincode is required',
                pattern: { value: /^\d{6}$/, message: 'Enter valid 6-digit pincode' }
              })}
            />
          </div>

          <Input
            label="Aadhaar Number" placeholder="12 digit Aadhaar" required
            error={errors.aadhaarNumber?.message}
            {...register('aadhaarNumber', {
              required: 'Aadhaar is required',
              pattern: { value: /^\d{12}$/, message: 'Enter valid 12-digit Aadhaar' }
            })}
          />
        </section>

        {/* ── FAMILY DETAILS ── */}
        <section className="form-section">
          <h2 className="form-section__title">Family Details</h2>

          <div className="form-row">
            <Input
              label="Father Name" placeholder="Father's full name" required
              error={errors.fatherName?.message}
              {...register('fatherName', { required: 'Father name is required' })}
            />
            <Input
              label="Father Profession" placeholder="e.g. Farmer, Teacher" required
              error={errors.fatherProfession?.message}
              {...register('fatherProfession', { required: 'Father profession is required' })}
            />
          </div>

          <div className="form-row">
            <Input
              label="Mother Name" placeholder="Mother's full name" required
              error={errors.motherName?.message}
              {...register('motherName', { required: 'Mother name is required' })}
            />
            <Input
              label="Mother Profession" placeholder="e.g. Homemaker" required
              error={errors.motherProfession?.message}
              {...register('motherProfession', { required: 'Mother profession is required' })}
            />
          </div>

          <div className="form-row">
            <Input
              label="Guardian Name (Optional)" placeholder="Guardian's full name"
              {...register('guardianName')}
            />
            <Input
              label="Guardian Profession (Optional)" placeholder="Guardian's profession"
              {...register('guardianProfession')}
            />
          </div>

          <SelectField
            label="Select Guardian Status" required
            error={errors.guardianStatus?.message}
            {...register('guardianStatus', { required: 'Guardian status is required' })}
          >
            <option value="">Select status</option>
            <option value="FATHER">Father</option>
            <option value="MOTHER">Mother</option>
            <option value="GUARDIAN">Guardian</option>
            <option value="SELF">Self</option>
          </SelectField>

          <Input
            label="Number of Earning Members in Household"
            type="number" placeholder="e.g. 2" required
            error={errors.numberOfEarningMembers?.message}
            {...register('numberOfEarningMembers', {
              required: 'This field is required',
              min: { value: 0, message: 'Must be 0 or more' }
            })}
          />

          <div className="form-row">
            <SelectField
              label="Are you an Orphan?" required
              error={errors.isOrphan?.message}
              {...register('isOrphan', { required: 'This field is required' })}
            >
              <option value="">Select</option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </SelectField>

            <SelectField
              label="Are you from Single-Parent Household?" required
              error={errors.isSingleParent?.message}
              {...register('isSingleParent', { required: 'This field is required' })}
            >
              <option value="">Select</option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </SelectField>
          </div>
        </section>

        {/* ── ACADEMIC DETAILS ── */}
        <section className="form-section">
          <h2 className="form-section__title">Academic Details</h2>

          <SelectField
            label="Educational Level" required
            error={errors.educationalLevel?.message}
            {...register('educationalLevel', { required: 'Educational level is required' })}
          >
            <option value="">Select level</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Intermediate 1st Year">Intermediate 1st Year</option>
            <option value="Intermediate 2nd Year">Intermediate 2nd Year</option>
            <option value="Degree">Degree</option>
            <option value="Diploma">Diploma</option>
            <option value="ITI">ITI</option>
            <option value="PG">PG</option>
            <option value="Professional">Professional</option>
          </SelectField>

          <Input
            label="Academic Year Applied For" placeholder="e.g. 2025-2026" required
            error={errors.academicYear?.message}
            {...register('academicYear', { required: 'Academic year is required' })}
          />

          <div className="form-row">
            <Input
              label="Current Grade" placeholder="e.g. A, B+" required
              error={errors.currentGrade?.message}
              {...register('currentGrade', { required: 'Current grade is required' })}
            />
            <Input
              label="Current Grade Percentage" type="number"
              placeholder="e.g. 85" required
              error={errors.currentGradePercentage?.message}
              {...register('currentGradePercentage', {
                required: 'Percentage is required',
                min: { value: 0, message: 'Min 0' },
                max: { value: 100, message: 'Max 100' }
              })}
            />
          </div>
        </section>

        {/* ── BACKGROUND ── */}
        <section className="form-section">
          <h2 className="form-section__title">Background Information</h2>

          <SelectField
            label="Student Disability Status" required
            error={errors.studentDisabilityStatus?.message}
            {...register('studentDisabilityStatus', { required: 'This field is required' })}
          >
            <option value="">Select</option>
            <option value="NONE">No Disability</option>
            <option value="PHYSICAL">Physical Disability</option>
            <option value="VISUAL">Visual Impairment</option>
            <option value="HEARING">Hearing Impairment</option>
            <option value="OTHER">Other</option>
          </SelectField>

          <SelectField
            label="Parent/Guardian Disability Status" required
            error={errors.parentDisabilityStatus?.message}
            {...register('parentDisabilityStatus', { required: 'This field is required' })}
          >
            <option value="">Select</option>
            <option value="NONE">No Disability</option>
            <option value="PHYSICAL">Physical Disability</option>
            <option value="VISUAL">Visual Impairment</option>
            <option value="HEARING">Hearing Impairment</option>
            <option value="OTHER">Other</option>
          </SelectField>

          <div className="form-row">
            <SelectField
              label="Are you a First-Gen Learner?" required
              error={errors.isFirstGenLearner?.message}
              {...register('isFirstGenLearner', { required: 'This field is required' })}
            >
              <option value="">Select</option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </SelectField>

            <SelectField
              label="Do you belong to a Minority Community?" required
              error={errors.isMinorityCommunity?.message}
              {...register('isMinorityCommunity', { required: 'This field is required' })}
            >
              <option value="">Select</option>
              <option value="false">No</option>
              <option value="true">Yes</option>
            </SelectField>
          </div>

          <Input
            label="Medium of Instruction / Home Language"
            placeholder="e.g. Telugu, English, Urdu" required
            error={errors.mediumOfInstruction?.message}
            {...register('mediumOfInstruction', { required: 'This field is required' })}
          />
        </section>

        {/* ── REASON ── */}
        <section className="form-section">
          <h2 className="form-section__title">Reason for Applying</h2>

          <div className="al-field">
            <label style={{ fontWeight: 500, fontSize: '14px' }}>
              Reason for Applying <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              placeholder="Explain why you are applying for this scholarship..."
              rows={4}
              style={{
                width: '100%', padding: '10px 12px', border: '1px solid #ddd',
                borderRadius: '8px', fontSize: '14px', resize: 'vertical',
                marginTop: '6px', outline: 'none', fontFamily: 'inherit'
              }}
              {...register('reasonForApplying', { required: 'Reason is required' })}
            />
            {errors.reasonForApplying && (
              <p style={{ color: 'red', fontSize: '12px' }}>{errors.reasonForApplying.message}</p>
            )}
          </div>

          <div className="al-field" style={{ marginTop: '16px' }}>
            <label style={{ fontWeight: 500, fontSize: '14px' }}>
              Next Option if Not Given <span style={{ color: 'red' }}>*</span>
            </label>
            <textarea
              placeholder="What will you do if this scholarship is not granted?"
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', border: '1px solid #ddd',
                borderRadius: '8px', fontSize: '14px', resize: 'vertical',
                marginTop: '6px', outline: 'none', fontFamily: 'inherit'
              }}
              {...register('nextOptionIfNotGiven', { required: 'This field is required' })}
            />
            {errors.nextOptionIfNotGiven && (
              <p style={{ color: 'red', fontSize: '12px' }}>{errors.nextOptionIfNotGiven.message}</p>
            )}
          </div>
        </section>

        <div className="form-actions">
          <Button variant="secondary" size="lg" type="button"
            onClick={() => navigate('/ApplicantLandingPage')}>
            Save Draft
          </Button>
          <Button variant="primary" size="lg" type="submit">
            Next →
          </Button>
        </div>

      </form>
    </PageLayout>
  );
};

export default PersonalDetailsPage;