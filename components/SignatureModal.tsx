import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { X } from 'lucide-react';
import { Signature } from '../types';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signature: Signature) => void;
  signerName: string;
  signerRole: 'customer' | 'company';
  title?: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  signerName,
  signerRole,
  title = 'Digital Signature'
}) => {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [hasSignature, setHasSignature] = useState(false);

  if (!isOpen) return null;

  const handleClear = () => {
    sigCanvas.current?.clear();
    setHasSignature(false);
  };

  const handleSave = () => {
    if (!hasSignature) {
      alert('Please provide a signature before saving.');
      return;
    }

    const dataURL = sigCanvas.current?.toDataURL();
    if (dataURL) {
      const signature: Signature = {
        id: crypto.randomUUID(),
        dataURL,
        timestamp: new Date().toISOString(),
        signerName,
        signerRole
      };
      onSave(signature);
      onClose();
      handleClear();
    }
  };

  const handleBegin = () => {
    setHasSignature(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-slate-600 mb-2">
              Signer: <span className="font-medium">{signerName}</span>
            </p>
            <p className="text-sm text-slate-500">
              Please sign in the area below using your finger or stylus
            </p>
          </div>

          <div className="border-2 border-dashed border-slate-300 rounded-lg mb-4 bg-slate-50">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{
                width: 600,
                height: 200,
                className: 'signature-canvas w-full rounded-lg'
              }}
              onBegin={handleBegin}
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              disabled={!hasSignature}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                hasSignature
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              Save Signature
            </button>
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">
              By signing above, I acknowledge that I have read and agree to the terms and conditions 
              outlined in this contract. This electronic signature has the same legal validity as a 
              handwritten signature.
            </p>
            <p className="text-xs text-slate-400 mt-2">
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};