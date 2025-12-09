import React, { useState, useCallback, useEffect } from 'react';
import { X, Plus, Trash2, FileText, ChevronDown, ChevronRight } from 'lucide-react';
import { Contract, ContractLineItem, ContractDetails, Signature } from '../types';
import { SignatureModal } from './SignatureModal';
import { PrintableContract } from './PrintableContract';

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contract: Contract) => void;
  contract?: Contract;
  leadInfo?: {
    customerName: string;
    customerAddress: string;
    customerPhone: string;
    customerEmail: string;
  };
}

interface PaymentItem {
  id: string;
  description: string;
  amount: number;
}

interface WorksheetData {
  deductible: number;
  nonRecoverableDepreciation: number;
  upgrades: string;
  discounts: number;
  workNotDoing: string;
  remainingBalance: number;
}

interface ReviewData {
  shingleType: string;
  existingDamage: string;
  liabilityDisclosures: {
    constructionCaution: boolean;
    drivewayUsage: boolean;
    puncturedLines: boolean;
    termsReverse: boolean;
    propertyCode: boolean;
  };
}

interface ThirdPartyData {
  homeownerName: string;
  propertyAddress: string;
  insuranceCompany: string;
  claimNumber: string;
  authorizations: {
    requestInspections: boolean;
    discussSupplements: boolean;
    issuedPayment: boolean;
    requestClaimStatus: boolean;
  };
}

export const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contract,
  leadInfo
}) => {
  const [contractDate, setContractDate] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [companyRepExpanded, setCompanyRepExpanded] = useState(false);
  
  // Line items by category with pre-filled roofing item
  const [roofingItems, setRoofingItems] = useState<ContractLineItem[]>([
    {
      id: crypto.randomUUID(),
      description: 'IKO | Class 4 | Nordic | Summit Gray\n-Synthetic Felt\n-Ridge\n-Ice & Water Barrier\n-Drip Edge Installed (Painted to Match Shingle)',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      category: 'roofing'
    }
  ]);
  const [gutterItems, setGutterItems] = useState<ContractLineItem[]>([]);
  const [windowItems, setWindowItems] = useState<ContractLineItem[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);

  // Payment schedule with pre-filled standard items
  const [paymentItems, setPaymentItems] = useState<PaymentItem[]>([
    {
      id: crypto.randomUUID(),
      description: 'First Payment (Due upon Start of Job/Material Delivery)',
      amount: 0
    },
    {
      id: crypto.randomUUID(),
      description: 'Second Payment (Due upon Completion of Roof)',
      amount: 0
    },
    {
      id: crypto.randomUUID(),
      description: 'Final Payment (Due upon Job Completion *INS INVOICE*)',
      amount: 0
    }
  ]);

  // Contract worksheet
  const [worksheetData, setWorksheetData] = useState<WorksheetData>({
    deductible: 0,
    nonRecoverableDepreciation: 0,
    upgrades: '',
    discounts: 0,
    workNotDoing: '',
    remainingBalance: 0
  });

  // Review and Initials
  const [reviewData, setReviewData] = useState<ReviewData>({
    shingleType: '',
    existingDamage: '',
    liabilityDisclosures: {
      constructionCaution: false,
      drivewayUsage: false,
      puncturedLines: false,
      termsReverse: false,
      propertyCode: false
    }
  });

  // Third Party Authorization
  const [thirdPartyData, setThirdPartyData] = useState<ThirdPartyData>({
    homeownerName: '',
    propertyAddress: '',
    insuranceCompany: '',
    claimNumber: '',
    authorizations: {
      requestInspections: false,
      discussSupplements: false,
      issuedPayment: false,
      requestClaimStatus: false
    }
  });

  // Signatures
  const [signatures, setSignatures] = useState<{[key: string]: Signature}>({});
  const [signatureModal, setSignatureModal] = useState<{
    isOpen: boolean;
    signerName: string;
    signerRole: 'customer' | 'company';
    signatureKey: string;
  }>({
    isOpen: false,
    signerName: '',
    signerRole: 'customer',
    signatureKey: ''
  });

  // Preview state
  const [showPreview, setShowPreview] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setContractDate(contract?.createdAt?.split('T')[0] || today);
      setCustomerName(contract?.details.customerName || leadInfo?.customerName || '');
      
      // Initialize line items if editing existing contract
      if (contract && contract.lineItems) {
        const roofing = contract.lineItems.filter(item => item.category === 'roofing');
        const gutter = contract.lineItems.filter(item => item.category === 'gutter');
        const window = contract.lineItems.filter(item => item.category === 'window');
        
        if (roofing.length > 0) setRoofingItems(roofing);
        if (gutter.length > 0) setGutterItems(gutter);
        if (window.length > 0) setWindowItems(window);
        
        // Load other existing contract data
        if (contract.details.worksheetData) {
          setWorksheetData(contract.details.worksheetData);
        }
        if (contract.details.reviewData) {
          setReviewData(contract.details.reviewData);
        }
        if (contract.details.thirdPartyAuth) {
          setThirdPartyData(contract.details.thirdPartyAuth);
        }
        if (contract.signatures) {
          setSignatures(contract.signatures);
        }
        
        // Load existing payment schedule if available
        if (contract.details.paymentSchedule && contract.details.paymentSchedule.progressPayments.length > 0) {
          const existingPayments = contract.details.paymentSchedule.progressPayments.map(p => ({
            id: crypto.randomUUID(),
            description: p.description,
            amount: p.amount
          }));
          setPaymentItems(existingPayments);
        }
      }
    }
  }, [contract, leadInfo, isOpen]);

  // Calculate grand total
  const calculateGrandTotal = useCallback(() => {
    const roofingTotal = roofingItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const gutterTotal = gutterItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const windowTotal = windowItems.reduce((sum, item) => sum + (item.total || 0), 0);
    const total = roofingTotal + gutterTotal + windowTotal;
    setGrandTotal(total);
    return total;
  }, [roofingItems, gutterItems, windowItems]);

  // Update grand total when items change
  useEffect(() => {
    calculateGrandTotal();
  }, [calculateGrandTotal]);

  // Item management functions
  const addItem = (category: 'roofing' | 'gutter' | 'window') => {
    const newItem: ContractLineItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      category
    };

    if (category === 'roofing') {
      setRoofingItems(prev => [...prev, newItem]);
    } else if (category === 'gutter') {
      setGutterItems(prev => [...prev, newItem]);
    } else if (category === 'window') {
      setWindowItems(prev => [...prev, newItem]);
    }
  };

  const updateItem = (id: string, category: 'roofing' | 'gutter' | 'window', field: keyof ContractLineItem, value: string | number) => {
    const updateFunction = (items: ContractLineItem[]) =>
      items.map(item => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      });

    if (category === 'roofing') {
      setRoofingItems(updateFunction);
    } else if (category === 'gutter') {
      setGutterItems(updateFunction);
    } else if (category === 'window') {
      setWindowItems(updateFunction);
    }
  };

  const removeItem = (id: string, category: 'roofing' | 'gutter' | 'window') => {
    if (category === 'roofing') {
      setRoofingItems(prev => prev.filter(item => item.id !== id));
    } else if (category === 'gutter') {
      setGutterItems(prev => prev.filter(item => item.id !== id));
    } else if (category === 'window') {
      setWindowItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Payment schedule functions
  const addPaymentItem = () => {
    const newPayment: PaymentItem = {
      id: crypto.randomUUID(),
      description: '',
      amount: 0
    };
    setPaymentItems(prev => [...prev, newPayment]);
  };

  const updatePaymentItem = (id: string, field: 'description' | 'amount', value: string | number) => {
    setPaymentItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removePaymentItem = (id: string) => {
    setPaymentItems(prev => prev.filter(item => item.id !== id));
  };

  // Signature functions
  const openSignatureModal = (signerName: string, signerRole: 'customer' | 'company', signatureKey: string) => {
    setSignatureModal({
      isOpen: true,
      signerName,
      signerRole,
      signatureKey
    });
  };

  const handleSignature = (signature: Signature) => {
    setSignatures(prev => ({
      ...prev,
      [signatureModal.signatureKey]: signature
    }));
    setSignatureModal(prev => ({ ...prev, isOpen: false }));
  };

  // Preview handler
  const handlePreview = () => {
    setShowPreview(true);
  };

  // Save contract
  const handleSave = () => {
    const allLineItems = [...roofingItems, ...gutterItems, ...windowItems];
    
    const contractDetails: ContractDetails = {
      customerName,
      customerAddress: leadInfo?.customerAddress || '',
      customerPhone: leadInfo?.customerPhone || '',
      customerEmail: leadInfo?.customerEmail || '',
      companyRepName: 'John Johnson',
      companyRepTitle: 'Owner',
      projectDescription: '',
      workLocation: leadInfo?.customerAddress || '',
      startDate: contractDate,
      completionDate: '',
      totalAmount: grandTotal,
      paymentSchedule: {
        depositAmount: 0,
        progressPayments: paymentItems.map(p => ({ description: p.description, amount: p.amount })),
        finalPayment: 0
      },
      terms: '',
      warrantyInfo: '',
      worksheetData,
      reviewData,
      thirdPartyAuth: thirdPartyData
    };

    const newContract: Contract = {
      id: contract?.id || crypto.randomUUID(),
      leadId: contract?.leadId,
      jobId: contract?.jobId,
      details: contractDetails,
      lineItems: allLineItems,
      signatures,
      status: contract?.status || 'draft',
      createdAt: contract?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: contract?.notes
    };

    onSave(newContract);
    onClose();
  };

  // Render item section
  const renderItemSection = (title: string, items: ContractLineItem[], category: 'roofing' | 'gutter' | 'window') => (
    <div className="border border-slate-200 rounded-lg">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <button
            onClick={() => addItem(category)}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            <Plus size={14} />
            <span>Add {title.split(' ')[0]} Item</span>
          </button>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-slate-500 text-sm">No items added yet</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center space-x-3 p-3 border border-slate-200 rounded">
              <div className="flex-1">
                <textarea
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, category, 'description', e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded resize-none"
                  rows={2}
                />
              </div>
              <div className="w-16">
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity || ''}
                  onChange={(e) => updateItem(item.id, category, 'quantity', Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded text-center"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  placeholder="Price"
                  value={item.unitPrice || ''}
                  onChange={(e) => updateItem(item.id, category, 'unitPrice', Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>
              <button
                onClick={() => removeItem(item.id, category)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  if (!isOpen) return null;

  // Create preview contract object
  const previewContract: Contract = {
    id: contract?.id || 'preview',
    leadId: contract?.leadId,
    jobId: contract?.jobId,
    details: {
      customerName,
      customerAddress: leadInfo?.customerAddress || '',
      customerPhone: leadInfo?.customerPhone || '',
      customerEmail: leadInfo?.customerEmail || '',
      companyRepName: 'John Johnson',
      companyRepTitle: 'Owner',
      projectDescription: '',
      workLocation: leadInfo?.customerAddress || '',
      startDate: contractDate,
      completionDate: '',
      totalAmount: grandTotal,
      paymentSchedule: {
        depositAmount: 0,
        progressPayments: paymentItems.map(p => ({ description: p.description, amount: p.amount })),
        finalPayment: 0
      },
      terms: '',
      warrantyInfo: '',
      worksheetData,
      reviewData,
      thirdPartyAuth: thirdPartyData
    },
    lineItems: [...roofingItems, ...gutterItems, ...windowItems],
    signatures,
    status: 'draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (showPreview) {
    return <PrintableContract contract={previewContract} onClose={() => setShowPreview(false)} />;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-start justify-center p-4 pt-8 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] flex flex-col overflow-hidden my-4">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 flex-shrink-0">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileText size={20} className="text-blue-600" />
                <span>Contract Details for {customerName}</span>
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-3 space-y-3">
              {/* Contract Header */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contract Date</label>
                  <input
                    type="date"
                    value={contractDate}
                    onChange={(e) => setContractDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              {/* Company Representative - Collapsible */}
              <div className="border border-slate-200 rounded-lg">
                <button
                  onClick={() => setCompanyRepExpanded(!companyRepExpanded)}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="font-semibold text-slate-900">Company Representative</span>
                  {companyRepExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                {companyRepExpanded && (
                  <div className="p-4 border-t border-slate-200">
                    <p className="text-slate-600">John Johnson - Owner</p>
                  </div>
                )}
              </div>

              {/* Roofing Items */}
              {renderItemSection('Roofing Items', roofingItems, 'roofing')}

              {/* Gutter Items */}
              {renderItemSection('Gutter Items', gutterItems, 'gutter')}

              {/* Window Items */}
              {renderItemSection('Window Items', windowItems, 'window')}

              {/* Grand Total */}
              <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700">Grand Total ($)</label>
                  <div className="text-xl font-bold text-slate-900">
                    ${grandTotal.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Payment Schedule */}
              <div className="border border-slate-200 rounded-lg">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Payment Schedule</h3>
                    <button
                      onClick={addPaymentItem}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      <Plus size={14} />
                      <span>Add Payment Item</span>
                    </button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {paymentItems.map(payment => (
                    <div key={payment.id} className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Payment description"
                        value={payment.description}
                        onChange={(e) => updatePaymentItem(payment.id, 'description', e.target.value)}
                        className="flex-1 p-2 border border-slate-300 rounded"
                      />
                      <input
                        type="number"
                        placeholder="Amount"
                        value={payment.amount || ''}
                        onChange={(e) => updatePaymentItem(payment.id, 'amount', Number(e.target.value))}
                        className="w-32 p-2 border border-slate-300 rounded"
                      />
                      <button
                        onClick={() => removePaymentItem(payment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Page 2 - Contract Worksheet */}
              <div className="border border-blue-500 rounded-lg">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-500">
                  <h3 className="font-semibold text-slate-900">Page 2 - Contract Worksheet</h3>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Deductible</label>
                    <input
                      type="number"
                      value={worksheetData.deductible || ''}
                      onChange={(e) => setWorksheetData(prev => ({...prev, deductible: Number(e.target.value)}))}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Non-Recoverable Depreciation</label>
                    <input
                      type="number"
                      value={worksheetData.nonRecoverableDepreciation || ''}
                      onChange={(e) => setWorksheetData(prev => ({...prev, nonRecoverableDepreciation: Number(e.target.value)}))}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Upgrades</label>
                    <textarea
                      value={worksheetData.upgrades}
                      onChange={(e) => setWorksheetData(prev => ({...prev, upgrades: e.target.value}))}
                      rows={3}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Discounts</label>
                    <input
                      type="number"
                      value={worksheetData.discounts || ''}
                      onChange={(e) => setWorksheetData(prev => ({...prev, discounts: Number(e.target.value)}))}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Work Not Doing</label>
                    <input
                      type="text"
                      value={worksheetData.workNotDoing}
                      onChange={(e) => setWorksheetData(prev => ({...prev, workNotDoing: e.target.value}))}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Remaining Balance On Deductible and Upgrades</label>
                    <input
                      type="number"
                      value={worksheetData.remainingBalance || ''}
                      onChange={(e) => setWorksheetData(prev => ({...prev, remainingBalance: Number(e.target.value)}))}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Page 4 - Review and Initials */}
              <div className="border border-blue-500 rounded-lg">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-500">
                  <h3 className="font-semibold text-slate-900">Page 4 - Review and Initials</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Shingle Type/Color/Delivery Instructions</label>
                    <textarea
                      value={reviewData.shingleType}
                      onChange={(e) => setReviewData(prev => ({...prev, shingleType: e.target.value}))}
                      rows={3}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Existing Property Damage</label>
                    <textarea
                      value={reviewData.existingDamage}
                      onChange={(e) => setReviewData(prev => ({...prev, existingDamage: e.target.value}))}
                      rows={3}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Liability Disclosure Addendum: Initial Below</h4>
                    <div className="space-y-2">
                      {[
                        { key: 'constructionCaution', label: 'Construction Site Caution: I understand and accept risks.' },
                        { key: 'drivewayUsage', label: 'Driveway Usage: All JJR vehicles are rated for driveway usage.' },
                        { key: 'puncturedLines', label: 'Punctured Lines: Not JJR responsibility during installation.' },
                        { key: 'termsReverse', label: 'Terms on Reverse Side: I have read and understand.' },
                        { key: 'propertyCode', label: 'Property Code §53.25b Disclosure Confirmed.' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={reviewData.liabilityDisclosures[item.key as keyof typeof reviewData.liabilityDisclosures]}
                            onChange={(e) => setReviewData(prev => ({
                              ...prev,
                              liabilityDisclosures: {
                                ...prev.liabilityDisclosures,
                                [item.key]: e.target.checked
                              }
                            }))}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-slate-700">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Digital Signatures */}
              <div className="border border-blue-500 rounded-lg">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-500">
                  <h3 className="font-semibold text-slate-900">Digital Signatures</h3>
                </div>
                <div className="p-4 space-y-4">
                  {/* Company Signature */}
                  <div>
                    <h4 className="font-medium text-slate-700 mb-2">Company Authorized Signature (Page 1)</h4>
                    {signatures.company ? (
                      <div className="flex items-center justify-between p-3 border border-green-300 bg-green-50 rounded">
                        <span className="text-sm text-green-600">Signed by {signatures.company.signerName}</span>
                        <button
                          onClick={() => openSignatureModal('Company Representative', 'company', 'company')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Sign Company
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openSignatureModal('Company Representative', 'company', 'company')}
                        className="w-full p-3 border-2 border-dashed border-blue-300 rounded text-blue-600 hover:border-blue-400"
                      >
                        Sign Company
                      </button>
                    )}
                  </div>

                  {/* Customer Signatures */}
                  {[1, 2, 3, 4].map(num => {
                    const sigKey = `customer${num}`;
                    const pages = ['1', '3', '5', '6'];
                    return (
                      <div key={num}>
                        <h4 className="font-medium text-slate-700 mb-2">Customer Signature {num} (Page {pages[num - 1]})</h4>
                        {signatures[sigKey] ? (
                          <div className="flex items-center justify-between p-3 border border-green-300 bg-green-50 rounded">
                            <span className="text-sm text-green-600">Signed by {signatures[sigKey].signerName}</span>
                            <button
                              onClick={() => openSignatureModal(customerName, 'customer', sigKey)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Sign Customer
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => openSignatureModal(customerName, 'customer', sigKey)}
                            className="w-full p-3 border-2 border-dashed border-blue-300 rounded text-blue-600 hover:border-blue-400"
                          >
                            Sign Customer
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Page 6 - Third Party Authorization */}
              <div className="border border-blue-500 rounded-lg">
                <div className="bg-blue-50 px-4 py-3 border-b border-blue-500">
                  <h3 className="font-semibold text-slate-900">Page 6 - Third Party Authorization</h3>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Homeowner Name(s)</label>
                    <input
                      type="text"
                      value={thirdPartyData.homeownerName}
                      onChange={(e) => setThirdPartyData(prev => ({...prev, homeownerName: e.target.value}))}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Property Address</label>
                    <input
                      type="text"
                      value={thirdPartyData.propertyAddress}
                      onChange={(e) => setThirdPartyData(prev => ({...prev, propertyAddress: e.target.value}))}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Insurance Company</label>
                    <input
                      type="text"
                      value={thirdPartyData.insuranceCompany}
                      onChange={(e) => setThirdPartyData(prev => ({...prev, insuranceCompany: e.target.value}))}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Claim Number</label>
                    <input
                      type="text"
                      value={thirdPartyData.claimNumber}
                      onChange={(e) => setThirdPartyData(prev => ({...prev, claimNumber: e.target.value}))}
                      className="w-full p-2 border border-slate-300 rounded"
                    />
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-slate-700 mb-2">I/We authorize J&J Roofing Pros, LLC for the following regarding my claim:</p>
                    <div className="space-y-2">
                      {[
                        { key: 'requestInspections', label: 'Request Inspections' },
                        { key: 'discussSupplements', label: 'Discuss and Request Supplements' },
                        { key: 'issuedPayment', label: 'Issued payment discussions and all insurance paperwork discussions' },
                        { key: 'requestClaimStatus', label: 'Request Claim Payment Status (Recoverable Depreciation & Supplements)' }
                      ].map(item => (
                        <label key={item.key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={thirdPartyData.authorizations[item.key as keyof typeof thirdPartyData.authorizations]}
                            onChange={(e) => setThirdPartyData(prev => ({
                              ...prev,
                              authorizations: {
                                ...prev.authorizations,
                                [item.key]: e.target.checked
                              }
                            }))}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-sm text-slate-700">{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-2 p-3 border-t border-slate-200 flex-shrink-0 bg-slate-50 rounded-b-lg">
            <button
              onClick={handlePreview}
              className="flex items-center space-x-1 px-3 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50"
            >
              <FileText size={14} />
              <span>Preview & Print</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              Save Contract Details
            </button>
          </div>
        </div>
      </div>

      <SignatureModal
        isOpen={signatureModal.isOpen}
        onClose={() => setSignatureModal(prev => ({ ...prev, isOpen: false }))}
        onSave={handleSignature}
        signerName={signatureModal.signerName}
        signerRole={signatureModal.signerRole}
        title={`${signatureModal.signerRole === 'company' ? 'Company' : 'Customer'} Signature`}
      />
    </>
  );
};