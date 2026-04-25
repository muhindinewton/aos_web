'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Camera,
  X,
  Plus,
  MapPin,
  ChevronRight,
  Check,
  ImagePlus,
  Tag,
  FileText,
  DollarSign,
  Eye,
  Upload,
  Trash2,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { categories } from '../../lib/data';

type Step = 'category' | 'details' | 'description' | 'pricing' | 'preview';

interface FormData {
  category: string;
  subcategory: string;
  title: string;
  location: string;
  images: string[];
  condition: string;
  brand: string;
  description: string;
  price: string;
  originalPrice: string;
  negotiable: boolean;
  contactForPrice: boolean;
}

const conditions = ['Brand New', 'Like New', 'Good', 'Fair', 'For Parts'];

const categoryFields: Record<string, { key: string; label: string; required?: boolean; options?: string[]; type?: string }[]> = {
  'Vehicles': [
    { key: 'make', label: 'Make', required: true, options: ['Toyota', 'Nissan', 'Honda', 'Mercedes-Benz', 'BMW', 'Volkswagen', 'Mazda', 'Subaru', 'Mitsubishi', 'Ford', 'Other'] },
    { key: 'model', label: 'Model', required: true, type: 'text' },
    { key: 'year', label: 'Year', required: true, options: Array.from({ length: 30 }, (_, i) => `${2025 - i}`) },
    { key: 'transmission', label: 'Transmission', required: true, options: ['Automatic', 'Manual', 'CVT'] },
    { key: 'fuel', label: 'Fuel Type', required: true, options: ['Petrol', 'Diesel', 'Hybrid', 'Electric'] },
    { key: 'mileage', label: 'Mileage (KM)', type: 'number' },
    { key: 'color', label: 'Color', options: ['Black', 'White', 'Silver', 'Grey', 'Blue', 'Red', 'Other'] },
  ],
  'Phones': [
    { key: 'brand', label: 'Brand', required: true, options: ['Apple', 'Samsung', 'Xiaomi', 'Oppo', 'Tecno', 'Infinix', 'Nokia', 'Huawei', 'Google', 'Other'] },
    { key: 'storage', label: 'Storage', options: ['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'] },
    { key: 'ram', label: 'RAM', options: ['2GB', '3GB', '4GB', '6GB', '8GB', '12GB'] },
    { key: 'color', label: 'Color', options: ['Black', 'White', 'Gold', 'Silver', 'Blue', 'Red', 'Other'] },
  ],
  'Electronics': [
    { key: 'brand', label: 'Brand', required: true, type: 'text' },
    { key: 'model', label: 'Model', type: 'text' },
    { key: 'warranty', label: 'Warranty', options: ['No Warranty', 'Under Warranty', 'Extended Warranty'] },
  ],
  'Property': [
    { key: 'propertyType', label: 'Property Type', required: true, options: ['Apartment', 'House', 'Land', 'Commercial', 'Room'] },
    { key: 'bedrooms', label: 'Bedrooms', options: ['Studio', '1', '2', '3', '4', '5+'] },
    { key: 'bathrooms', label: 'Bathrooms', options: ['1', '2', '3', '4+'] },
    { key: 'size', label: 'Size (sq ft)', type: 'number' },
    { key: 'furnished', label: 'Furnished', options: ['Furnished', 'Semi-Furnished', 'Unfurnished'] },
  ],
  'Fashion': [
    { key: 'brand', label: 'Brand', type: 'text' },
    { key: 'size', label: 'Size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] },
    { key: 'color', label: 'Color', type: 'text' },
    { key: 'material', label: 'Material', type: 'text' },
  ],
  'Services': [
    { key: 'serviceType', label: 'Service Type', required: true, type: 'text' },
    { key: 'availability', label: 'Availability', options: ['Weekdays Only', 'Weekends Only', 'All Week', 'By Appointment'] },
    { key: 'experience', label: 'Years of Experience', options: ['Less than 1 year', '1-3 years', '3-5 years', '5-10 years', '10+ years'] },
  ],
};

const locations = [
  'Nairobi, Kenya',
  'Mombasa, Kenya',
  'Kisumu, Kenya',
  'Nakuru, Kenya',
  'Eldoret, Kenya',
  'Thika, Kenya',
  'Lagos, Nigeria',
  'Johannesburg, South Africa',
];

export default function PostAdPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState<Step>('category');
  const [formData, setFormData] = useState<FormData>({
    category: '',
    subcategory: '',
    title: '',
    location: '',
    images: [],
    condition: '',
    brand: '',
    description: '',
    price: '',
    originalPrice: '',
    negotiable: true,
    contactForPrice: false,
  });
  const [categorySpecifics, setCategorySpecifics] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const steps: { key: Step; label: string; icon: React.ElementType }[] = [
    { key: 'category', label: 'Category', icon: Tag },
    { key: 'details', label: 'Details', icon: FileText },
    { key: 'description', label: 'Description', icon: FileText },
    { key: 'pricing', label: 'Pricing', icon: DollarSign },
    { key: 'preview', label: 'Preview', icon: Eye },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      if (formData.images.length + newImages.length < 10) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, e.target!.result as string]
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 'category':
        if (!formData.category) newErrors.category = 'Please select a category';
        if (!formData.subcategory) newErrors.subcategory = 'Please select a subcategory';
        break;
      case 'details':
        if (!formData.title.trim()) newErrors.title = 'Please enter a title';
        if (!formData.location) newErrors.location = 'Please select a location';
        if (formData.images.length === 0) newErrors.images = 'Please add at least one photo';
        if (!formData.condition) newErrors.condition = 'Please select condition';
        // Validate category-specific required fields
        const fields = categoryFields[formData.category] || [];
        fields.forEach(field => {
          if (field.required && !categorySpecifics[field.key]) {
            newErrors[field.key] = `Please enter ${field.label.toLowerCase()}`;
          }
        });
        break;
      case 'description':
        if (!formData.description.trim()) newErrors.description = 'Please enter a description';
        if (formData.description.trim().length < 20) newErrors.description = 'Description must be at least 20 characters';
        break;
      case 'pricing':
        if (!formData.contactForPrice && !formData.price.trim()) {
          newErrors.price = 'Please enter a price';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  const selectedCategory = categories.find(c => c.name === formData.category);

  return (
    <div className="min-h-screen bg-theme pb-32">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface border-b border-theme">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-xl border border-theme hover:bg-elevated transition-colors">
            <ArrowLeft className="w-5 h-5 text-theme-primary" />
          </button>
          <h1 className="text-lg font-bold text-theme-primary">Post Your Ad</h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <React.Fragment key={step.key}>
              <button
                onClick={() => index < currentStepIndex && setCurrentStep(step.key)}
                disabled={index > currentStepIndex}
                className={`flex flex-col items-center gap-1 ${index <= currentStepIndex ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  index < currentStepIndex
                    ? 'bg-green-500 text-white'
                    : index === currentStepIndex
                    ? 'bg-primary text-white'
                    : 'bg-elevated text-theme-muted'
                }`}>
                  {index < currentStepIndex ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <span className={`text-xs font-medium ${index === currentStepIndex ? 'text-primary' : 'text-theme-muted'}`}>
                  {step.label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${index < currentStepIndex ? 'bg-green-500' : 'bg-elevated'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-surface border border-theme rounded-2xl p-6">
          {/* Category Selection */}
          {currentStep === 'category' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-theme-primary mb-2">Select Category</h2>
                <p className="text-sm text-theme-secondary">Choose the category that best describes your item</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.filter(c => c.id !== 'all').map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setFormData(prev => ({ ...prev, category: cat.name, subcategory: '' }))}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      formData.category === cat.name
                        ? 'border-primary bg-primary/5'
                        : 'border-theme hover:border-primary/30'
                    }`}
                  >
                    <span className={`font-medium ${formData.category === cat.name ? 'text-primary' : 'text-theme-primary'}`}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> {errors.category}
                </p>
              )}

              {formData.category && selectedCategory && selectedCategory.subcategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-theme-primary mb-3">Subcategory</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategory.subcategories.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setFormData(prev => ({ ...prev, subcategory: sub }))}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          formData.subcategory === sub
                            ? 'bg-primary text-white'
                            : 'bg-elevated text-theme-secondary hover:bg-primary/10 hover:text-primary'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                  {errors.subcategory && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                      <AlertCircle className="w-4 h-4" /> {errors.subcategory}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Details */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-theme-primary mb-2">Item Details</h2>
                <p className="text-sm text-theme-secondary">Add photos and basic information about your item</p>
              </div>

              {/* Photos */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-3">
                  Photos <span className="text-red-500">*</span>
                  <span className="text-theme-muted font-normal ml-2">({formData.images.length}/10)</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-theme group">
                      <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-primary text-white text-[10px] font-bold rounded">
                          Cover
                        </span>
                      )}
                    </div>
                  ))}
                  {formData.images.length < 10 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-theme hover:border-primary flex flex-col items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-6 h-6 text-theme-muted" />
                      <span className="text-xs text-theme-muted">Add</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {errors.images && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                    <AlertCircle className="w-4 h-4" /> {errors.images}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., iPhone 14 Pro Max 256GB Space Black"
                  maxLength={100}
                  className="w-full bg-elevated border border-theme rounded-xl py-3 px-4 text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-theme-muted mt-1">{formData.title.length}/100 characters</p>
                {errors.title && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" /> {errors.title}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-theme-muted" />
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-elevated border border-theme rounded-xl py-3 pl-10 pr-4 text-theme-primary appearance-none focus:outline-none focus:border-primary"
                  >
                    <option value="">Select location</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                {errors.location && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" /> {errors.location}
                  </p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">
                  Condition <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {conditions.map(cond => (
                    <button
                      key={cond}
                      onClick={() => setFormData(prev => ({ ...prev, condition: cond }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        formData.condition === cond
                          ? 'bg-primary text-white'
                          : 'bg-elevated text-theme-secondary hover:bg-primary/10'
                      }`}
                    >
                      {cond}
                    </button>
                  ))}
                </div>
                {errors.condition && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                    <AlertCircle className="w-4 h-4" /> {errors.condition}
                  </p>
                )}
              </div>

              {/* Category-specific fields */}
              {categoryFields[formData.category] && (
                <div className="space-y-4 pt-4 border-t border-theme">
                  <h3 className="font-medium text-theme-primary">Additional Details</h3>
                  {categoryFields[formData.category].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-theme-primary mb-2">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      {field.options ? (
                        <select
                          value={categorySpecifics[field.key] || ''}
                          onChange={(e) => setCategorySpecifics(prev => ({ ...prev, [field.key]: e.target.value }))}
                          className="w-full bg-elevated border border-theme rounded-xl py-3 px-4 text-theme-primary appearance-none focus:outline-none focus:border-primary"
                        >
                          <option value="">Select {field.label.toLowerCase()}</option>
                          {field.options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type || 'text'}
                          value={categorySpecifics[field.key] || ''}
                          onChange={(e) => setCategorySpecifics(prev => ({ ...prev, [field.key]: e.target.value }))}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                          className="w-full bg-elevated border border-theme rounded-xl py-3 px-4 text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-primary"
                        />
                      )}
                      {errors[field.key] && (
                        <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-4 h-4" /> {errors[field.key]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {currentStep === 'description' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-theme-primary mb-2">Description</h2>
                <p className="text-sm text-theme-secondary">Write a detailed description to attract buyers</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-theme-primary mb-2">
                  Product Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your item in detail. Include condition, features, reason for selling, etc."
                  rows={8}
                  className="w-full bg-elevated border border-theme rounded-xl py-3 px-4 text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-primary resize-none"
                />
                <p className="text-xs text-theme-muted mt-1">{formData.description.length} characters (minimum 20)</p>
                {errors.description && (
                  <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4" /> {errors.description}
                  </p>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-4">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-700 dark:text-blue-400 text-sm">Tips for a great description</p>
                    <ul className="text-xs text-blue-600 dark:text-blue-300 mt-2 space-y-1">
                      <li>• Mention the item&apos;s condition honestly</li>
                      <li>• Include key specifications and features</li>
                      <li>• State what&apos;s included in the sale</li>
                      <li>• Mention any defects or issues</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing */}
          {currentStep === 'pricing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-theme-primary mb-2">Set Your Price</h2>
                <p className="text-sm text-theme-secondary">Choose how you want to price your item</p>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 rounded-xl border border-theme hover:border-primary/30 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.contactForPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactForPrice: e.target.checked }))}
                    className="w-5 h-5 rounded border-theme text-primary focus:ring-primary"
                  />
                  <div>
                    <p className="font-medium text-theme-primary">Contact for Price</p>
                    <p className="text-sm text-theme-muted">Let buyers contact you to discuss pricing</p>
                  </div>
                </label>

                {!formData.contactForPrice && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-theme-primary mb-2">
                        Price (KES) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted font-medium">KES</span>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0"
                          className="w-full bg-elevated border border-theme rounded-xl py-3 pl-14 pr-4 text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-primary text-lg font-semibold"
                        />
                      </div>
                      {errors.price && (
                        <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle className="w-4 h-4" /> {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-primary mb-2">
                        Original Price (Optional)
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-muted font-medium">KES</span>
                        <input
                          type="number"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                          placeholder="0"
                          className="w-full bg-elevated border border-theme rounded-xl py-3 pl-14 pr-4 text-theme-primary placeholder:text-theme-muted focus:outline-none focus:border-primary"
                        />
                      </div>
                      <p className="text-xs text-theme-muted mt-1">Show buyers the original price to highlight savings</p>
                    </div>

                    <label className="flex items-center gap-3 p-4 rounded-xl border border-theme hover:border-primary/30 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.negotiable}
                        onChange={(e) => setFormData(prev => ({ ...prev, negotiable: e.target.checked }))}
                        className="w-5 h-5 rounded border-theme text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium text-theme-primary">Price is Negotiable</p>
                        <p className="text-sm text-theme-muted">Let buyers know you&apos;re open to offers</p>
                      </div>
                    </label>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Preview */}
          {currentStep === 'preview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-theme-primary mb-2">Preview Your Listing</h2>
                <p className="text-sm text-theme-secondary">Review your listing before publishing</p>
              </div>

              <div className="border border-theme rounded-xl overflow-hidden">
                {/* Image */}
                {formData.images.length > 0 && (
                  <div className="aspect-video bg-elevated relative">
                    <img src={formData.images[0]} alt="Preview" className="w-full h-full object-cover" />
                    {formData.images.length > 1 && (
                      <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                        +{formData.images.length - 1} more
                      </span>
                    )}
                  </div>
                )}
                
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-lg font-bold text-theme-primary">{formData.title || 'Untitled'}</h3>
                    <div className="text-right">
                      {formData.contactForPrice ? (
                        <span className="text-primary font-semibold">Contact for Price</span>
                      ) : (
                        <>
                          <p className="text-xl font-bold text-primary">KES {Number(formData.price || 0).toLocaleString()}</p>
                          {formData.originalPrice && (
                            <p className="text-sm text-theme-muted line-through">KES {Number(formData.originalPrice).toLocaleString()}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">{formData.category}</span>
                    {formData.subcategory && (
                      <span className="px-3 py-1 bg-elevated text-theme-secondary text-sm rounded-full">{formData.subcategory}</span>
                    )}
                    <span className="px-3 py-1 bg-elevated text-theme-secondary text-sm rounded-full">{formData.condition}</span>
                    {formData.negotiable && !formData.contactForPrice && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-sm rounded-full">Negotiable</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-sm text-theme-muted">
                    <MapPin className="w-4 h-4" />
                    {formData.location || 'Location not set'}
                  </div>

                  <p className="text-sm text-theme-secondary line-clamp-3">{formData.description || 'No description'}</p>

                  {Object.keys(categorySpecifics).length > 0 && (
                    <div className="pt-3 border-t border-theme">
                      <p className="text-sm font-medium text-theme-primary mb-2">Specifications</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(categorySpecifics).filter(([_, v]) => v).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-theme-muted capitalize">{key}: </span>
                            <span className="text-theme-primary">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-theme p-4 md:relative md:border-0 md:bg-transparent md:p-0 md:mt-6">
          <div className="max-w-3xl mx-auto flex gap-3">
            {currentStepIndex > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-xl border border-theme text-theme-primary font-semibold hover:bg-elevated transition-colors"
              >
                Back
              </button>
            )}
            {currentStep === 'preview' ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Publish Listing
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors flex items-center justify-center gap-2"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-theme-primary mb-2">Listing Published!</h2>
            <p className="text-theme-secondary mb-6">Your ad is now live and visible to buyers.</p>
            <div className="flex flex-col gap-3">
              <Link
                href="/sell/listings"
                className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
              >
                View My Listings
              </Link>
              <Link
                href="/"
                className="w-full py-3 rounded-xl border border-theme text-theme-primary font-semibold hover:bg-elevated transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
