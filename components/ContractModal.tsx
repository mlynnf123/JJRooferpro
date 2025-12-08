import React, { useState, useCallback } from 'react';
import { X, Plus, Trash2, FileText, Users } from 'lucide-react';
import { Contract, ContractLineItem, ContractDetails, Signature } from '../types';
import { SignatureModal } from './SignatureModal';

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

export const ContractModal: React.FC<ContractModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contract,
  leadInfo
}) => {
  const [contractDetails, setContractDetails] = useState<ContractDetails>(() => ({
    customerName: contract?.details.customerName || leadInfo?.customerName || '',
    customerAddress: contract?.details.customerAddress || leadInfo?.customerAddress || '',
    customerPhone: contract?.details.customerPhone || leadInfo?.customerPhone || '',
    customerEmail: contract?.details.customerEmail || leadInfo?.customerEmail || '',
    companyRepName: contract?.details.companyRepName || 'John Johnson',
    companyRepTitle: contract?.details.companyRepTitle || 'Owner',
    projectDescription: contract?.details.projectDescription || '',
    workLocation: contract?.details.workLocation || leadInfo?.customerAddress || '',
    startDate: contract?.details.startDate || '',
    completionDate: contract?.details.completionDate || '',
    totalAmount: contract?.details.totalAmount || 0,
    paymentSchedule: contract?.details.paymentSchedule || {
      depositAmount: 0,
      progressPayments: [],
      finalPayment: 0
    },
    terms: contract?.details.terms || 'Standard roofing terms and conditions apply.',
    warrantyInfo: contract?.details.warrantyInfo || 'Materials and workmanship warranty as per manufacturer specifications.',
    thirdPartyAuth: contract?.details.thirdPartyAuth
  }));

  const [lineItems, setLineItems] = useState<ContractLineItem[]>(
    contract?.lineItems || [
      {
        id: crypto.randomUUID(),
        description: 'Roofing Materials and Installation',
        quantity: 1,
        unitPrice: 0,
        total: 0,
        category: 'roofing'
      }
    ]
  );

  const [signatures, setSignatures] = useState(contract?.signatures || {});
  const [signatureModal, setSignatureModal] = useState<{
    isOpen: boolean;
    signerName: string;
    signerRole: 'customer' | 'company';
    signatureKey: keyof Contract['signatures'];
  }>({
    isOpen: false,
    signerName: '',
    signerRole: 'customer',
    signatureKey: 'customer1'
  });

  if (!isOpen) return null;

  const addLineItem = () => {
    const newItem: ContractLineItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0,
      category: 'other'
    };
    setLineItems([...lineItems, newItem]);
  };

  const updateLineItem = (id: string, field: keyof ContractLineItem, value: string | number) => {
    setLineItems(items =>
      items.map(item => {
        if (item.id !== id) return item;
        
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = Number(updated.quantity) * Number(updated.unitPrice);
        }
        return updated;
      })
    );
  };

  const removeLineItem = (id: string) => {
    setLineItems(items => items.filter(item => item.id !== id));
  };

  const calculateTotal = useCallback(() => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  }, [lineItems]);

  const openSignatureModal = (signerName: string, signerRole: 'customer' | 'company', signatureKey: keyof Contract['signatures']) => {
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
  };

  const handleSave = () => {
    const total = calculateTotal();
    const updatedDetails = {
      ...contractDetails,
      totalAmount: total
    };

    const newContract: Contract = {
      id: contract?.id || crypto.randomUUID(),
      leadId: contract?.leadId,
      jobId: contract?.jobId,
      details: updatedDetails,
      lineItems,
      signatures,
      status: contract?.status || 'draft',
      createdAt: contract?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: contract?.notes
    };

    onSave(newContract);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <FileText size={24} className="text-blue-600" />
              <span>{contract ? 'Edit Contract' : 'Create Contract'}</span>
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={contractDetails.customerName}
                      onChange={(e) => setContractDetails(prev => ({ ...prev, customerName: e.target.value }))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={contractDetails.customerPhone}
                      onChange={(e) => setContractDetails(prev => ({ ...prev, customerPhone: e.target.value }))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={contractDetails.customerEmail}
                      onChange={(e) => setContractDetails(prev => ({ ...prev, customerEmail: e.target.value }))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={contractDetails.customerAddress}
                      onChange={(e) => setContractDetails(prev => ({ ...prev, customerAddress: e.target.value }))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Project Details */}
              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Description</label>
                    <textarea
                      value={contractDetails.projectDescription}
                      onChange={(e) => setContractDetails(prev => ({ ...prev, projectDescription: e.target.value }))}
                      rows={3}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={contractDetails.startDate}
                      onChange={(e) => setContractDetails(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Completion Date</label>
                    <input
                      type="date"
                      value={contractDetails.completionDate}
                      onChange={(e) => setContractDetails(prev => ({ ...prev, completionDate: e.target.value }))}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Line Items */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Work Items</h3>
                  <button
                    onClick={addLineItem}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    <span>Add Item</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {lineItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="w-20">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Price"
                          value={item.unitPrice}
                          onChange={(e) => updateLineItem(item.id, 'unitPrice', Number(e.target.value))}
                          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>
                      <div className="w-24 font-semibold text-slate-900">
                        ${item.total.toLocaleString()}
                      </div>
                      <button
                        onClick={() => removeLineItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4 p-3 bg-slate-50 rounded-lg">
                  <div className="text-xl font-bold text-slate-900">
                    Total: ${calculateTotal().toLocaleString()}
                  </div>
                </div>
              </section>

              {/* Signatures */}
              <section>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                  <Users size={20} />
                  <span>Digital Signatures</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-700">Company Signature</h4>
                    <div className="p-3 border border-slate-200 rounded-lg">
                      {signatures.company ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-600">Signed by {signatures.company.signerName}</span>
                          <button
                            onClick={() => openSignatureModal(contractDetails.companyRepName, 'company', 'company')}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Re-sign
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openSignatureModal(contractDetails.companyRepName, 'company', 'company')}
                          className="w-full p-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                        >
                          Click to Sign
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-slate-700">Customer Signature</h4>
                    <div className="p-3 border border-slate-200 rounded-lg">
                      {signatures.customer1 ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-green-600">Signed by {signatures.customer1.signerName}</span>
                          <button
                            onClick={() => openSignatureModal(contractDetails.customerName, 'customer', 'customer1')}
                            className="text-sm text-blue-600 hover:text-blue-700"
                          >
                            Re-sign
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openSignatureModal(contractDetails.customerName, 'customer', 'customer1')}
                          className="w-full p-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
                        >
                          Click to Sign
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="flex justify-end space-x-3 p-6 border-t border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Contract
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