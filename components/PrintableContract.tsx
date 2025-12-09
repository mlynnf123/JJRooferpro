import React from 'react';
import { Contract } from '../types';
import { Printer, Download, X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PrintableContractProps {
  contract: Contract;
  onClose?: () => void;
}

export const PrintableContract: React.FC<PrintableContractProps> = ({ contract, onClose }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

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

      pdf.save(`Contract - ${contract.details.customerName}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Print Controls */}
      <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex justify-between items-center print:hidden">
        <h2 className="text-xl font-bold text-slate-900">Contract Preview: {contract.details.customerName}</h2>
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
            className="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <X size={16} />
            <span>Close</span>
          </button>
        </div>
      </div>

      <div id="printable-contract" className="max-w-4xl mx-auto bg-white" style={{ fontFamily: 'Arial, sans-serif', padding: '0.75in', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="text-sm text-gray-600">
            {currentDate}, {currentTime}
          </div>
          <div className="text-right text-sm text-gray-600">
            Contract - {contract.details.customerName}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <img 
            src="/logo.jpg" 
            alt="J&J Roofing Pros Logo" 
            className="mx-auto mb-4 max-h-16 w-auto"
          />
          <h1 className="text-2xl font-medium mb-4">J&J Roofing Pros Contract: {contract.details.customerName}</h1>
        </div>

        {/* Company Header */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2">J&J Roofing Pros, LLC</h2>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Corporate Headquarters</div>
            <div><strong>Send Payment To:</strong> 14205 N MO PAC EXPY STE 570</div>
            <div>AUSTIN, TX 78728</div>
            <div>(737) 414 - 1929</div>
            <div>www.jjroofingpros.com</div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mb-6">
          <h3 className="font-bold mb-2">Customer</h3>
          <div className="text-sm space-y-1">
            <div>{contract.details.customerName}</div>
            <div>{contract.details.customerAddress}</div>
          </div>
        </div>

        {/* Company Representative */}
        <div className="mb-8">
          <h3 className="font-bold mb-2">Company Representative</h3>
          <div className="text-sm space-y-1">
            <div>{contract.details.companyRepName}</div>
            <div>{contract.details.customerPhone}</div>
            <div>ian@jjroofingpros.com</div>
          </div>
        </div>

        {/* Work Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-400">
                <th className="text-left py-2 font-bold">Description</th>
                <th className="text-center py-2 font-bold w-20">Quantity</th>
                <th className="text-right py-2 font-bold w-24">Price</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* Roofing Section */}
              <tr>
                <td className="py-4 pr-4 align-top">
                  <div className="font-bold mb-2">ROOFING</div>
                  {contract.lineItems
                    .filter(item => item.category === 'roofing')
                    .map((item, index) => (
                      <div key={index} className="whitespace-pre-line leading-5">
                        {item.description}
                      </div>
                    ))}
                </td>
                <td className="py-4 text-center align-top">
                  {contract.lineItems
                    .filter(item => item.category === 'roofing')
                    .map((item, index) => (
                      <div key={index} className="mb-2">
                        {item.quantity}
                      </div>
                    ))}
                </td>
                <td className="py-4 text-right align-top">
                  {contract.lineItems
                    .filter(item => item.category === 'roofing')
                    .map((item, index) => (
                      <div key={index} className="mb-2">
                        {item.total.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </div>
                    ))}
                </td>
              </tr>

              {/* Gutters Section */}
              {contract.lineItems.filter(item => item.category === 'gutter').length > 0 && (
                <tr>
                  <td className="py-2 pr-4 align-top">
                    <div className="font-bold">Gutters</div>
                    {contract.lineItems
                      .filter(item => item.category === 'gutter')
                      .map((item, index) => (
                        <div key={index} className="whitespace-pre-line leading-5">
                          {item.description}
                        </div>
                      ))}
                  </td>
                  <td className="py-2 text-center align-top">
                    {contract.lineItems
                      .filter(item => item.category === 'gutter')
                      .map((item, index) => (
                        <div key={index}>
                          {item.quantity}
                        </div>
                      ))}
                  </td>
                  <td className="py-2 text-right align-top">
                    {contract.lineItems
                      .filter(item => item.category === 'gutter')
                      .map((item, index) => (
                        <div key={index}>
                          {item.total.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </div>
                      ))}
                  </td>
                </tr>
              )}

              {/* Windows Section */}
              {contract.lineItems.filter(item => item.category === 'window').length > 0 && (
                <tr>
                  <td className="py-2 pr-4 align-top">
                    <div className="font-bold">Windows</div>
                    {contract.lineItems
                      .filter(item => item.category === 'window')
                      .map((item, index) => (
                        <div key={index} className="whitespace-pre-line leading-5">
                          {item.description}
                        </div>
                      ))}
                  </td>
                  <td className="py-2 text-center align-top">
                    {contract.lineItems
                      .filter(item => item.category === 'window')
                      .map((item, index) => (
                        <div key={index}>
                          {item.quantity}
                        </div>
                      ))}
                  </td>
                  <td className="py-2 text-right align-top">
                    {contract.lineItems
                      .filter(item => item.category === 'window')
                      .map((item, index) => (
                        <div key={index}>
                          {item.total.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                        </div>
                      ))}
                  </td>
                </tr>
              )}

              {/* Subtotal and Total */}
              <tr>
                <td className="py-2 pr-4">Subtotal</td>
                <td className="py-2 text-center"></td>
                <td className="py-2 text-right"></td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Total</td>
                <td className="py-2 text-center"></td>
                <td className="py-2 text-right"></td>
              </tr>
              <tr className="border-t-2 border-gray-400">
                <td className="py-2 pr-4 font-bold">Grand Total:</td>
                <td className="py-2 text-center"></td>
                <td className="py-2 text-right font-bold">
                  ${contract.details.totalAmount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* End of Page 1 */}
        <div className="h-24"></div>

        {/* Payment Schedule */}
        <div className="section-break mb-8">
          <h3 className="font-bold mb-4">PAYMENT SCHEDULE</h3>
          <div className="space-y-2 text-sm">
            <div>First Payment (Due upon Start of Job/Material Delivery)</div>
            <div>Second Payment (Due upon Completion of Roof)</div>
            <div>Final Payment (Due upon Job Completion *INS INVOICE*) Final pmnt may increase based on approved supplements)</div>
            
            {/* Company Signature */}
            <div className="mt-6 mb-12">
              <div className="font-medium mb-2">Company Authorized Signature</div>
              {contract.signatures.company ? (
                <div className="border border-gray-300 p-3 bg-gray-50 max-w-md">
                  <img 
                    src={contract.signatures.company.dataURL} 
                    alt="Company Signature" 
                    className="max-w-full h-12 mb-1"
                  />
                  <div className="text-xs">
                    <div><strong>{contract.signatures.company.signerName}</strong></div>
                    <div className="text-gray-600">{contract.details.companyRepTitle}</div>
                    <div className="text-gray-500">Date: {new Date(contract.signatures.company.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
              ) : (
                <div className="border-b border-gray-400 w-64 h-12 flex items-end">
                  <span className="text-gray-400 text-xs">Signature Required</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page 2 - Insurance Contract Worksheet - Complete Section */}
        <div className="section-break">
          <h2 className="text-lg font-bold mb-4">Recovering Withheld Depreciation and Supplements</h2>
          
          <div className="text-sm mb-6">
            <p className="mb-3">
              Your insurance company has depreciated items on your claim. In order to recover the depreciation, a final invoice is sent to your insurance 
              company. In the event that items were missing from your original estimate, J&J Roofing Pros, LLC. has also applied for supplemental 
              items with your insurance company. These supplemental items, if any, are included on the insurance invoice and in the final invoice total.
            </p>
            
            <p className="mb-3 font-medium">
              Below are the steps you will need to take to ensure your recoverable depreciation and supplements are released from your insurance company:
            </p>
            
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Have your claim number available.</li>
              <li>Call your insurance company to confirm they have received the final invoice from J&J Roofing. If they claim to have not received the invoice, send them a copy of your invoice.</li>
              <li>Make sure to get the contact info for the adjuster who is processing your claim. This will most likely be a different adjuster than the one who inspected your house originally.</li>
              <li>Confirm everything is complete with the handling adjuster and ask them to release the recoverable deprecation and any applied for supplements. If requested, some insurance companies can direct deposit the funds. Otherwise, the check will take between 5-7 business days to receive.</li>
              <li>If they have any question regarding supplements or the final invoice, please direct them to admin@jjroofingpros.com.</li>
              <li>Follow up with the handling adjuster within 3 business days to confirm payment has been processed and mailed to you.</li>
              <li>You may have to follow up several times to expedite the process. Insurance companies can get very busy and it helps to stay on top of them to ensure your funds get released in a timely manner.</li>
              <li>Once you have received the remaining funds, call your J&J Roofing Representative to pay any balances owed and to schedule any remaining trades.</li>
              <li>You may pay by personal check, cashiers check, credit card (1% processing fee) made payable to J&J Roofing Pros, LLC.</li>
            </ol>
            
            <p className="mt-4">
              For Invoice Questions, contact your J&J Roofing Sales Representative, or call the J&J Roofing Billing Department at (737) 414-1929. For Supplement 
              Questions, contact your J&J Roofing Sales Representative, (737) 414-1929, or admin@jjroofingpros.com. Please sign below, indicating that you have 
              read and understand the Insurance Contract Worksheet and the Recovering of Withheld Depreciation and Supplements.
            </p>
            
            <p className="mt-4">
              All insurance approved supplements and recoverable depreciation will be due to J&J Roofing Pros, LLC. Customer agrees to fully 
              cooperate with any necessary paperwork needed to seek supplement and recoverable depreciation approval, and has no claim to any 
              supplemental funds or recoverable depreciation. If Customer does not cooperate with these requests, the additional supplements and 
              recoverable depreciation will be due at the sole responsibility of Customer. Any supplements that are denied by the insurance provider will 
              not be the responsibility of the customer.
            </p>
          </div>
          
          
          <div className="mt-8 border-t border-gray-400 pt-4">
            <h3 className="font-bold mb-4">Work Completed Per Insurance Scope</h3>
            <div className="text-sm space-y-4">
              <p>
                All work will be performed per detailed line item scope listed on insurance paperwork except for the items listed in the "work not doing" 
                section, chimney flashing, flue caps and chase covers will be inspected for damage and replaced strictly on an as needed basis. "Work not 
                doing" totals will directly correlate to line items in the Scope of work provided by the insurance company. According to this contract, this 
                work will not be done by J&J Roofing. Customer may be required to complete this work by their mortgage provider and/or insurance company. This 
                work will be the sole responsibility of Customer and does not allow for any deductions from the contracted amount. Any additional work will 
                need to be in writing. No work will be done to your property without a written agreement and payment terms will not be made based on 
                verbal agreements.
              </p>
              
              <h4 className="font-bold mt-6">Discounts</h4>
              <p>
                Any discounts offered to you by J&J Roofing may be due to your insurance company per your insurance policy agreement. J&J Roofing is not responsible 
                for any agreements you have with your insurance company and will not be responsible for paying any amounts due to your insurance 
                company as a result of your agreements. If your payment terms are not honored, all discounts offered to you will be revoked at the sole 
                discretion of J&J Roofing. See Late Payments and Penalties for further details.
              </p>
              
              <p className="mt-6 font-medium">
                By signing below, you acknowledge that you have read and agree to the terms of this Insurance Contract Worksheet.
              </p>
              
              <div className="mt-6">
                <div className="font-medium mb-2">Customer Signature 2</div>
                {contract.signatures.customer2 ? (
                  <div className="border border-gray-300 p-3 bg-gray-50 max-w-md">
                    <img 
                      src={contract.signatures.customer2.dataURL} 
                      alt="Customer Signature 2" 
                      className="max-w-full h-12 mb-1"
                    />
                    <div className="text-xs">
                      <div><strong>{contract.signatures.customer2.signerName}</strong></div>
                      <div className="text-gray-600">Property Owner</div>
                      <div className="text-gray-500">Date: {new Date(contract.signatures.customer2.timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                ) : (
                  <div className="border-b border-gray-400 w-64 h-12 flex items-end">
                    <span className="text-gray-400 text-xs">_________________________ Date _______</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page 3 - Contract Terms */}
        <div className="section-break">
          <h2 className="text-lg font-bold mb-4">J&J Roofing Pros, LLC. Roofing Contract & Payment Terms</h2>
          
          <div className="text-sm space-y-4 print-section">
            <p>
              With this contract, J&J Roofing Pros, LLC. sets forth the agreement between J&J Roofing Pros, LLC. (hereinafter "J&J Roofing") and 
              "{contract.details.customerName}" (hereinafter "Customer") to establish the working terms for work to be completed at {contract.details.customerAddress}. 
              In addition to the working terms, this contract also establishes the agreed upon payment schedule between J&J Roofing and Customer.
            </p>
            
            <h3 className="font-bold mt-6">Please Review and Initial the Below Items:</h3>
            
            <div className="space-y-2">
              <div>
                <strong>Shingle Type/Color/Delivery Instructions:</strong> {contract.details.reviewData?.shingleType || 'Lifetime | IKO Dynasty Class 3 | Summit Grey'}
              </div>
              <div>
                <strong>Existing Property Damage (Fascia Rot, Driveway Cracks,etc.):</strong> {contract.details.reviewData?.existingDamage || 'None'}
              </div>
            </div>
            
            <h3 className="font-bold mt-6 page-break-after-avoid">Liability Disclosure Addendum</h3>
            <p className="font-bold page-break-after-avoid">Initial Below:</p>
            
            <div className="space-y-3 keep-together">
              <div className="flex items-start space-x-2">
                <span className={`block w-4 h-4 border border-gray-400 mt-0.5 ${contract.details.reviewData?.liabilityDisclosures?.constructionCaution ? 'bg-black' : ''}`}>
                  {contract.details.reviewData?.liabilityDisclosures?.constructionCaution && <span className="text-white text-xs">✓</span>}
                </span>
                <p>I understand that this is a construction site, and agree to use caution when entering and exiting my property and to ensure the safety of my family members, friends, children and pets on the premises. I understand and accept the risks of falling debris and errant nails.</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className={`block w-4 h-4 border border-gray-400 mt-0.5 ${contract.details.reviewData?.liabilityDisclosures?.drivewayUsage ? 'bg-black' : ''}`}>
                  {contract.details.reviewData?.liabilityDisclosures?.drivewayUsage && <span className="text-white text-xs">✓</span>}
                </span>
                <p>All J&J Roofing vehicles are rated for driveway usage and any damage and/or cracks resulting from routine driveway usage and/or parking in the driveway to complete the job is not the responsibility of J&J Roofing Pros, LLC.</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className={`block w-4 h-4 border border-gray-400 mt-0.5 ${contract.details.reviewData?.liabilityDisclosures?.puncturedLines ? 'bg-black' : ''}`}>
                  {contract.details.reviewData?.liabilityDisclosures?.puncturedLines && <span className="text-white text-xs">✓</span>}
                </span>
                <p>I understand that any punctured lines are not the responsibility of J&J Roofing Pros, LLC. during the installation process.</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className={`block w-4 h-4 border border-gray-400 mt-0.5 ${contract.details.reviewData?.liabilityDisclosures?.termsReverse ? 'bg-black' : ''}`}>
                  {contract.details.reviewData?.liabilityDisclosures?.termsReverse && <span className="text-white text-xs">✓</span>}
                </span>
                <p>I have read and understand the terms on the reverse side of this document.</p>
              </div>
              
              <div className="flex items-start space-x-2">
                <span className={`block w-4 h-4 border border-gray-400 mt-0.5 ${contract.details.reviewData?.liabilityDisclosures?.propertyCode ? 'bg-black' : ''}`}>
                  {contract.details.reviewData?.liabilityDisclosures?.propertyCode && <span className="text-white text-xs">✓</span>}
                </span>
                <p>Right of Rescission and Property Disclosure - Under Texas State Law, you have the right to cancel this contract within three business days of the contract date.</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="font-medium mb-2">Customer Signature 3</div>
              {contract.signatures.customer3 ? (
                <div className="border border-gray-300 p-3 bg-gray-50 max-w-md">
                  <img 
                    src={contract.signatures.customer3.dataURL} 
                    alt="Customer Signature 3" 
                    className="max-w-full h-12 mb-1"
                  />
                  <div className="text-xs">
                    <div><strong>{contract.signatures.customer3.signerName}</strong></div>
                    <div className="text-gray-600">Property Owner</div>
                    <div className="text-gray-500">Date: {new Date(contract.signatures.customer3.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
              ) : (
                <div className="border-b border-gray-400 w-64 h-12 flex items-end">
                  <span className="text-gray-400 text-xs">_________________________ Date _______</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page 4 - Additional Terms */}
        <div className="section-break">
          <h2 className="text-lg font-bold mb-4">Additional Contract Terms</h2>
          
          <div className="text-sm space-y-4">
            <p>
              <strong>Terms:</strong> I understand that a J&J Roofing Representative is available upon request to inspect all furnace vent connections that may become 
              unattached during the roofing process. I understand it is my responsibility to ensure these connections are secure or request a J&J Roofing 
              Representative to inspect the crucial connections, so that Carbon Monoxide does not enter my dwelling.
            </p>
            
            <p>
              In the event of rotten decking, J&J Roofing will replace up to three (3) sheets of decking at no additional cost to Customer, if there is a widespread 
              decking issue, the decking will need to be replaced at the expense of Customer. Not replacing rotten decking will void your manufacturer 
              warranty as well as your Lifetime Workmanship Warranty from J&J Roofing.
            </p>
            
            <p>
              <strong>Warranty:</strong> J&J Roofing includes a Lifetime Workmanship Warranty on all J&J Roofing roofing systems, which protects against poor workmanship. 
              J&J Roofing is not responsible for normal wear and tear. Warranty begins upon payment in full of total contract amount and approved supplements.
            </p>
            
            <p>
              <strong>Payments:</strong> First roof payment is due when materials are delivered and the crew has started work. Failure to make first payment may 
              result in work stoppage. Final roof payment is due to J&J Roofing upon roof completion any and all trade payments are due upon completion of trade.
            </p>
            
            <p>
              <strong>Failure to Pay Penalties:</strong> 10% penalty assessed against the total remainder due, all discounts will be revoked at the sole discretion 
              of J&J Roofing and the account is subject to being sent to a 3rd party collections agency.
            </p>
          </div>
        </div>

        {/* Page 5 - Third Party Authorization */}
        <div className="section-break">
          <h2 className="text-lg font-bold mb-4">Third Party Authorization Form</h2>
          
          <div className="text-sm space-y-4 print-section">
            <div className="space-y-2">
              <div><strong>Homeowner Name(s):</strong> {contract.details.thirdPartyAuth?.homeownerName || contract.details.customerName}</div>
              <div><strong>Property Address:</strong> {contract.details.thirdPartyAuth?.propertyAddress || contract.details.customerAddress}</div>
              <div><strong>Insurance Company:</strong> {contract.details.thirdPartyAuth?.insuranceCompany || ''}</div>
              <div><strong>Claim Number:</strong> {contract.details.thirdPartyAuth?.claimNumber || ''}</div>
            </div>
            
            <p className="mt-6">
              I/We, ______________________, authorize the following third party, J&J Roofing Pros, LLC. the following type(s) of authorization(s) 
              regarding my claim:
            </p>
            
            <div className="space-y-3 ml-4 keep-together">
              <div className="flex items-start space-x-3">
                <span className="block w-6 h-4 border border-gray-400 mt-1"></span>
                <span>Request Inspections</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="block w-6 h-4 border border-gray-400 mt-1"></span>
                <span>Discuss and Request Supplements</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="block w-6 h-4 border border-gray-400 mt-1"></span>
                <span>Issued payment discussions and all insurance paperwork discussions</span>
              </div>
              <div className="flex items-start space-x-3">
                <span className="block w-6 h-4 border border-gray-400 mt-1"></span>
                <span>Request Claim Payment Status (Recoverable Depreciation & Supplements)</span>
              </div>
            </div>
            
            <h3 className="font-bold mt-6">Overhead & Profit</h3>
            <p>
              Understanding the time, effort, energy and supervision necessary for the restoration of my project, I do not have the time nor the resources 
              to coordinate or manage this project to completion. Therefore, this statement is to inform you that my contractor of choice, J&J Roofing 
              Pros, LLC, is my general contractor, and they will be managing and coordinating all subcontractors and projects required to complete the 
              repair of my property.
            </p>
            
            <p className="mt-4">
              Please speak directly with J&J Roofing Pros, LLC. regarding any questions. You can reach them at (512) 514-5622 or 
              Ian@jjroofingpros.com.
            </p>
          </div>
        </div>

        {/* Digital Signatures Section */}
        {(contract.signatures.company || contract.signatures.customer1 || contract.signatures.customer2 || contract.signatures.customer3 || contract.signatures.customer4) && (
          <>
            <div className="page-break"></div>
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">Digital Signatures</h2>
              
              {/* Company Signature */}
              {contract.signatures.company && (
                <div className="mb-6">
                  <h3 className="font-bold mb-2">Company Authorized Signature (Page 1)</h3>
                  <div className="border border-gray-300 p-4 bg-gray-50">
                    <img 
                      src={contract.signatures.company.dataURL} 
                      alt="Company Signature" 
                      className="max-w-full h-20 mb-2"
                    />
                    <p className="text-sm">
                      <strong>{contract.signatures.company.signerName}</strong>
                    </p>
                    <p className="text-sm text-gray-600">{contract.details.companyRepTitle}</p>
                    <p className="text-xs text-gray-500">
                      Date: {new Date(contract.signatures.company.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Customer Signatures */}
              {[1, 2, 3, 4].map(num => {
                const sigKey = `customer${num}` as keyof typeof contract.signatures;
                const signature = contract.signatures[sigKey];
                const pages = ['1', '3', '5', '6'];
                
                if (!signature) return null;
                
                return (
                  <div key={num} className="mb-6">
                    <h3 className="font-bold mb-2">Customer Signature {num} (Page {pages[num - 1]})</h3>
                    <div className="border border-gray-300 p-4 bg-gray-50">
                      <img 
                        src={signature.dataURL} 
                        alt={`Customer Signature ${num}`} 
                        className="max-w-full h-20 mb-2"
                      />
                      <p className="text-sm">
                        <strong>{signature.signerName}</strong>
                      </p>
                      <p className="text-sm text-gray-600">Property Owner</p>
                      <p className="text-xs text-gray-500">
                        Date: {new Date(signature.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex justify-between items-end text-xs text-gray-500 mt-16">
          <div>about:blank</div>
          <div>8/8</div>
        </div>

        {/* Print Styles */}
        <style jsx>{`
          @media print {
            @page {
              margin: 0.75in;
              size: letter;
            }
            body {
              margin: 0;
              padding: 0;
            }
            #printable-contract {
              margin: 0 !important;
              padding: 0 !important;
              max-width: none !important;
              width: 100% !important;
            }
            .page-break {
              page-break-before: always;
              break-before: page;
            }
            .avoid-break {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .avoid-break-after {
              page-break-after: avoid;
              break-after: avoid;
            }
            .section-break {
              page-break-before: always;
              break-before: page;
              margin-top: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};