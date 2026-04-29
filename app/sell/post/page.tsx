'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { type Crop as CropType, type PercentCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
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
  Crop,
  RotateCw,
  Wand2,
  ImageIcon,
  Pencil,
  Calendar,
  HeartHandshake,
  Wallet,
  Tag,
  MessageSquare,
  BadgeCheck,
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
  freeConsultation: boolean;
  requiresDeposit: boolean;
  scheduleSaleEnabled: boolean;
  startDate: string;
  endDate: string;
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
    freeConsultation: false,
    requiresDeposit: false,
    scheduleSaleEnabled: false,
    startDate: '',
    endDate: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [catPickerView, setCatPickerView] = useState<'categories' | 'subcategories'>('categories');
  const [pendingCategory, setPendingCategory] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [photoMenuIdx, setPhotoMenuIdx] = useState<number | null>(null);
  const [editPhotoIdx, setEditPhotoIdx] = useState<number | null>(null);
  const [editTool, setEditTool] = useState<'none'|'removebg'|'crop'>('none');
  const [bgStatus, setBgStatus] = useState<'idle'|'processing'|'preview'|'error'>('idle');
  const [bgResultUrl, setBgResultUrl] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<string | null>(null);
  const [bgError, setBgError] = useState<string|null>(null);
  const [bgApplied, setBgApplied] = useState(false);
  const [cropActive, setCropActive] = useState(false);
  const [crop, setCrop] = useState<CropType | undefined>();
  const [pctCrop, setPctCrop] = useState<PercentCrop | undefined>();
  const cropImgRef = useRef<HTMLImageElement>(null);
  const bgPickerRef = useRef<HTMLDivElement>(null);
  const [offerPriceError, setOfferPriceError] = useState<string | null>(null);
  const [pricingTypeChosen, setPricingTypeChosen] = useState(false);
  const [selSheet, setSelSheet] = useState<{ key: string; label: string; options: string[]; required?: boolean } | null>(null);
  const [otherInput, setOtherInput] = useState('');
  const [showOther, setShowOther] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (bgApplied && bgPickerRef.current) {
      setTimeout(() => bgPickerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [bgApplied]);

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

  const openEdit = (idx: number) => {
    setEditPhotoIdx(idx);
    setPhotoMenuIdx(null);
    setEditTool('none');
    setBgStatus('idle');
    setBgResultUrl(null);
    setBgColor(null);
    setBgError(null);
  };

  const handleRotate = async (idx: number) => {
    const src = formData.photos[idx];
    const img = new Image();
    img.src = src;
    await new Promise(r => { img.onload = r; });
    const canvas = document.createElement('canvas');
    canvas.width = img.height;
    canvas.height = img.width;
    const ctx = canvas.getContext('2d')!;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    const rotated = canvas.toDataURL('image/jpeg', 0.92);
    setFormData(prev => {
      const photos = [...prev.photos];
      photos[idx] = rotated;
      return { ...prev, photos };
    });
  };

  const handleRemoveBg = async () => {
    if (editPhotoIdx === null) return;
    setBgStatus('processing');
    setBgError(null);
    try {
      const dataUrl = formData.photos[editPhotoIdx];
      const blob = await (await fetch(dataUrl)).blob();
      const fd = new FormData();
      fd.append('image_file', blob, 'image.jpg');
      fd.append('size', 'auto');
      const res = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': '1Pkf28pFEgmH27jaN4mfUmzt' },
        body: fd,
      });
      if (!res.ok) throw new Error('API error ' + res.status);
      const buf = await res.arrayBuffer();
      const b64 = btoa(Array.from(new Uint8Array(buf), b => String.fromCharCode(b)).join(''));
      setBgResultUrl('data:image/png;base64,' + b64);
      setBgStatus('preview');
    } catch (e: any) {
      setBgError(e.message || 'Background removal failed');
      setBgStatus('error');
    }
  };

  const acceptBgRemoval = () => {
    if (editPhotoIdx === null || !bgResultUrl) return;
    setFormData(prev => {
      const photos = [...prev.photos];
      photos[editPhotoIdx] = bgResultUrl;
      return { ...prev, photos };
    });
    setBgStatus('idle');
    setBgResultUrl(null);
    setBgApplied(true);
    setEditTool('removebg');
  };

  const compositeBgAndSave = useCallback(async (idx: number, color: string | null) => {
    const src = formData.photos[idx];
    const img = new Image();
    img.src = src;
    await new Promise(r => { img.onload = r; });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    if (color && color.startsWith('linear-gradient')) {
      // Parse gradient stops and fill
      const stops = color.match(/#[0-9a-fA-F]{6}/g) ?? ['#ffffff'];
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      stops.forEach((c, i) => grad.addColorStop(i / Math.max(stops.length - 1, 1), c));
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = color ?? 'transparent';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const result = canvas.toDataURL('image/png');
    setFormData(prev => {
      const photos = [...prev.photos];
      photos[idx] = result;
      return { ...prev, photos };
    });
  }, [formData.photos]);

  const handleDoneEdit = async () => {
    if (editPhotoIdx !== null && bgApplied && bgColor) {
      await compositeBgAndSave(editPhotoIdx, bgColor);
    }
    setEditPhotoIdx(null);
    setBgApplied(false);
    setBgColor(null);
    setCropActive(false);
    setCrop(undefined);
  };

  const onCropImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
    const c = centerCrop(makeAspectCrop({ unit: '%', width: 80 }, 1, w, h), w, h);
    setCrop(c);
    setPctCrop(c as PercentCrop);
  }, []);

  const applyCrop = useCallback(async () => {
    if (!pctCrop || !cropImgRef.current || editPhotoIdx === null) return;
    const img = cropImgRef.current;
    const canvas = document.createElement('canvas');
    const pixelX = (pctCrop.x / 100) * img.naturalWidth;
    const pixelY = (pctCrop.y / 100) * img.naturalHeight;
    const pixelW = (pctCrop.width / 100) * img.naturalWidth;
    const pixelH = (pctCrop.height / 100) * img.naturalHeight;
    canvas.width = pixelW;
    canvas.height = pixelH;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, pixelX, pixelY, pixelW, pixelH, 0, 0, pixelW, pixelH);
    const result = canvas.toDataURL('image/jpeg', 0.92);
    setFormData(prev => {
      const photos = [...prev.photos];
      photos[editPhotoIdx] = result;
      return { ...prev, photos };
    });
    setCropActive(false);
    setCrop(undefined);
    setPctCrop(undefined);
  }, [pctCrop, editPhotoIdx]);
  const openSheet = (key: string, label: string, options: string[], required?: boolean) => {
    setSelSheet({ key, label, options, required });
    setOtherInput('');
    setShowOther(false);
  };
  const closeSheet = () => { setSelSheet(null); setShowOther(false); setOtherInput(''); };
  const selectOption = (val: string) => {
    if (!selSheet) return;
    if (selSheet.key === 'pricingModel') {
      setFormData(prev => ({ ...prev, pricingModel: val }));
    } else {
      setFormData(prev => ({ ...prev, specifics: { ...prev.specifics, [selSheet.key]: val } }));
    }
    closeSheet();
  };
  const confirmOther = () => {
    if (otherInput.trim()) { selectOption(otherInput.trim()); }
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

  const PriceTypeRadio = ({ negotiable, onChange, isService }: { negotiable: boolean; onChange: (v: boolean) => void; isService?: boolean }) => (
    <div>
      <p className="text-sm font-semibold text-theme-primary mb-2">Price Type <span className="text-red-400">*</span></p>
      <div className="bg-surface border border-theme rounded-2xl overflow-hidden divide-y divide-theme">
        {[
          { val: false, label: 'Fixed Price', sub: 'Price is firm and non-negotiable' },
          { val: true,  label: 'Negotiable',  sub: isService ? 'Buyers can make offers on this service' : 'Buyers can make offers on this item' },
        ].map(({ val, label, sub }) => (
          <button key={String(val)} onClick={() => onChange(val)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${negotiable === val ? 'bg-primary/5' : 'hover:bg-elevated'}`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${negotiable === val ? 'border-primary' : 'border-theme'}`}>
              {negotiable === val && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
            </div>
            <div>
              <p className={`text-sm font-semibold ${negotiable === val ? 'text-primary' : 'text-theme-primary'}`}>{label}</p>
              <p className="text-xs text-theme-muted">{sub}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const OfferPriceSection = ({ offerPrice, regularPrice, offerPriceError, scheduleSaleEnabled, startDate, endDate, onChange, onScheduleToggle, onStartDate, onEndDate }: {
    offerPrice: string; regularPrice: string; offerPriceError: string | null;
    scheduleSaleEnabled: boolean; startDate: string; endDate: string;
    onChange: (val: string, err: string | null) => void;
    onScheduleToggle: (v: boolean) => void; onStartDate: (d: string) => void; onEndDate: (d: string) => void;
  }) => (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-theme-primary mb-2">Offer Price <span className="text-xs font-normal text-theme-muted">(Optional)</span></p>
        <div className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border bg-surface transition-all ${offerPriceError ? 'border-red-400' : offerPrice ? 'border-primary/30' : 'border-theme'}`}>
          <span className="text-sm font-semibold text-theme-primary">Ksh</span>
          <input type="number" value={offerPrice}
            onChange={e => {
              const val = e.target.value;
              const op = parseFloat(val), rp = parseFloat(regularPrice);
              const err = val && !isNaN(op) && !isNaN(rp) && op >= rp ? 'Offer price must be lower than regular price' : null;
              onChange(val, err);
            }}
            placeholder="Enter discounted price"
            className="flex-1 bg-transparent text-sm font-medium text-theme-primary placeholder:text-theme-muted outline-none" />
        </div>
        {offerPriceError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{offerPriceError}</p>}
      </div>
      {offerPrice.trim() && (
        <div className="bg-surface border border-theme rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${scheduleSaleEnabled ? 'bg-primary/10' : 'bg-elevated'}`}>
                <Calendar className={`w-5 h-5 ${scheduleSaleEnabled ? 'text-primary' : 'text-theme-muted'}`} />
              </div>
              <p className="text-sm font-semibold text-theme-primary">Schedule Offer Dates</p>
            </div>
            <button onClick={() => onScheduleToggle(!scheduleSaleEnabled)}
              className={`w-12 h-7 rounded-full transition-colors relative flex-shrink-0 overflow-hidden ${scheduleSaleEnabled ? 'bg-primary' : 'bg-theme-muted/20'}`}>
              <span className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${scheduleSaleEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>
          {scheduleSaleEnabled && (
            <div className="grid grid-cols-2 gap-3 pt-1">
              {[{ label: 'From', val: startDate, set: onStartDate }, { label: 'To', val: endDate, set: onEndDate }].map(({ label, val, set }) => (
                <div key={label}>
                  <p className="text-xs font-semibold text-theme-primary mb-1.5">{label}</p>
                  <input type="date" value={val} onChange={e => set(e.target.value)}
                    className="w-full bg-elevated border border-theme rounded-xl px-3 py-2.5 text-sm text-theme-primary outline-none focus:border-primary" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const ServiceToggle = ({ icon: Icon, label, sub, active, onToggle }: { icon: React.ElementType; label: string; sub: string; active: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all text-left ${active ? 'bg-primary/5 border-primary/30' : 'bg-surface border-theme'}`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary/10' : 'bg-elevated'}`}>
        {active ? <BadgeCheck className="w-5 h-5 text-primary" /> : <Icon className="w-5 h-5 text-theme-muted" />}
      </div>
      <div className="flex-1">
        <p className={`text-sm font-semibold ${active ? 'text-primary' : 'text-theme-primary'}`}>{label}</p>
        <p className="text-xs text-theme-muted">{sub}</p>
      </div>
    </button>
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
                              onClick={() => openEdit(idx)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-elevated text-left text-sm text-theme-primary"
                            >
                              <ImageIcon className="w-4 h-4 text-theme-muted" />
                              Edit
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
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-theme-primary">Add item specifics</h2>
                <p className="text-sm text-theme-muted mt-1">Provide details about your {formData.category || 'item'}</p>
              </div>

              {(CATEGORY_FIELDS[formData.category] || []).length === 0 ? (
                <div className="flex flex-col items-center gap-3 p-8 bg-surface border border-theme rounded-2xl">
                  <AlertCircle className="w-10 h-10 text-theme-muted" />
                  <p className="text-sm text-theme-muted">Please select a category first</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(CATEGORY_FIELDS[formData.category] || []).map(field => {
                    const val = formData.specifics[field.key];
                    const hasVal = !!val;
                    return (
                      <div key={field.key}>
                        {field.options ? (
                          <button
                            onClick={() => openSheet(field.key, field.label, field.options!, field.required)}
                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all text-left ${
                              hasVal
                                ? 'bg-surface border-primary/30 shadow-sm'
                                : 'bg-surface border-theme'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              {hasVal && (
                                <p className="text-[11px] text-theme-muted mb-0.5">
                                  {field.label}{field.required && <span className="text-red-400"> *</span>}
                                </p>
                              )}
                              <p className={`text-sm font-medium truncate ${
                                hasVal ? 'text-theme-primary' : 'text-theme-muted'
                              }`}>
                                {val || field.label}{!hasVal && field.required && <span className="text-red-400"> *</span>}
                              </p>
                            </div>
                            <div className="w-7 h-7 rounded-lg bg-elevated flex items-center justify-center flex-shrink-0">
                              <ChevronRight className="w-4 h-4 text-theme-muted" />
                            </div>
                          </button>
                        ) : (
                          <div className={`flex items-center gap-3 px-4 py-4 rounded-2xl border transition-all ${
                            hasVal ? 'bg-surface border-primary/30 shadow-sm' : 'bg-surface border-theme'
                          }`}>
                            <div className="flex-1">
                              {hasVal && (
                                <p className="text-[11px] text-theme-muted mb-0.5">
                                  {field.label}{field.required && <span className="text-red-400"> *</span>}
                                </p>
                              )}
                              <input
                                type={field.type === 'number' ? 'number' : 'text'}
                                value={val || ''}
                                onChange={e => setFormData(prev => ({ ...prev, specifics: { ...prev.specifics, [field.key]: e.target.value } }))}
                                placeholder={`${field.label}${field.required ? ' *' : ''}`}
                                className="w-full bg-transparent text-sm font-medium text-theme-primary placeholder:text-theme-muted outline-none"
                              />
                            </div>
                          </div>
                        )}
                        <FieldError field={field.key} />
                      </div>
                    );
                  })}
                </div>
              )}
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
            <div className="space-y-5">
              <h2 className="text-xl font-semibold text-theme-primary">Set Pricing</h2>

              {/* ── SERVICES ── */}
              {isServices ? (
                <div className="space-y-5">
                  {/* Segmented toggle */}
                  <div className="flex p-1 bg-elevated rounded-2xl gap-1">
                    {[
                      { id: false, icon: Tag, label: 'Specify Price' },
                      { id: true, icon: MessageSquare, label: 'Contact for Price' },
                    ].map(({ id, icon: Icon, label }) => (
                      <button
                        key={String(id)}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev, contactForQuote: id,
                            ...(id ? { price: '', pricingModel: null, negotiable: false, offerPrice: '', scheduleSaleEnabled: false, startDate: '', endDate: '', freeConsultation: false, requiresDeposit: false } : {}),
                          }));
                          if (id) { setOfferPriceError(null); setPricingTypeChosen(false); }
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                          formData.contactForQuote === id
                            ? 'bg-primary/15 text-primary'
                            : 'text-theme-muted'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Contact for Price info */}
                  {formData.contactForQuote && (
                    <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-theme-primary">Buyers will contact you directly to discuss pricing. You can proceed to post your ad.</p>
                    </div>
                  )}

                  {/* Specify Price fields */}
                  {!formData.contactForQuote && (
                    <div className="space-y-5">
                      {/* Price input */}
                      <div>
                        <p className="text-sm font-semibold text-theme-primary mb-2">Price <span className="text-red-400">*</span></p>
                        <div className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border bg-surface transition-all ${formData.price ? 'border-primary/30' : 'border-theme'}`}>
                          <span className="text-sm font-semibold text-theme-primary">Ksh</span>
                          <input type="number" value={formData.price}
                            onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="Enter price"
                            className="flex-1 bg-transparent text-sm font-medium text-theme-primary placeholder:text-theme-muted outline-none" />
                        </div>
                        <FieldError field="price" />
                      </div>

                      {/* Pricing Type selector */}
                      <div>
                        <p className="text-sm font-semibold text-theme-primary mb-2">Pricing Type <span className="text-red-400">*</span></p>
                        <button
                          onClick={() => openSheet('pricingModel', 'Pricing Type', PRICING_MODELS.map(p => p.label), true)}
                          className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl border bg-surface transition-all text-left ${formData.pricingModel ? 'border-primary/30' : 'border-theme'}`}
                        >
                          <div className="flex-1">
                            {formData.pricingModel && <p className="text-[11px] text-theme-muted mb-0.5">Pricing Type *</p>}
                            <p className={`text-sm font-medium ${formData.pricingModel ? 'text-theme-primary' : 'text-theme-muted'}`}>{formData.pricingModel || 'Select pricing type'}</p>
                          </div>
                          <div className="w-7 h-7 rounded-lg bg-elevated flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-theme-muted" />
                          </div>
                        </button>
                        <FieldError field="pricingModel" />
                      </div>

                      {/* Price Type radio */}
                      <PriceTypeRadio
                        negotiable={formData.negotiable}
                        isService
                        onChange={v => { setFormData(prev => ({ ...prev, negotiable: v, ...(v ? { offerPrice: '', scheduleSaleEnabled: false, startDate: '', endDate: '' } : {}) })); setPricingTypeChosen(true); }}
                      />

                      {/* Offer Price (Fixed only) */}
                      {!formData.negotiable && (
                        <OfferPriceSection
                          offerPrice={formData.offerPrice}
                          regularPrice={formData.price}
                          offerPriceError={offerPriceError}
                          scheduleSaleEnabled={formData.scheduleSaleEnabled}
                          startDate={formData.startDate}
                          endDate={formData.endDate}
                          onChange={(val, err) => { setFormData(prev => ({ ...prev, offerPrice: val })); setOfferPriceError(err); }}
                          onScheduleToggle={v => setFormData(prev => ({ ...prev, scheduleSaleEnabled: v, ...(!v ? { startDate: '', endDate: '' } : {}) }))}
                          onStartDate={d => setFormData(prev => ({ ...prev, startDate: d }))}
                          onEndDate={d => setFormData(prev => ({ ...prev, endDate: d }))}
                        />
                      )}

                      {/* Service toggles */}
                      <ServiceToggle icon={HeartHandshake} label="Free Consultation" sub="Offer a free initial consultation"
                        active={formData.freeConsultation} onToggle={() => setFormData(prev => ({ ...prev, freeConsultation: !prev.freeConsultation }))} />
                      {formData.pricingModel === 'Per Project' && (
                        <ServiceToggle icon={Wallet} label="Requires Deposit" sub="A deposit is needed before starting"
                          active={formData.requiresDeposit} onToggle={() => setFormData(prev => ({ ...prev, requiresDeposit: !prev.requiresDeposit }))} />
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* ── GOODS ── */
                <div className="space-y-5">
                  {/* Price input */}
                  <div>
                    <p className="text-sm font-semibold text-theme-primary mb-2">Regular Price <span className="text-red-400">*</span></p>
                    <div className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl border bg-surface transition-all ${formData.price ? 'border-primary/30' : 'border-theme'}`}>
                      <span className="text-sm font-semibold text-theme-primary">Ksh</span>
                      <input type="number" value={formData.price}
                        onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                        placeholder="Enter price"
                        className="flex-1 bg-transparent text-sm font-medium text-theme-primary placeholder:text-theme-muted outline-none" />
                    </div>
                    <FieldError field="price" />
                  </div>

                  {/* Price Type radio */}
                  <PriceTypeRadio
                    negotiable={formData.negotiable}
                    onChange={v => { setFormData(prev => ({ ...prev, negotiable: v, ...(v ? { offerPrice: '', scheduleSaleEnabled: false, startDate: '', endDate: '' } : {}) })); setPricingTypeChosen(true); }}
                  />

                  {/* Offer Price (Fixed only) */}
                  {!formData.negotiable && (
                    <OfferPriceSection
                      offerPrice={formData.offerPrice}
                      regularPrice={formData.price}
                      offerPriceError={offerPriceError}
                      scheduleSaleEnabled={formData.scheduleSaleEnabled}
                      startDate={formData.startDate}
                      endDate={formData.endDate}
                      onChange={(val, err) => { setFormData(prev => ({ ...prev, offerPrice: val })); setOfferPriceError(err); }}
                      onScheduleToggle={v => setFormData(prev => ({ ...prev, scheduleSaleEnabled: v, ...(!v ? { startDate: '', endDate: '' } : {}) }))}
                      onStartDate={d => setFormData(prev => ({ ...prev, startDate: d }))}
                      onEndDate={d => setFormData(prev => ({ ...prev, endDate: d }))}
                    />
                  )}
                </div>
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

      {/* ── Image Edit Modal ── */}
      {editPhotoIdx !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-0 sm:p-4">
          <div className="flex flex-col bg-theme w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-lg sm:rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-theme">
              <button onClick={handleDoneEdit} className="w-9 h-9 rounded-full bg-elevated flex items-center justify-center">
                <X className="w-5 h-5 text-theme-primary" />
              </button>
              <span className="font-semibold text-theme-primary">Edit Image</span>
              <button onClick={handleDoneEdit} className="text-primary font-semibold text-sm px-3 py-1.5">Done</button>
            </div>

            {/* Image Preview */}
            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden min-h-0">
              {cropActive ? (
                <ReactCrop
                  crop={crop}
                  onChange={(c, p) => { setCrop(c); setPctCrop(p); }}
                >
                  <img
                    ref={cropImgRef}
                    src={formData.photos[editPhotoIdx]}
                    alt=""
                    onLoad={onCropImageLoad}
                    style={{ maxHeight: 'calc(100vh - 260px)', maxWidth: '100%', display: 'block' }}
                  />
                </ReactCrop>
              ) : (
                <div
                  className="rounded-2xl overflow-hidden shadow-lg border border-theme"
                  style={{ background: bgColor ?? (bgApplied ? 'repeating-conic-gradient(#e5e5e5 0% 25%, #fff 0% 50%) 0 0/20px 20px' : 'transparent') }}
                >
                  <img
                    src={bgStatus === 'preview' && bgResultUrl ? bgResultUrl : formData.photos[editPhotoIdx]}
                    alt=""
                    style={{ maxHeight: 'calc(100vh - 260px)', maxWidth: '100%', display: 'block' }}
                  />
                </div>
              )}
            </div>

            {/* Tools */}
            <div className="bg-surface border-t border-theme px-5 pt-4 pb-6 space-y-4 overflow-y-auto max-h-[55vh]">
              {/* Crop apply/cancel bar */}
              {cropActive ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setCropActive(false); setCrop(undefined); setEditTool('none'); }}
                    className="flex-1 py-3 rounded-xl border border-theme bg-elevated font-semibold text-sm text-theme-primary flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button
                    onClick={applyCrop}
                    className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Apply Crop
                  </button>
                </div>
              ) : (
              <div className="flex justify-around">
                {/* Crop */}
                <button
                  onClick={() => { setEditTool('crop'); setCropActive(true); }}
                  disabled={bgStatus === 'processing'}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                    editTool === 'crop' ? 'border-primary bg-primary/10' : 'border-theme bg-elevated'
                  }`}>
                    <Crop className={`w-6 h-6 ${editTool === 'crop' ? 'text-primary' : 'text-theme-primary'}`} />
                  </div>
                  <span className={`text-xs font-medium ${editTool === 'crop' ? 'text-primary' : 'text-theme-muted'}`}>Crop</span>
                </button>
                {/* Remove BG */}
                <button
                  onClick={() => { if (editTool !== 'removebg' || !bgApplied) { setEditTool('removebg'); handleRemoveBg(); } }}
                  disabled={bgStatus === 'processing'}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                    editTool === 'removebg' ? 'border-primary bg-primary/10' : 'border-theme bg-elevated'
                  }`}>
                    {bgStatus === 'processing'
                      ? <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      : <Wand2 className={`w-6 h-6 ${editTool === 'removebg' ? 'text-primary' : 'text-theme-primary'}`} />
                    }
                  </div>
                  <span className={`text-xs font-medium ${editTool === 'removebg' ? 'text-primary' : 'text-theme-muted'}`}>Remove BG</span>
                </button>
                {/* Rotate */}
                <button
                  onClick={() => handleRotate(editPhotoIdx)}
                  disabled={bgStatus === 'processing'}
                  className="flex flex-col items-center gap-1.5"
                >
                  <div className="w-14 h-14 rounded-2xl bg-elevated border border-theme flex items-center justify-center">
                    <RotateCw className="w-6 h-6 text-theme-primary" />
                  </div>
                  <span className="text-xs text-theme-muted font-medium">Rotate</span>
                </button>
              </div>
              )}

              {/* BG Removal preview controls */}
              {bgStatus === 'preview' && (
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setBgStatus('idle'); setBgResultUrl(null); setEditTool('none'); }}
                      className="flex-1 py-3 rounded-xl border border-theme bg-elevated font-semibold text-sm text-theme-primary flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" /> Decline
                    </button>
                    <button
                      onClick={acceptBgRemoval}
                      className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Accept
                    </button>
                  </div>
                </div>
              )}

              {/* Error */}
              {bgStatus === 'error' && bgError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-xs text-red-600">{bgError}</span>
                </div>
              )}

              {/* Add New Background (after BG removal accepted) */}
              {(bgStatus === 'idle' && editTool === 'removebg' && bgApplied) && (
                <div ref={bgPickerRef} className="space-y-3">
                  <p className="text-xs font-semibold text-theme-primary">Add New Background</p>
                  <div>
                    <p className="text-[11px] font-medium text-theme-muted mb-2">Solid Colours</p>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {[
                        { val: 'transparent', display: 'repeating-conic-gradient(#d1d5db 0% 25%,#fff 0% 50%) 0 0/10px 10px' },
                        { val: '#ffffff',     display: '#ffffff' },
                        { val: '#000000',     display: '#000000' },
                        { val: '#f5f5f5',     display: '#f5f5f5' },
                        { val: '#e8e8e8',     display: '#e8e8e8' },
                        { val: '#2196F3',     display: '#2196F3' },
                        { val: '#4CAF50',     display: '#4CAF50' },
                        { val: '#FF9800',     display: '#FF9800' },
                        { val: '#9C27B0',     display: '#9C27B0' },
                        { val: '#E91E63',     display: '#E91E63' },
                        { val: '#00BCD4',     display: '#00BCD4' },
                        { val: '#795548',     display: '#795548' },
                      ].map(({ val, display }) => {
                        const selected = val === 'transparent' ? bgColor === null : bgColor === val;
                        return (
                          <button key={val}
                            onClick={() => setBgColor(val === 'transparent' ? null : val)}
                            className={`flex-shrink-0 w-10 h-10 rounded-xl border-2 transition-all ${selected ? 'border-primary scale-110' : 'border-theme'}`}
                            style={{ background: display }}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-theme-muted mb-2">Gradients</p>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {[
                        { name: 'Sunset',  val: 'linear-gradient(135deg,#FF6B6B,#FFE66D)' },
                        { name: 'Ocean',   val: 'linear-gradient(135deg,#667eea,#764ba2)' },
                        { name: 'Forest',  val: 'linear-gradient(135deg,#11998e,#38ef7d)' },
                        { name: 'Night',   val: 'linear-gradient(135deg,#0F2027,#2C5364)' },
                        { name: 'Rose',    val: 'linear-gradient(135deg,#ff9a9e,#fecfef)' },
                        { name: 'Fire',    val: 'linear-gradient(135deg,#fc5c7d,#6a82fb)' },
                        { name: 'Gold',    val: 'linear-gradient(135deg,#f7971e,#ffd200)' },
                      ].map(({ name, val }) => (
                        <div key={val} className="flex-shrink-0 flex flex-col items-center gap-1">
                          <button
                            onClick={() => setBgColor(val)}
                            className={`w-10 h-10 rounded-xl border-2 transition-all ${bgColor === val ? 'border-primary scale-110' : 'border-transparent'}`}
                            style={{ background: val }}
                          />
                          <span className="text-[9px] text-theme-muted">{name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {bgColor && (
                    <button
                      onClick={() => setBgColor(null)}
                      className="text-xs text-theme-muted underline"
                    >Clear background</button>
                  )}
                </div>
              )}
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

      {/* ── Item Specifics Selection Sheet ── */}
      {selSheet && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end" onClick={closeSheet}>
          <div
            className="bg-surface w-full rounded-t-2xl max-h-[65vh] flex flex-col sm:max-w-md sm:mx-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-theme">
              <h3 className="text-base font-semibold text-theme-primary">
                {selSheet.label}{selSheet.required && <span className="text-red-400"> *</span>}
              </h3>
              <button onClick={closeSheet} className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center">
                <X className="w-4 h-4 text-theme-primary" />
              </button>
            </div>

            {showOther ? (
              /* Other text input */
              <div className="p-5 space-y-4">
                <input
                  autoFocus
                  value={otherInput}
                  onChange={e => setOtherInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && confirmOther()}
                  placeholder="Please specify..."
                  className="w-full bg-elevated rounded-xl px-4 py-3 text-theme-primary placeholder:text-theme-muted outline-none border border-theme focus:border-primary text-sm"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowOther(false)}
                    className="flex-1 py-3 rounded-xl border border-theme bg-elevated font-semibold text-sm text-theme-primary"
                  >Back</button>
                  <button
                    onClick={confirmOther}
                    className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold text-sm"
                  >Confirm</button>
                </div>
              </div>
            ) : (
              /* Options list */
              <div className="overflow-y-auto flex-1">
                {selSheet.options.map(opt => {
                  const isSelected = formData.specifics[selSheet.key] === opt;
                  const isOther = opt === 'Other';
                  return (
                    <button
                      key={opt}
                      onClick={() => isOther ? setShowOther(true) : selectOption(opt)}
                      className={`w-full flex items-center justify-between px-5 py-4 text-left border-b border-theme/50 last:border-0 transition-colors ${
                        isSelected ? 'bg-primary/5' : 'hover:bg-elevated'
                      }`}
                    >
                      <span className={`text-sm ${isSelected ? 'text-primary font-semibold' : 'text-theme-primary font-medium'}`}>
                        {opt}
                      </span>
                      {isSelected
                        ? <Check className="w-4 h-4 text-primary" />
                        : isOther
                        ? <Pencil className="w-3.5 h-3.5 text-theme-muted" />
                        : null
                      }
                    </button>
                  );
                })}
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

