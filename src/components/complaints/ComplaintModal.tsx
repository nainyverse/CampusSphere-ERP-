import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ComplaintCategory, ComplaintPriority } from '../../types';
import { evaluateComplaintPriority } from '../../utils/priorityEngine';
import {
  X,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Upload,
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { PriorityBadge } from './Badges';

const CATEGORIES: ComplaintCategory[] = [
  'Electrical maintenance',
  'Internet and Wi-Fi',
  'Classroom facilities',
  'Washroom and sanitation',
  'Water supply',
  'Laboratory equipment',
  'Library',
  'Transport',
  'Academic administration',
  'Other'
];

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (id: string) => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { submitComplaint } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Classroom facilities');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [customPriority, setCustomPriority] = useState<ComplaintPriority | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Real-time rule-based priority evaluation
  const evaluation = useMemo(() => {
    return evaluateComplaintPriority(category, title, description);
  }, [category, title, description]);

  const activePriority = customPriority || evaluation.priority;

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) errs.title = 'Title is required';
    if (title.length < 5) errs.title = 'Title must be at least 5 characters';
    if (!location.trim()) errs.location = 'Specific campus location is required';
    if (!description.trim()) errs.description = 'Please provide detailed description';
    if (description.length < 15) errs.description = 'Description should be at least 15 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const created = submitComplaint({
        title,
        description,
        category,
        location,
        priority: activePriority,
        photoUrl: photoPreview || undefined
      });

      setIsSubmitting(false);
      onClose();
      if (onSuccess) {
        onSuccess(created.id);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight">Log Campus Issue or Maintenance Ticket</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Smart triage engine calculates initial priority & automatically routes to responsible department.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Classroom fans and lights not working"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                errors.title ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
              } focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Category & Location Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Location (Building / Room) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Block B, Room 204"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                  errors.location ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
                } focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
              />
              {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what occurred, when it started, and how it impacts classes or campus safety..."
              className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                errors.description ? 'border-red-500 ring-1 ring-red-500' : 'border-slate-300'
              } focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Transparent Priority Recommendation Engine Banner */}
          <div
            className={`p-3.5 rounded-xl border transition-all ${
              evaluation.isSafetyHazard
                ? 'bg-red-50 border-red-300 text-red-900'
                : 'bg-blue-50/70 border-blue-200 text-slate-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {evaluation.isSafetyHazard ? (
                  <ShieldAlert className="w-5 h-5 text-red-600 animate-pulse flex-shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-blue-600 flex-shrink-0" />
                )}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {evaluation.isSafetyHazard ? 'SAFETY ALERT DETECTED' : 'Rule-Based Priority Suggestion'}
                </span>
              </div>
              <PriorityBadge priority={evaluation.priority} isSafetyHazard={evaluation.isSafetyHazard} />
            </div>

            <div className="mt-2 text-xs text-slate-600 space-y-1">
              <p>
                <strong>Suggested Department:</strong> {evaluation.departmentSuggestion}
              </p>
              <p>
                <strong>Estimated Resolution Target (SLA):</strong> ~{evaluation.slaHours} hours
              </p>
              {evaluation.reasons.map((r, idx) => (
                <p key={idx} className="text-[11px] text-slate-500 italic">
                  • {r}
                </p>
              ))}
            </div>

            {/* Priority Override Option */}
            <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-medium text-slate-700">Override Priority (Optional):</span>
              <div className="flex items-center space-x-1.5">
                {(['Low', 'Medium', 'High', 'Critical'] as ComplaintPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCustomPriority(p)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors ${
                      activePriority === p
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Photo Attachment (Demo preview) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Photo Evidence / Attachment (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors">
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Upload Photo / Capture</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {photoPreview && (
                <div className="relative inline-block">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPhotoPreview('');
                      setPhotoUrl('');
                    }}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <span>Registering Issue...</span>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Submit Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
