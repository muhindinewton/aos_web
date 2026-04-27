'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../../components/protected-route';
import {
  ChevronLeft,
  Building2,
  FileText,
  BadgeCheck,
  Store,
  Phone,
  MapPin,
  Tag,
  ChevronDown,
  Info,
  Upload,
  Check,
  CheckCircle,
  Circle,
  Lightbulb,
  Briefcase,
  X,
} from 'lucide-react';

const businessTypes = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Company',
  'Corporation',
];

const steps = [
  { title: 'Business Info', subtitle: 'Basic details', icon: Building2 },
  { title: 'Documents', subtitle: 'Registration certificate', icon: FileText },
  { title: 'Review', subtitle: 'Submit for verification', icon: BadgeCheck },
];

function BusinessVerificationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Sole Proprietorship');
  const [selling, setSelling] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [documentUploaded, setDocumentUploaded] = useState(false);

  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 0) {
      if (!businessName.trim()) newErrors.businessName = 'Business name is required';
      if (!phone.trim()) newErrors.phone = 'Business phone is required';
      if (!location.trim()) newErrors.location = 'Physical location is required';
    } else if (currentStep === 1) {
      if (!documentUploaded) newErrors.document = 'Registration certificate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = () => {
    if (currentStep === 0) {
      return businessName.trim() && phone.trim() && location.trim();
    } else if (currentStep === 1) {
      return documentUploaded;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setShowSuccessModal(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-theme">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-theme border-b border-theme">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-xl bg-surface border border-theme flex items-center justify-center text-theme-primary hover:bg-elevated transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="flex-1 text-center text-lg font-semibold text-theme-primary">
              Business Verification
            </h1>
            <div className="w-10" />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              return (
                <React.Fragment key={index}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                        ? 'bg-primary text-white'
                        : 'bg-elevated text-theme-muted'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-10 h-1 rounded-full transition-colors ${
                        isCompleted ? 'bg-emerald-500' : 'bg-theme'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto px-4 pb-32">
          {currentStep === 0 && (
            <BusinessInfoStep
              businessName={businessName}
              setBusinessName={setBusinessName}
              businessType={businessType}
              setBusinessType={setBusinessType}
              selling={selling}
              setSelling={setSelling}
              phone={phone}
              setPhone={setPhone}
              location={location}
              setLocation={setLocation}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {currentStep === 1 && (
            <DocumentsStep
              businessType={businessType}
              documentUploaded={documentUploaded}
              setDocumentUploaded={setDocumentUploaded}
              errors={errors}
              setErrors={setErrors}
            />
          )}
          {currentStep === 2 && (
            <ReviewStep
              businessName={businessName}
              businessType={businessType}
              selling={selling}
              phone={phone}
              location={location}
              documentUploaded={documentUploaded}
            />
          )}
        </div>

        {/* Bottom Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-theme p-4">
          <div className="max-w-2xl mx-auto flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3.5 rounded-full border border-theme text-theme-primary font-semibold hover:bg-elevated transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`flex-1 py-3.5 rounded-full font-semibold transition-colors ${
                isStepValid()
                  ? 'bg-primary text-white hover:bg-primary-hover'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentStep === steps.length - 1 ? 'Submit for Verification' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-surface rounded-3xl w-full max-w-sm p-6 text-center animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <Briefcase className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-xl font-bold text-theme-primary mb-3">Application Submitted!</h2>
            <p className="text-sm text-theme-muted mb-6 leading-relaxed">
              Your business verification is under review. We'll notify you within 2-5 business
              days.
            </p>
            <button
              onClick={() => router.push('/account')}
              className="w-full py-3.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function BusinessVerificationPageWrapper() {
  return <ProtectedRoute><BusinessVerificationPage /></ProtectedRoute>;
}

function StepHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8">
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-theme-primary mb-2">{title}</h2>
      <p className="text-sm text-theme-muted leading-relaxed">{description}</p>
    </div>
  );
}

function InputField({
  label,
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  type = 'text',
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ElementType;
  error?: string;
  type?: string;
}) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-theme-primary mb-2">{label}</label>
      <div
        className={`flex items-center gap-3 bg-surface border rounded-xl px-4 py-3 transition-colors ${
          error ? 'border-red-500' : 'border-theme focus-within:border-primary'
        }`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${error ? 'text-red-500' : 'text-theme-muted'}`} />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-theme-primary placeholder:text-theme-muted text-sm outline-none"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1.5 ml-1">{error}</p>}
    </div>
  );
}

function BusinessInfoStep({
  businessName,
  setBusinessName,
  businessType,
  setBusinessType,
  selling,
  setSelling,
  phone,
  setPhone,
  location,
  setLocation,
  errors,
  setErrors,
}: {
  businessName: string;
  setBusinessName: (v: string) => void;
  businessType: string;
  setBusinessType: (v: string) => void;
  selling: string;
  setSelling: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  location: string;
  setLocation: (v: string) => void;
  errors: Record<string, string>;
  setErrors: (v: Record<string, string>) => void;
}) {
  return (
    <>
      <StepHeader
        icon={Building2}
        title="Business Information"
        description="Enter your basic business details. You can add more information in your seller storefront after verification."
      />

      <InputField
        label="Business Name *"
        placeholder="Enter your business name"
        value={businessName}
        onChange={(v) => {
          setBusinessName(v);
          setErrors({ ...errors, businessName: '' });
        }}
        icon={Store}
        error={errors.businessName}
      />

      <div className="mb-5">
        <label className="block text-sm font-medium text-theme-primary mb-2">Business Type</label>
        <div className="relative">
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="w-full bg-surface border border-theme rounded-xl px-4 py-3.5 text-sm text-theme-primary appearance-none cursor-pointer focus:border-primary outline-none"
          >
            {businessTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted pointer-events-none" />
        </div>
      </div>

      <InputField
        label="What are you selling?"
        placeholder="e.g., Electronics, Clothing, Food, Services..."
        value={selling}
        onChange={setSelling}
        icon={Tag}
      />

      <InputField
        label="Business Phone *"
        placeholder="+254 XXX XXX XXX"
        value={phone}
        onChange={(v) => {
          setPhone(v);
          setErrors({ ...errors, phone: '' });
        }}
        icon={Phone}
        error={errors.phone}
        type="tel"
      />

      <InputField
        label="Physical Location *"
        placeholder="City/Town where business operates"
        value={location}
        onChange={(v) => {
          setLocation(v);
          setErrors({ ...errors, location: '' });
        }}
        icon={MapPin}
        error={errors.location}
      />

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-theme-primary leading-relaxed">
          Registration number, address, email, website, tax info, and operating hours can be added
          in your seller storefront after verification.
        </p>
      </div>
    </>
  );
}

function DocumentsStep({
  businessType,
  documentUploaded,
  setDocumentUploaded,
  errors,
  setErrors,
}: {
  businessType: string;
  documentUploaded: boolean;
  setDocumentUploaded: (v: boolean) => void;
  errors: Record<string, string>;
  setErrors: (v: Record<string, string>) => void;
}) {
  const showCR12 = businessType === 'Limited Company' || businessType === 'Corporation';

  return (
    <>
      <StepHeader
        icon={FileText}
        title="Registration Documents"
        description="Upload your official business registration certificate to verify your business is legally registered."
      />

      <div className="mb-5">
        <label className="block text-sm font-medium text-theme-primary mb-3">
          Certificate of Registration *
        </label>
        <button
          onClick={() => {
            setDocumentUploaded(true);
            setErrors({ ...errors, document: '' });
          }}
          className={`w-full p-5 rounded-2xl border-2 transition-colors ${
            documentUploaded
              ? 'border-emerald-500 bg-emerald-500/5'
              : errors.document
              ? 'border-red-500 bg-red-500/5'
              : 'border-theme hover:border-primary/50 bg-surface'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                documentUploaded
                  ? 'bg-emerald-500/20'
                  : errors.document
                  ? 'bg-red-500/20'
                  : 'bg-elevated'
              }`}
            >
              {documentUploaded ? (
                <Check className="w-6 h-6 text-emerald-500" />
              ) : (
                <FileText
                  className={`w-6 h-6 ${errors.document ? 'text-red-500' : 'text-theme-muted'}`}
                />
              )}
            </div>
            <div className="flex-1 text-left">
              <p
                className={`font-medium ${
                  documentUploaded
                    ? 'text-emerald-500'
                    : errors.document
                    ? 'text-red-500'
                    : 'text-theme-primary'
                }`}
              >
                {documentUploaded ? 'Document Uploaded' : 'Upload registration certificate'}
              </p>
              {!documentUploaded && (
                <p className="text-sm text-theme-muted">PDF, JPG, or PNG (max 5MB)</p>
              )}
            </div>
            {documentUploaded ? (
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            ) : (
              <Upload className={`w-6 h-6 ${errors.document ? 'text-red-500' : 'text-primary'}`} />
            )}
          </div>
        </button>
        {errors.document && <p className="text-xs text-red-500 mt-1.5 ml-1">{errors.document}</p>}
      </div>

      {showCR12 && (
        <div className="mb-5">
          <label className="block text-sm font-medium text-theme-primary mb-3">
            CR12 Form (Optional)
          </label>
          <button className="w-full p-5 rounded-2xl border border-theme hover:border-primary/50 bg-surface transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-elevated flex items-center justify-center">
                <FileText className="w-6 h-6 text-theme-muted" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-theme-primary">Upload CR12 form</p>
                <p className="text-sm text-theme-muted">PDF, JPG, or PNG (max 5MB)</p>
              </div>
              <Upload className="w-6 h-6 text-primary" />
            </div>
          </button>
        </div>
      )}

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-blue-600 dark:text-blue-400">Accepted Documents</span>
        </div>
        <ul className="space-y-2">
          {[
            'Certificate of Incorporation',
            'Business Registration Certificate',
            'Single Business Permit',
            'Trade License',
          ].map((doc) => (
            <li key={doc} className="flex items-center gap-2 text-sm text-theme-primary">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              {doc}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
        <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-theme-primary leading-relaxed">
          Tax documents (KRA PIN) and business address can be added later in your storefront
          settings.
        </p>
      </div>
    </>
  );
}

function ReviewStep({
  businessName,
  businessType,
  selling,
  phone,
  location,
  documentUploaded,
}: {
  businessName: string;
  businessType: string;
  selling: string;
  phone: string;
  location: string;
  documentUploaded: boolean;
}) {
  const checklist = [
    { label: 'Business Name & Type', complete: !!businessName },
    { label: 'Registration Document', complete: documentUploaded },
    { label: 'Contact Phone', complete: !!phone },
    { label: 'Physical Location', complete: !!location },
  ];

  const benefits = [
    'Verified business badge',
    'Customizable seller storefront',
    'Add address, hours & contacts later',
    'Higher visibility in search results',
    'Priority customer support',
  ];

  return (
    <>
      <StepHeader
        icon={BadgeCheck}
        title="Review & Submit"
        description="Review your business information before submitting for verification."
      />

      {/* Business Summary */}
      <div className="bg-surface border border-theme rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Store className="w-7 h-7 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-theme-primary truncate">
              {businessName || 'Your Business Name'}
            </h3>
            <p className="text-sm text-theme-muted">{businessType}</p>
          </div>
        </div>
        <div className="border-t border-theme pt-4 space-y-3">
          <ReviewItem label="Selling" value={selling || 'Not specified'} />
          <ReviewItem label="Phone" value={phone || 'Not provided'} />
          <ReviewItem label="Physical Location" value={location || 'Not provided'} />
        </div>
      </div>

      {/* Checklist */}
      <h3 className="font-semibold text-theme-primary mb-3">Verification Checklist</h3>
      <div className="space-y-2 mb-6">
        {checklist.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 bg-surface border border-theme rounded-xl px-4 py-3"
          >
            {item.complete ? (
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : (
              <Circle className="w-5 h-5 text-theme-muted" />
            )}
            <span className="text-sm text-theme-primary">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-theme-primary">Business Verification Benefits</span>
        </div>
        <ul className="space-y-2.5">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-center gap-2.5 text-sm text-theme-primary">
              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Terms */}
      <p className="text-xs text-theme-muted leading-relaxed">
        By submitting, you confirm that all information provided is accurate. You can add tax
        details, address, and operating hours in your storefront after verification. Processing
        typically takes 2-5 business days.
      </p>
    </>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-sm text-theme-muted">{label}</span>
      <span className="text-sm font-medium text-theme-primary text-right truncate">{value}</span>
    </div>
  );
}
