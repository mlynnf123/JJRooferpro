import React from 'react';
import { Contract } from '../types';
import { Printer, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PrintableContractProps {
  contract: Contract;
  onClose?: () => void;
}

export const PrintableContract: React.FC<PrintableContractProps> = ({ contract, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('printable-contract');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`contract-${contract.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center print:hidden">
        <h2 className="text-xl font-bold text-slate-900">Contract Preview</h2>
        <div className="flex space-x-2">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer size={16} />
            <span>Print</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      <div id="printable-contract" className="max-w-4xl mx-auto p-8 bg-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">J&J ROOFING PROS, LLC</h1>
          <p className="text-slate-600">Professional Roofing Services</p>
          <p className="text-sm text-slate-500">Phone: (555) 123-4567 | Email: info@jjroofingpros.com</p>
          <div className="mt-4 pt-4 border-t-2 border-slate-300">
            <h2 className="text-xl font-semibold text-slate-800">ROOFING SERVICE AGREEMENT</h2>
          </div>
        </div>

        {/* Contract Information */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Customer Information:</h3>
              <div className="space-y-1">
                <p><strong>Name:</strong> {contract.details.customerName}</p>
                <p><strong>Address:</strong> {contract.details.customerAddress}</p>
                <p><strong>Phone:</strong> {contract.details.customerPhone}</p>
                <p><strong>Email:</strong> {contract.details.customerEmail}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 mb-3">Contract Details:</h3>
              <div className="space-y-1">
                <p><strong>Contract ID:</strong> {contract.id}</p>
                <p><strong>Date Created:</strong> {new Date(contract.createdAt).toLocaleDateString()}</p>
                <p><strong>Project Start:</strong> {new Date(contract.details.startDate).toLocaleDateString()}</p>
                <p><strong>Expected Completion:</strong> {new Date(contract.details.completionDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Project Description */}
        <section className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-3">Project Description:</h3>
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="text-slate-700">{contract.details.projectDescription}</p>
          </div>
        </section>

        {/* Work Items */}
        <section className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-3">Work Items and Pricing:</h3>
          <table className="w-full border border-slate-300">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-2 text-left">Description</th>
                <th className="border border-slate-300 p-2 text-center w-20">Qty</th>
                <th className="border border-slate-300 p-2 text-right w-24">Unit Price</th>
                <th className="border border-slate-300 p-2 text-right w-24">Total</th>
              </tr>
            </thead>
            <tbody>
              {contract.lineItems.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="border border-slate-300 p-2">{item.description}</td>
                  <td className="border border-slate-300 p-2 text-center">{item.quantity}</td>
                  <td className="border border-slate-300 p-2 text-right">${item.unitPrice.toLocaleString()}</td>
                  <td className="border border-slate-300 p-2 text-right font-semibold">${item.total.toLocaleString()}</td>
                </tr>
              ))}
              <tr className="bg-slate-200">
                <td colSpan={3} className="border border-slate-300 p-2 text-right font-bold">
                  TOTAL CONTRACT AMOUNT:
                </td>
                <td className="border border-slate-300 p-2 text-right font-bold text-lg">
                  ${contract.details.totalAmount.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Payment Terms */}
        <section className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-3">Payment Schedule:</h3>
          <div className="bg-slate-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-medium">Deposit:</p>
                <p>${contract.details.paymentSchedule.depositAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="font-medium">Progress Payments:</p>
                {contract.details.paymentSchedule.progressPayments.map((payment, index) => (
                  <p key={index} className="text-sm">{payment.description}: ${payment.amount.toLocaleString()}</p>
                ))}
              </div>
              <div>
                <p className="font-medium">Final Payment:</p>
                <p>${contract.details.paymentSchedule.finalPayment.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Terms and Conditions */}
        <section className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-3">Terms and Conditions:</h3>
          <div className="bg-slate-50 p-4 rounded-lg text-sm">
            <p className="mb-2">{contract.details.terms}</p>
            <div className="space-y-2 mt-4">
              <p><strong>Warranty:</strong> {contract.details.warrantyInfo}</p>
              <p><strong>Liability:</strong> J&J Roofing Pros, LLC carries full liability insurance and workers' compensation coverage.</p>
              <p><strong>Change Orders:</strong> Any changes to the original scope of work must be approved in writing and may result in additional charges.</p>
              <p><strong>Weather Delays:</strong> Completion dates are subject to weather conditions and may be extended due to inclement weather.</p>
            </div>
          </div>
        </section>

        {/* Signatures */}
        <section className="mb-8">
          <h3 className="font-semibold text-slate-800 mb-4">Agreement Signatures:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-slate-300 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Company Representative:</h4>
              {contract.signatures.company ? (
                <div>
                  <img 
                    src={contract.signatures.company.dataURL} 
                    alt="Company Signature" 
                    className="max-w-full h-16 border-b border-slate-300 mb-2"
                  />
                  <p className="text-sm">
                    <strong>{contract.signatures.company.signerName}</strong>
                  </p>
                  <p className="text-sm text-slate-600">{contract.details.companyRepTitle}</p>
                  <p className="text-xs text-slate-500">
                    Date: {new Date(contract.signatures.company.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="h-20 border-b border-slate-300 mb-2 flex items-end">
                  <span className="text-slate-400 text-sm">Signature Required</span>
                </div>
              )}
            </div>

            <div className="border border-slate-300 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Customer:</h4>
              {contract.signatures.customer1 ? (
                <div>
                  <img 
                    src={contract.signatures.customer1.dataURL} 
                    alt="Customer Signature" 
                    className="max-w-full h-16 border-b border-slate-300 mb-2"
                  />
                  <p className="text-sm">
                    <strong>{contract.signatures.customer1.signerName}</strong>
                  </p>
                  <p className="text-sm text-slate-600">Property Owner</p>
                  <p className="text-xs text-slate-500">
                    Date: {new Date(contract.signatures.customer1.timestamp).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="h-20 border-b border-slate-300 mb-2 flex items-end">
                  <span className="text-slate-400 text-sm">Signature Required</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Third Party Authorization (if applicable) */}
        {contract.details.thirdPartyAuth && (
          <section className="mb-6">
            <h3 className="font-semibold text-slate-800 mb-3">Third Party Authorization:</h3>
            <div className="border border-slate-300 p-4 rounded-lg">
              <p className="mb-2">
                <strong>Authorized by:</strong> {contract.details.thirdPartyAuth.authorizedBy}
              </p>
              <p className="mb-2">
                <strong>Relationship:</strong> {contract.details.thirdPartyAuth.relationship}
              </p>
              {contract.details.thirdPartyAuth.authSignature && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Authorization Signature:</p>
                  <div className="h-16 border-b border-slate-300 bg-slate-50"></div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 mt-8 pt-4 border-t border-slate-300">
          <p>This contract is legally binding. Both parties acknowledge they have read and understand all terms and conditions.</p>
          <p className="mt-2">J&J Roofing Pros, LLC | Licensed & Insured | License #12345</p>
        </footer>
      </div>
    </div>
  );
};