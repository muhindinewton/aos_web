'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  X,
  Check,
  MapPin,
  Camera,
  Upload,
  Plus,
  Play,
  ChevronRight,
  ArrowRight,
  LayoutGrid,
  Car,
  Home,
  Smartphone,
  Tv,
  Shirt,
  Sofa,
  Sparkles,
  Wrench,
  Baby,
  PawPrint,
  AlertCircle,
  CheckCircle,
  MoreVertical,
  Star,
  Trash2,
  Layers,
} from 'lucide-react';
import { categories } from '../../lib/data';

// ── Types & Data ──────────────────────────────────────────────
interface FormData {
  title: string;
  location: string;
  photos: string[];
  videos: string[];
  category: string;
  subcategory: string;
  specifics: Record<string, string>;
  description: string;
  price: string;
  offerPrice: string;
  negotiable: boolean;
  pricingModel: string | null;
  contactForQuote: boolean;
}

const LOCATIONS = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika', 'Malindi',
  'Kitale', 'Garissa', 'Nyeri', 'Machakos', 'Meru', 'Lamu', 'Naivasha',
];

const CATEGORY_FIELDS: Record<string, { key: string; label: string; required?: boolean; options?: string[]; type?: string }[]> = {
  'Phones': [
    { key: 'brand', label: 'Brand', required: true, options: ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Tecno', 'Infinix', 'Nokia', 'Huawei', 'Google', 'OnePlus', 'Other'] },
    { key: 'condition', label: 'Condition', required: true, options: ['Brand New', 'Used - Like New', 'Used - Good', 'Used - Fair', 'For Parts'] },
    { key: 'ram', label: 'RAM', options: ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB', '16GB'] },
    { key: 'storage', label: 'Storage', options: ['16GB', '32GB', '64GB', '128GB', '256GB', '512GB', '1TB'] },
    { key: 'color', label: 'Color', options: ['Black', 'White', 'Gold', 'Silver', 'Blue', 'Red', 'Green', 'Purple', 'Other'] },
  ],
  'Vehicles': [
    { key: 'make', label: 'Make', required: true, options: ['Toyota', 'Nissan', 'Honda', 'Mercedes-Benz', 'BMW', 'Volkswagen', 'Mazda', 'Subaru', 'Mitsubishi', 'Ford', 'Isuzu', 'Land Rover', 'Other'] },
    { key: 'model', label: 'Model', required: true, type: 'text' },
    { key: 'year', label: 'Year', required: true, options: Array.from({ length: 30 }, (_, i) => `${2025 - i}`) },
    { key: 'transmission', label: 'Transmission', required: true, options: ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'] },
    { key: 'fuel', label: 'Fuel Type', required: true, options: ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'LPG'] },
    { key: 'mileage', label: 'Mileage (KM)', type: 'number' },
    { key: 'condition', label: 'Condition', required: true, options: ['Brand New', 'Foreign Used', 'Locally Used'] },
    { key: 'color', label: 'Color', options: ['Black', 'White', 'Silver', 'Grey', 'Blue', 'Red', 'Green', 'Brown', 'Other'] },
  ],
  'Property': [
    { key: 'type', label: 'Property Type', required: true, options: ['House', 'Apartment', 'Bungalow', 'Mansion', 'Townhouse', 'Studio', 'Bedsitter', 'Single Room'] },
    { key: 'bedrooms', label: 'Bedrooms', required: true, options: ['Studio', '1', '2', '3', '4', '5', '6+'] },
    { key: 'bathrooms', label: 'Bathrooms', required: true, options: ['1', '2', '3', '4', '5+'] },
    { key: 'size', label: 'Size (sq ft)', type: 'number' },
    { key: 'furnished', label: 'Furnishing', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] },
    { key: 'parking', label: 'Parking', options: ['Yes', 'No'] },
  ],
  'Electronics': [
    { key: 'brand', label: 'Brand', required: true, options: ['Samsung', 'LG', 'Sony', 'Apple', 'HP', 'Dell', 'Lenovo', 'Asus', 'Hisense', 'TCL', 'Other'] },
    { key: 'condition', label: 'Condition', required: true, options: ['Brand New', 'Used - Like New', 'Used - Good', 'Used - Fair', 'For Parts'] },
    { key: 'type', label: 'Type', type: 'text' },
  ],
  'Fashion': [
    { key: 'type', label: 'Type', required: true, options: ['Men', 'Women', 'Unisex', 'Kids'] },
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'size', label: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Free Size'] },
    { key: 'color', label: 'Color', options: ['Black', 'White', 'Blue', 'Red', 'Green', 'Yellow', 'Pink', 'Brown', 'Grey', 'Multi', 'Other'] },
    { key: 'condition', label: 'Condition', required: true, options: ['Brand New with Tags', 'Brand New', 'Used - Like New', 'Used - Good'] },
  ],
  'Furniture': [
    { key: 'type', label: 'Type', required: true, options: ['Sofa', 'Bed', 'Table', 'Chair', 'Wardrobe', 'Desk', 'Shelf', 'Other'] },
    { key: 'condition', label: 'Condition', required: true, options: ['Brand New', 'Used - Like New', 'Used - Good', 'Used - Fair'] },
    { key: 'material', label: 'Material', options: ['Wood', 'Metal', 'Plastic', 'Glass', 'Fabric', 'Leather', 'Other'] },
  ],
  'Beauty': [
    { key: 'type', label: 'Type', required: true, options: ['Skin Care', 'Hair Care', 'Makeup', 'Fragrance', 'Personal Care', 'Health', 'Other'] },
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'condition', label: 'Condition', required: true, options: ['Brand New - Sealed', 'Brand New - Opened', 'Used'] },
  ],
  'Services': [
    { key: 'type', label: 'Service Type', required: true, options: ['Repair', 'Cleaning', 'Construction', 'Tutoring', 'Events', 'Transport', 'IT Services', 'Other'] },
    { key: 'availability', label: 'Availability', options: ['Full Time', 'Part Time', 'Weekends Only', 'On Call'] },
    { key: 'experience', label: 'Experience', options: ['Less than 1 year', '1-2 years', '3-5 years', '5-10 years', '10+ years'] },
  ],
  'Kids': [
    { key: 'type', label: 'Type', required: true, options: ['Clothing', 'Toys', 'Strollers', 'Furniture', 'Feeding', 'Other'] },
    { key: 'ageGroup', label: 'Age Group', options: ['0-6 months', '6-12 months', '1-2 years', '2-5 years', '5+ years'] },
    { key: 'condition', label: 'Condition', required: true, options: ['Brand New', 'Used - Like New', 'Used - Good'] },
  ],
  'Pets': [
    { key: 'type', label: 'Pet Type', required: true, options: ['Dogs', 'Cats', 'Birds', 'Fish', 'Rabbits', 'Other'] },
    { key: 'breed', label: 'Breed', type: 'text' },
    { key: 'age', label: 'Age', type: 'text' },
    { key: 'vaccinated', label: 'Vaccinated', options: ['Yes', 'No', 'Partially'] },
  ],
};

const SUBCATEGORIES: Record<string, string[]> = {
  'Phones': ['Mobile Phones', 'Tablets', 'Accessories', 'Smart Watches'],
  'Vehicles': ['Cars', 'Motorcycles', 'Trucks & Trailers', 'Vehicle Parts', 'Buses'],
  'Property': ['Houses for Sale', 'Houses for Rent', 'Land & Plots', 'Commercial Property'],
  'Electronics': ['Computers & Laptops', 'TVs & Audio', 'Video Games', 'Cameras'],
  'Fashion': ['Clothing', 'Shoes', 'Bags', 'Watches', 'Jewelry'],
  'Furniture': ['Living Room', 'Bedroom', 'Office', 'Kitchen', 'Outdoor'],
  'Beauty': ['Skin Care', 'Hair Care', 'Makeup', 'Fragrances'],
  'Services': ['Repair & Construction', 'Cleaning', 'Events', 'Tutoring', 'Other Services'],
  'Kids': ['Clothing', 'Toys', 'Strollers & Carriers', 'Furniture', 'Feeding'],
  'Pets': ['Dogs', 'Cats', 'Birds', 'Fish & Aquariums', 'Pet Supplies'],
};

const PRICING_MODELS = [
  { key: 'hourly', label: 'Hourly', hint: 'Per hour rate' },
  { key: 'daily', label: 'Daily', hint: 'Per day rate' },
  { key: 'monthly', label: 'Monthly', hint: 'Per month rate' },
  { key: 'project', label: 'Per Project', hint: 'Fixed project price' },
  { key: 'starting', label: 'Starting From', hint: 'Minimum price' },
];

// ── Component ─────────────────────────────────────────────────
export default function PostAdPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    location: '',
    photos: [],
    videos: [],
    category: '',
    subcategory: '',
    specifics: {},
    description: '',
    price: '',
    offerPrice: '',
    negotiable: false,
    pricingModel: null,
    contactForQuote: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [catPickerView, setCatPickerView] = useState<'categories' | 'subcategories'>('categories');
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [photoMenuIdx, setPhotoMenuIdx] = useState<number | null>(null);
  const [bgRemovalIdx, setBgRemovalIdx] = useState<number | null>(null);
  const [bgRemoving, setBgRemoving] = useState(false);
  const [selectedBg, setSelectedBg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const STEP_LABELS = ['Basic', 'Details', 'Description', 'Pricing'];

  const CATEGORY_ICONS: Record<string, React.ElementType> = {
    'Phones': Smartphone,
    'Vehicles': Car,
    'Property': Home,
    'Electronics': Tv,
    'Fashion': Shirt,
    'Furniture': Sofa,
    'Beauty': Sparkles,
    'Services': Wrench,
    'Kids': Baby,
    'Pets': PawPrint,
  };
  const isServices = formData.category === 'Services';

  // ── Validation ──────────────────────────────────────────────
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0) {
      if (!formData.title.trim()) newErrors.title = 'Please enter a title';
      if (!formData.location) newErrors.location = 'Please select a location';
      if (formData.photos.length === 0) newErrors.photos = 'Please add at least one photo';
      if (!formData.category) newErrors.category = 'Please select a category';
      if (!formData.subcategory) newErrors.subcategory = 'Please select a subcategory';
    }

    if (step === 1) {
      const fields = CATEGORY_FIELDS[formData.category] || [];
      fields.forEach(field => {
        if (field.required && !formData.specifics[field.key]) {
          newErrors[field.key] = `Please enter ${field.label.toLowerCase()}`;
        }
      });
    }

    if (step === 2) {
      if (!formData.description.trim()) newErrors.description = 'Please enter a description';
    }

    if (step === 3) {
      if (!formData.contactForQuote && !formData.price.trim()) {
        newErrors.price = 'Please enter a price';
      }
      if (isServices && !formData.contactForQuote && !formData.pricingModel) {
        newErrors.pricingModel = 'Please select a pricing model';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 3) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next > maxStepReached) setMaxStepReached(next);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else router.back();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  // ── Photo/Video handlers ────────────────────────────────────
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (formData.photos.length >= 10) return;
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setFormData(prev => ({ ...prev, photos: [...prev.photos, ev.target!.result as string] }));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      if (formData.videos.length >= 2) return;
      const reader = new FileReader();
      reader.onload = ev => {
        if (ev.target?.result) {
          setFormData(prev => ({ ...prev, videos: [...prev.videos, ev.target!.result as string] }));
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removePhoto = (idx: number) => {
    setFormData(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== idx) }));
    setPhotoMenuIdx(null);
  };

  const makeCover = (idx: number) => {
    if (idx === 0) { setPhotoMenuIdx(null); return; }
    setFormData(prev => {
      const photos = [...prev.photos];
      const [photo] = photos.splice(idx, 1);
      photos.unshift(photo);
      return { ...prev, photos };
    });
    setPhotoMenuIdx(null);
  };

  const startBgRemoval = (idx: number) => {
    setBgRemovalIdx(idx);
    setPhotoMenuIdx(null);
    setSelectedBg(null);
    setBgRemoving(false);
  };

  const simulateBgRemoval = () => {
    setBgRemoving(true);
    setTimeout(() => setBgRemoving(false), 1500);
  };
  const removeVideo = (idx: number) => setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== idx) }));

  // ── Render helpers ──────────────────────────────────────────
  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[field]}</p> : null;

  const SectionLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <h3 className="text-lg font-semibold text-theme-primary mb-3">
      {children} {required && <span className="text-red-500">*</span>}
    </h3>
  );

  // ── Success Modal ───────────────────────────────────────────
  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-6">
        <div className="bg-surface rounded-3xl p-8 text-center max-w-sm w-full">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-theme-primary mb-2">Ad Submitted!</h2>
          <p className="text-theme-secondary text-sm mb-6">We'll review your ad and notify you once it's approved.</p>
          <button onClick={() => router.push('/sell/listings')} className="w-full py-3 bg-primary text-white rounded-xl font-semibold">
            View My Listings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme flex flex-col">
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 bg-surface border-b border-theme">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={handleBack} className="w-10 h-10 rounded-full bg-elevated border border-theme flex items-center justify-center">
            <ArrowLeft className="w-5 h-5 text-theme-primary" />
          </button>
          <h1 className="flex-1 text-center text-lg font-semibold text-theme-primary">Create Ad</h1>
          <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-elevated border border-theme flex items-center justify-center">
            <X className="w-5 h-5 text-theme-primary" />
          </button>
        </div>
      </div>

      {/* ── Progress Indicator ── */}
      <div className="bg-surface border-b border-theme px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center">
          {STEP_LABELS.map((label, idx) => (
            <React.Fragment key={label}>
              <button
                onClick={() => idx <= maxStepReached && setCurrentStep(idx)}
                disabled={idx > maxStepReached}
                className="flex flex-col items-center flex-1"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                  idx < currentStep
                    ? 'bg-primary border-primary text-white'
                    : idx === currentStep
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-surface border-theme text-theme-muted'
                }`}>
                  {idx < currentStep ? <Check className="w-4 h-4" /> : idx + 1}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${idx <= currentStep ? 'text-primary' : 'text-theme-muted'}`}>
                  {label}
                </span>
              </button>
              {idx < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 rounded ${idx < currentStep ? 'bg-primary' : 'bg-elevated'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">

          {/* ═══════════════════ STEP 0: Basic Info ═══════════════════ */}
          {currentStep === 0 && (
            <div className="space-y-6">
              {/* Title */}
              <div>
                <SectionLabel required>Title</SectionLabel>
                <input
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  maxLength={80}
                  placeholder="Provide a descriptive title"
                  className="w-full bg-elevated rounded-xl px-4 py-3 text-theme-primary placeholder:text-theme-muted outline-none border border-theme focus:border-primary"
                />
                <div className="flex justify-between mt-1">
                  <FieldError field="title" />
                  <span className="text-xs text-theme-muted">{formData.title.length}/80</span>
                </div>
              </div>

              {/* Location */}
              <div>
                <SectionLabel required>Location</SectionLabel>
                <button
                  onClick={() => setShowLocationPicker(true)}
                  className="w-full flex items-center gap-3 bg-surface border border-theme rounded-xl px-4 py-3"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${formData.location ? 'bg-primary/10' : 'bg-elevated'}`}>
                    <MapPin className={`w-5 h-5 ${formData.location ? 'text-primary' : 'text-theme-muted'}`} />
                  </div>
                  <span className={formData.location ? 'text-theme-primary font-medium' : 'text-theme-muted'}>
                    {formData.location || 'Select location'}
                  </span>
                  <ChevronRight className="w-5 h-5 text-theme-muted ml-auto" />
                </button>
                <FieldError field="location" />
              </div>

              {/* Photos */}
              <div>
                <SectionLabel required>Photos</SectionLabel>
                {formData.photos.length === 0 ? (
                  <div className="flex gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-between bg-surface border border-theme rounded-xl px-4 py-[18px] hover:border-primary/50 transition-colors"
                    >
                      <span className="text-sm font-medium text-theme-primary">Upload Photos</span>
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Upload className="w-4 h-4 text-primary" />
                      </div>
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 flex items-center justify-between bg-surface border border-theme rounded-xl px-4 py-[18px] hover:border-primary/50 transition-colors"
                    >
                      <span className="text-sm font-medium text-theme-primary">Take Photos</span>
                      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Camera className="w-4 h-4 text-primary" />
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2.5 overflow-x-auto pb-2">
                    {/* Add button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-[90px] h-[100px] flex-shrink-0 rounded-xl bg-theme-primary flex flex-col items-center justify-center gap-1"
                    >
                      <Plus className="w-6 h-6 text-surface" />
                      <span className="text-[11px] text-surface font-medium">Add</span>
                    </button>
                    {/* Photo tiles */}
                    {formData.photos.map((photo, idx) => (
                      <div key={idx} className="relative w-[90px] h-[100px] flex-shrink-0">
                        <img src={photo} alt="" className="w-full h-full object-cover rounded-xl border border-theme" />
                        {/* Cover badge */}
                        {idx === 0 && (
                          <div className="absolute bottom-1 left-1 right-1 py-[2px] rounded bg-primary/90 flex items-center justify-center">
                            <span className="text-white text-[9px] font-semibold">Cover</span>
                          </div>
                        )}
                        {/* ⋮ menu button */}
                        <button
                          onClick={() => setPhotoMenuIdx(photoMenuIdx === idx ? null : idx)}
                          className="absolute top-1 right-1 w-6 h-6 rounded bg-black/50 flex items-center justify-center"
                        >
                          <MoreVertical className="w-3.5 h-3.5 text-white" />
                        </button>
                        {/* Dropdown menu */}
                        {photoMenuIdx === idx && (
                          <div className="absolute top-7 right-0 z-30 w-44 bg-surface border border-theme rounded-xl shadow-xl overflow-hidden">
                            {idx !== 0 && (
                              <button
                                onClick={() => makeCover(idx)}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-elevated text-left text-sm text-theme-primary"
                              >
                                <Star className="w-4 h-4 text-theme-muted" />
                                Make cover photo
                              </button>
                            )}
                            <button
                              onClick={() => startBgRemoval(idx)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-elevated text-left text-sm text-theme-primary"
                            >
                              <Layers className="w-4 h-4 text-theme-muted" />
                              Remove background
                            </button>
                            <div className="h-px bg-theme mx-2" />
                            <button
                              onClick={() => removePhoto(idx)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-red-50 text-left text-sm text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} />
                <FieldError field="photos" />
              </div>

              {/* Videos */}
              <div>
                <SectionLabel>Videos</SectionLabel>
                {formData.videos.length === 0 ? (
                  <div className="flex gap-3">
                    <button onClick={() => videoInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 bg-elevated border border-dashed border-theme rounded-xl py-4 hover:border-primary transition-colors">
                      <Upload className="w-5 h-5 text-theme-muted" />
                      <span className="text-sm text-theme-muted">Upload Video</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-elevated border border-dashed border-theme rounded-xl py-4 hover:border-primary transition-colors">
                      <Play className="w-5 h-5 text-theme-muted" />
                      <span className="text-sm text-theme-muted">Record Video</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    {formData.videos.map((_, idx) => (
                      <div key={idx} className="relative w-20 h-24 bg-elevated rounded-xl flex items-center justify-center">
                        <Play className="w-6 h-6 text-theme-muted" />
                        <button onClick={() => removeVideo(idx)} className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
              </div>

              {/* Category */}
              <div>
                <SectionLabel required>Category</SectionLabel>
                <button
                  onClick={() => { setCatPickerView('categories'); setShowCategoryPicker(true); }}
                  className="w-full flex items-center gap-3 bg-surface border border-theme rounded-xl px-4 py-3"
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${formData.category ? 'bg-primary/10' : 'bg-elevated'}`}>
                    <LayoutGrid className={`w-5 h-5 ${formData.category ? 'text-primary' : 'text-theme-muted'}`} />
                  </div>
                  <span className={`flex-1 text-left text-base ${
                    formData.category ? 'text-theme-primary font-medium' : 'text-theme-muted'
                  }`}>
                    {formData.category && formData.subcategory
                      ? `${formData.category} › ${formData.subcategory}`
                      : formData.category || 'Select a category'}
                  </span>
                  <ChevronRight className="w-5 h-5 text-theme-muted" />
                </button>
                <FieldError field="category" />
                <FieldError field="subcategory" />
              </div>
            </div>
          )}

          {/* ═══════════════════ STEP 1: Details ═══════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold text-theme-primary">Item Specifics</h2>
              <p className="text-sm text-theme-muted -mt-3">Provide details about your {formData.category.toLowerCase()}</p>

              {(CATEGORY_FIELDS[formData.category] || []).map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-theme-primary mb-2">
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.options ? (
                    <div className="flex flex-wrap gap-2">
                      {field.options.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setFormData(prev => ({ ...prev, specifics: { ...prev.specifics, [field.key]: opt } }))}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            formData.specifics[field.key] === opt
                              ? 'bg-primary text-white'
                              : 'bg-elevated text-theme-primary hover:bg-primary/10'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={formData.specifics[field.key] || ''}
                      onChange={e => setFormData(prev => ({ ...prev, specifics: { ...prev.specifics, [field.key]: e.target.value } }))}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      className="w-full bg-elevated rounded-xl px-4 py-3 text-theme-primary placeholder:text-theme-muted outline-none border border-theme focus:border-primary"
                    />
                  )}
                  <FieldError field={field.key} />
                </div>
              ))}
            </div>
          )}

          {/* ═══════════════════ STEP 2: Description ═══════════════════ */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-theme-primary">Description</h2>
              <p className="text-sm text-theme-muted -mt-2">Describe your item in detail</p>
              <textarea
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Include condition, features, reason for selling, and any other relevant details..."
                rows={8}
                className="w-full bg-elevated rounded-xl px-4 py-3 text-theme-primary placeholder:text-theme-muted outline-none border border-theme focus:border-primary resize-none"
              />
              <FieldError field="description" />
              <div className="text-xs text-theme-muted text-right">{formData.description.length} characters</div>
            </div>
          )}

          {/* ═══════════════════ STEP 3: Pricing ═══════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-theme-primary">Set Your Price</h2>

              {/* Contact for Quote toggle (Services) */}
              {isServices && (
                <label className="flex items-center gap-3 p-4 bg-elevated rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.contactForQuote}
                    onChange={e => setFormData(prev => ({ ...prev, contactForQuote: e.target.checked }))}
                    className="w-5 h-5 rounded accent-primary"
                  />
                  <div>
                    <p className="font-medium text-theme-primary">Contact for Quote</p>
                    <p className="text-xs text-theme-muted">Let buyers contact you for pricing</p>
                  </div>
                </label>
              )}

              {!formData.contactForQuote && (
                <>
                  {/* Pricing model for Services */}
                  {isServices && (
                    <div>
                      <label className="block text-sm font-medium text-theme-primary mb-2">Pricing Model *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {PRICING_MODELS.map(pm => (
                          <button
                            key={pm.key}
                            onClick={() => setFormData(prev => ({ ...prev, pricingModel: pm.key }))}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              formData.pricingModel === pm.key
                                ? 'border-primary bg-primary/5'
                                : 'border-theme hover:border-primary/30'
                            }`}
                          >
                            <p className={`font-medium text-sm ${formData.pricingModel === pm.key ? 'text-primary' : 'text-theme-primary'}`}>{pm.label}</p>
                            <p className="text-[10px] text-theme-muted">{pm.hint}</p>
                          </button>
                        ))}
                      </div>
                      <FieldError field="pricingModel" />
                    </div>
                  )}

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-theme-primary mb-2">Price (KES) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="Enter price"
                      className="w-full bg-elevated rounded-xl px-4 py-3 text-theme-primary placeholder:text-theme-muted outline-none border border-theme focus:border-primary"
                    />
                    <FieldError field="price" />
                  </div>

                  {/* Offer Price */}
                  {!isServices && (
                    <div>
                      <label className="block text-sm font-medium text-theme-primary mb-2">Offer Price (Optional)</label>
                      <input
                        type="number"
                        value={formData.offerPrice}
                        onChange={e => setFormData(prev => ({ ...prev, offerPrice: e.target.value }))}
                        placeholder="Discounted price if any"
                        className="w-full bg-elevated rounded-xl px-4 py-3 text-theme-primary placeholder:text-theme-muted outline-none border border-theme focus:border-primary"
                      />
                    </div>
                  )}

                  {/* Negotiable */}
                  <label className="flex items-center gap-3 p-4 bg-elevated rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.negotiable}
                      onChange={e => setFormData(prev => ({ ...prev, negotiable: e.target.checked }))}
                      className="w-5 h-5 rounded accent-primary"
                    />
                    <div>
                      <p className="font-medium text-theme-primary">Price is Negotiable</p>
                      <p className="text-xs text-theme-muted">Allow buyers to make offers</p>
                    </div>
                  </label>
                </>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Bottom Button ── */}
      <div className="sticky bottom-0 bg-surface border-t border-theme p-4">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className="w-full py-4 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : currentStep === 3 ? (
              'Post Ad'
            ) : (
              'Continue'
            )}
          </button>
        </div>
      </div>

      {/* Click-outside overlay for photo menu */}
      {photoMenuIdx !== null && (
        <div className="fixed inset-0 z-20" onClick={() => setPhotoMenuIdx(null)} />
      )}

      {/* ── Background Removal Modal ── */}
      {bgRemovalIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center">
          <div className="bg-surface w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-theme">
              <h3 className="text-base font-bold text-theme-primary">Remove Background</h3>
              <button onClick={() => setBgRemovalIdx(null)} className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center">
                <X className="w-4 h-4 text-theme-primary" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Preview */}
              <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-theme"
                style={{ background: selectedBg ?? 'repeating-conic-gradient(#e5e5e5 0% 25%, #ffffff 0% 50%) 0 0 / 20px 20px' }}>
                <img
                  src={formData.photos[bgRemovalIdx]}
                  alt=""
                  className={`w-full h-full object-contain transition-opacity ${bgRemoving ? 'opacity-30' : 'opacity-100'}`}
                />
                {bgRemoving && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                  </div>
                )}
              </div>

              {/* BG Colour presets */}
              <div>
                <p className="text-xs font-medium text-theme-muted mb-2">Background Colour</p>
                <div className="flex gap-2 flex-wrap">
                  {['transparent', '#ffffff', '#000000', '#f5f5f5', '#e3e8ff', '#fff3e0', '#e8f5e9', '#fce4ec'].map(col => (
                    <button
                      key={col}
                      onClick={() => { setSelectedBg(col === 'transparent' ? null : col); simulateBgRemoval(); }}
                      className={`w-9 h-9 rounded-lg border-2 transition-all ${selectedBg === col || (col === 'transparent' && !selectedBg) ? 'border-primary scale-110' : 'border-theme'}`}
                      style={{ background: col === 'transparent'
                        ? 'repeating-conic-gradient(#d1d5db 0% 25%, #fff 0% 50%) 0 0 / 10px 10px'
                        : col }}
                    />
                  ))}
                </div>
              </div>

              {/* Gradient presets */}
              <div>
                <p className="text-xs font-medium text-theme-muted mb-2">Gradient Backgrounds</p>
                <div className="flex gap-2">
                  {[
                    'linear-gradient(135deg,#ff6b6b,#ffe66d)',
                    'linear-gradient(135deg,#667eea,#764ba2)',
                    'linear-gradient(135deg,#11998e,#38ef7d)',
                    'linear-gradient(135deg,#fc5c7d,#6a82fb)',
                    'linear-gradient(135deg,#f7971e,#ffd200)',
                  ].map(grad => (
                    <button
                      key={grad}
                      onClick={() => { setSelectedBg(grad); simulateBgRemoval(); }}
                      className={`w-9 h-9 rounded-lg border-2 transition-all ${selectedBg === grad ? 'border-primary scale-110' : 'border-transparent'}`}
                      style={{ background: grad }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={() => setBgRemovalIdx(null)}
                className="w-full py-3 bg-primary text-white rounded-xl font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Category Picker Modal ── */}
      {showCategoryPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-surface w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-theme">
              {catPickerView === 'subcategories' && (
                <button onClick={() => setCatPickerView('categories')} className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center">
                  <ArrowLeft className="w-4 h-4 text-theme-primary" />
                </button>
              )}
              <h3 className="flex-1 text-lg font-bold text-theme-primary">
                {catPickerView === 'categories' ? 'Select Category' : pendingCategory}
              </h3>
              <button onClick={() => setShowCategoryPicker(false)} className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center">
                <X className="w-4 h-4 text-theme-primary" />
              </button>
            </div>

            {/* Category List */}
            {catPickerView === 'categories' && (
              <div className="overflow-y-auto p-4 space-y-3">
                {categories.filter(c => c.id !== 'all').map(cat => {
                  const Icon = CATEGORY_ICONS[cat.name] || LayoutGrid;
                  const subCount = (SUBCATEGORIES[cat.name] || []).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => { setPendingCategory(cat.name); setCatPickerView('subcategories'); }}
                      className="w-full flex items-center gap-4 p-4 bg-surface border border-theme rounded-xl hover:border-primary/30 transition-all"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-theme-primary">{cat.name}</p>
                        <p className="text-xs text-theme-muted">{subCount} subcategories</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-theme-muted" />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Subcategory List */}
            {catPickerView === 'subcategories' && pendingCategory && (
              <div className="overflow-y-auto p-4 space-y-3">
                {(SUBCATEGORIES[pendingCategory] || []).map(sub => (
                  <button
                    key={sub}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, category: pendingCategory!, subcategory: sub, specifics: {} }));
                      setShowCategoryPicker(false);
                    }}
                    className="w-full flex items-center gap-3 p-4 bg-surface border border-theme rounded-xl hover:border-primary/30 transition-all"
                  >
                    <span className="flex-1 text-left font-medium text-theme-primary">{sub}</span>
                    <div className="w-8 h-8 rounded-lg bg-elevated flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-theme-muted" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Location Picker Modal ── */}
      {showLocationPicker && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-surface w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-theme">
              <h3 className="text-lg font-bold text-theme-primary">Select Location</h3>
              <button onClick={() => setShowLocationPicker(false)} className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center">
                <X className="w-4 h-4 text-theme-primary" />
              </button>
            </div>
            <div className="overflow-y-auto p-2">
              {LOCATIONS.map(loc => (
                <button
                  key={loc}
                  onClick={() => { setFormData(prev => ({ ...prev, location: loc })); setShowLocationPicker(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                    formData.location === loc ? 'bg-primary/10' : 'hover:bg-elevated'
                  }`}
                >
                  <MapPin className={`w-5 h-5 ${formData.location === loc ? 'text-primary' : 'text-theme-muted'}`} />
                  <span className={formData.location === loc ? 'text-primary font-medium' : 'text-theme-primary'}>{loc}</span>
                  {formData.location === loc && <Check className="w-4 h-4 text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

