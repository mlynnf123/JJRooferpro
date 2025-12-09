import React, { useState } from 'react';
import { X, User, Phone, Mail, MapPin, Target, DollarSign, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { Lead } from '../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Lead) => void;
  lead?: Lead;
}

interface LeadFormData {
  customerInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    preferredContact: 'phone' | 'email' | 'text';
  };
  source: 'referral' | 'online' | 'advertisement' | 'cold-call' | 'other';
  priority: 'low' | 'medium' | 'high';
  estimatedValue: number;
  description: string;
  notes: string;
  assignedTo: string;
}

const STEPS = [
  { id: 1, title: 'Customer Info', icon: User },
  { id: 2, title: 'Lead Details', icon: Target },
  { id: 3, title: 'Project Info', icon: MessageSquare }
];

const SALES_REPS = ['Ian', 'Justin', 'Kyle'];

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lead
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<LeadFormData>(() => ({
    customerInfo: {
      name: lead?.customerInfo.name || '',
      address: lead?.customerInfo.address || '',
      phone: lead?.customerInfo.phone || '',
      email: lead?.customerInfo.email || '',
      preferredContact: lead?.customerInfo.preferredContact || 'phone'
    },
    source: lead?.source || 'referral',
    priority: lead?.priority || 'medium',
    estimatedValue: lead?.estimatedValue || 0,
    description: lead?.description || '',
    notes: lead?.notes || '',
    assignedTo: lead?.assignedTo || ''
  }));

  if (!isOpen) return null;

  const handleInputChange = (section: keyof LeadFormData, field: string, value: string | number) => {
    if (section === 'customerInfo') {
      setFormData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: value
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.customerInfo.name && formData.customerInfo.phone);
      case 2:
        return !!(formData.source && formData.priority && formData.assignedTo);
      case 3:
        return !!(formData.description && formData.estimatedValue > 0);
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      const newLead: Lead = {
        id: lead?.id || crypto.randomUUID(),
        customerInfo: formData.customerInfo,
        source: formData.source,
        status: lead?.status || 'new',
        priority: formData.priority,
        estimatedValue: formData.estimatedValue,
        description: formData.description,
        notes: formData.notes,
        assignedTo: formData.assignedTo,
        contractId: lead?.contractId,
        convertedJobId: lead?.convertedJobId,
        createdAt: lead?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastContactDate: lead?.lastContactDate,
        nextFollowUp: lead?.nextFollowUp
      };
      
      onSave(newLead);
      onClose();
      setCurrentStep(1);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {STEPS.map((step, index) => {
        const Icon = step.icon;
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;
        
        return (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
              isActive 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : isCompleted 
                ? 'bg-green-600 border-green-600 text-white'
                : 'border-slate-300 text-slate-400'
            }`}>
              <Icon size={20} />
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-slate-500'}`}>
                {step.title}
              </p>
            </div>
            {index < STEPS.length - 1 && (
              <div className={`w-12 h-0.5 ml-4 ${isCompleted ? 'bg-green-600' : 'bg-slate-300'}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
        <User size={20} className="text-blue-600" />
        <span>Customer Information</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Customer Name *
          </label>
          <input
            type="text"
            value={formData.customerInfo.name}
            onChange={(e) => handleInputChange('customerInfo', 'name', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter customer name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={formData.customerInfo.phone}
            onChange={(e) => handleInputChange('customerInfo', 'phone', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="(555) 123-4567"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={formData.customerInfo.email}
            onChange={(e) => handleInputChange('customerInfo', 'email', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="customer@email.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Preferred Contact Method
          </label>
          <select
            value={formData.customerInfo.preferredContact}
            onChange={(e) => handleInputChange('customerInfo', 'preferredContact', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="phone">Phone Call</option>
            <option value="email">Email</option>
            <option value="text">Text Message</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Property Address
        </label>
        <input
          type="text"
          value={formData.customerInfo.address}
          onChange={(e) => handleInputChange('customerInfo', 'address', e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="123 Main Street, Austin, TX 78701"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
        <Target size={20} className="text-blue-600" />
        <span>Lead Details</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Lead Source *
          </label>
          <select
            value={formData.source}
            onChange={(e) => handleInputChange('source', '', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="referral">Referral</option>
            <option value="online">Online/Website</option>
            <option value="advertisement">Advertisement</option>
            <option value="cold-call">Cold Call</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Priority Level *
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', '', e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Assigned Sales Rep *
        </label>
        <select
          value={formData.assignedTo}
          onChange={(e) => handleInputChange('assignedTo', '', e.target.value)}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          <option value="">Select a sales representative</option>
          {SALES_REPS.map(rep => (
            <option key={rep} value={rep}>{rep}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
        <MessageSquare size={20} className="text-blue-600" />
        <span>Project Information</span>
      </h3>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Project Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', '', e.target.value)}
          rows={4}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Describe the roofing project, damage, or work needed..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Estimated Project Value * ($)
        </label>
        <input
          type="number"
          value={formData.estimatedValue}
          onChange={(e) => handleInputChange('estimatedValue', '', Number(e.target.value))}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="25000"
          min="0"
          step="100"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Additional Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', '', e.target.value)}
          rows={3}
          className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Insurance carrier, urgency, special requirements, etc."
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">
            {lead ? 'Edit Lead' : 'Create New Lead'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-140px)]">
          <div className="p-6">
            {renderStepIndicator()}
            
            <div className="mt-8">
              {renderCurrentStep()}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 1
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                  validateStep(currentStep)
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>Next</span>
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!validateStep(currentStep)}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  validateStep(currentStep)
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {lead ? 'Update Lead' : 'Create Lead'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};