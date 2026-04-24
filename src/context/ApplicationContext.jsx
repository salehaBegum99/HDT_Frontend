import React, { createContext, useContext, useReducer, useCallback } from "react";

const ApplicationContext = createContext(null);

const INITIAL_STATE = {
  currentStep: 0,
  applicationId: null,
  personal:   { firstName: "", lastName: "", address: "", cityVillage: "", pincode: "", aadhaarNumber: "" },
  family:     { fatherName: "", fatherProfession: "", motherName: "", motherProfession: "", guardianName: "", guardianProfession: "", guardianStatus: "", numberOfEarningMembers: "", isOrphan: false, isSingleParent: false },
  academic:   { educationalLevel: "", academicYear: "", currentGrade: "", currentGradePercentage: "" },
  background: { studentDisabilityStatus: "", parentDisabilityStatus: "", isFirstGenLearner: false, isMinorityCommunity: false, mediumOfInstruction: "" },
  reason:     { reasonForApplying: "", nextOptionIfNotGiven: "" },
  // bank:       { accountNumber: "", ifscCode: "", bankName: "", accountHolderName: "" },
  documents:  { photo: null, aadhaarCard: null, marksheet: null, incomeProof: null, bankPassbook: null, feeReceipt: null },
  consent:    { agreedToTerms: false, otpVerified: false, phone: "" },
};

function applicationReducer(state, action) {
  switch (action.type) {
    case "SET_PERSONAL":    return { ...state, personal:   { ...state.personal,   ...action.payload } };
    case "SET_FAMILY":      return { ...state, family:     { ...state.family,     ...action.payload } };
    case "SET_ACADEMIC":    return { ...state, academic:   { ...state.academic,   ...action.payload } };
    case "SET_BACKGROUND":  return { ...state, background: { ...state.background, ...action.payload } };
    case "SET_REASON":      return { ...state, reason:     { ...state.reason,     ...action.payload } };
    // case "SET_BANK":        return { ...state, bank:       { ...state.bank,       ...action.payload } };
    case "SET_DOCUMENT":    return { ...state, documents:  { ...state.documents,  [action.payload.key]: action.payload.file } };
    case "SET_CONSENT":     return { ...state, consent:    { ...state.consent,    ...action.payload } };
    case "SET_STEP":        return { ...state, currentStep: action.payload };
    case "SET_APPLICATION_ID": return { ...state, applicationId: action.payload };
    case "RESET":           return INITIAL_STATE;
    default:                return state;
  }
}

export const ApplicationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(applicationReducer, INITIAL_STATE);

  const setPersonal   = useCallback((data) => dispatch({ type: "SET_PERSONAL",   payload: data }), []);
  const setFamily     = useCallback((data) => dispatch({ type: "SET_FAMILY",     payload: data }), []);
  const setAcademic   = useCallback((data) => dispatch({ type: "SET_ACADEMIC",   payload: data }), []);
  const setBackground = useCallback((data) => dispatch({ type: "SET_BACKGROUND", payload: data }), []);
  const setReason     = useCallback((data) => dispatch({ type: "SET_REASON",     payload: data }), []);
  // const setBank       = useCallback((data) => dispatch({ type: "SET_BANK",       payload: data }), []);
  const setDocument   = useCallback((key, file) => dispatch({ type: "SET_DOCUMENT", payload: { key, file } }), []);
  const setConsent    = useCallback((data) => dispatch({ type: "SET_CONSENT",    payload: data }), []);
  const setStep       = useCallback((step) => dispatch({ type: "SET_STEP",       payload: step }), []);
  const setApplicationId = useCallback((id) => dispatch({ type: "SET_APPLICATION_ID", payload: id }), []);
  const reset         = useCallback(() => dispatch({ type: "RESET" }), []);

  const nextStep = useCallback(() => setStep(Math.min(state.currentStep + 1, 3)), [state.currentStep, setStep]);
  const prevStep = useCallback(() => setStep(Math.max(state.currentStep - 1, 0)), [state.currentStep, setStep]);

  return (
    <ApplicationContext.Provider value={{
      ...state,
      setPersonal, setFamily, setAcademic, setBackground, setReason,
       setDocument, setConsent, setStep, setApplicationId,
      nextStep, prevStep, reset,
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) throw new Error("useApplication must be used within ApplicationProvider");
  return context;
};