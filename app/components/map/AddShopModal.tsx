'use client'

import { ShoppingCart, X } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

type AddShopModalProps = {
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

export function AddShopModal({isOpen, setIsOpen} : AddShopModalProps){
  
  function exitModal(){
    setIsOpen(false);
  }
  
  return (
    <div
      className={`fixed inset-0 bg-black/50 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => exitModal()}
    >
      <div
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 transition-transform duration-300 ease-out text-black ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row">
            <h2 className="mr-3" style={{fontWeight: 'bold'}}>Add a Shop</h2>
            <ShoppingCart/>
          </div>
          <X onClick={() => exitModal()}/>
        </div>
        <hr className="mt-2 mb-4"/>
        <Field fieldName={"Shop Name"}/>
        <ImgField/>
      </div>
    </div>
  );
}

type FieldProps = {
  fieldName: string
}

function Field({fieldName} : FieldProps){
  return (
    <div className="mb-4">
      <p>{fieldName}</p>
      <input className="bg-gray-200 w-full p-2 rounded"/>
    </div>
  );
}

function ImgField(){
  const [fileName, setFileName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      
      const objectUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(objectUrl);
    } else {
      setFileName('');
    }
  };

  return (
    <div className="mb-4">
      <p className="mb-2">Picture of Shop (Optional)</p>
      
      {
        previewUrl == null && <label htmlFor="image-picker-input" className="cursor-pointer rounded-md bg-gray-300 p-3 text-sm text-black pr-10 shadow-sm hover:bg-blue-500 transition-colors">Upload Photo Here (Optional)</label>
      }

      <input id="image-picker-input" className="hidden" type="file" accept="image/*" onChange={(e) => handleFileChange(e)}/>
      {
        previewUrl != null && <div className="relative">
          <img
              src={previewUrl}
              className="h-50 rounded-lg"
              alt="Uploaded preview"
            />
          <X className="absolute top-3 right-3 text-black bg-red-400 p-1 rounded-xl" onClick={() => (setPreviewUrl(null))}/>
        </div>
      }
    </div>
  );
}