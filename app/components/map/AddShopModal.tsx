'use client'

import { ShoppingCart, X } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

type AddShopModalProps = {
  isOpen: boolean,
  exit: () => void,
}

export function AddShopModal({isOpen, exit} : AddShopModalProps){
  const [name, setName] = useState<string>("");
  const [acceptsBSP, setAcceptsBSP] = useState<boolean>(false);
  const [acceptsANZ, setAcceptsANZ] = useState<boolean>(false);

  const [loading, isLoading] = useState<boolean>(false);
  
  function exitModal(){
    setName("");
    setAcceptsANZ(false);
    setAcceptsBSP(false);

    exit();
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
        <Field title={"Shop Name"} value={name} setValue={setName}/>
        <ImgField/>
        <CardBoxes
          anz={acceptsANZ}
          bsp={acceptsBSP}
          onANZChange={(v) => setAcceptsANZ(v)} 
          onBSPChange={(v) => setAcceptsBSP(v)}
        />
        <AddBtn/>
      </div>
    </div>
  );

  function AddBtn(){
    return (
      <button onClick={handleAddShop} className="bg-green-500 w-full p-3 mt-4 rounded text-white font-semibold">Add Shop</button>
    );
  }

  async function handleAddShop(){
    try{
      if(name == ''){
        throw Error('Please provide name of shop');
      }

      if(acceptsANZ == false && acceptsBSP == false){
        throw new Error('Which card does this shop provide?');
      }

      const newShop : Shop = {
        name: name,
        acceptsANZ: acceptsANZ,
        acceptsBSP: acceptsBSP,
        createdAt: new Date().getTime(),
      };

      const toastId = toast.loading('Uploading Now...');

      
      toast.update(toastId, {
        type: 'success',
        autoClose: 2000,
        isLoading: false,
        render: 'Upload Complete!'
      })
    }
    catch(err){
      toast.error(`${err}`);
    }
  }
}

type FieldProps = {
  title: string,
  value: string,
  setValue: Dispatch<SetStateAction<string>>,
}

function Field({title, setValue, value} : FieldProps){
  return (
    <div className="mb-4">
      <p>{title}</p>
      <input value={value} onChange={(e) => setValue(e.target.value)} className="bg-gray-200 w-full p-2 rounded"/>
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
        previewUrl == null && <label htmlFor="image-picker-input" className="cursor-pointer rounded-md p-3 text-sm text-black text-center bg-gray-200 w-full block hover:bg-blue-500 transition-colors">Upload Photo (Optional)</label>
      }

      <input id="image-picker-input" className="hidden" type="file" accept="image/*" onChange={(e) => handleFileChange(e)}/>
      {
        previewUrl != null && <div className="relative">
          <img
              src={previewUrl}
              className="w-full rounded-lg"
              alt="Uploaded preview"
            />
          <X className="absolute top-3 right-3 text-black bg-red-400 p-1 rounded-xl" onClick={() => {
            setPreviewUrl(null);
            setFileName('');
          }}/>
        </div>
      }
    </div>
  );
}

type CardBoxesProps = {
  anz: boolean,
  bsp: boolean,
  onBSPChange: (v: boolean) => void,
  onANZChange: (v: boolean) => void
}

function CardBoxes({onBSPChange, onANZChange, anz, bsp} : CardBoxesProps){
  return (
    <div className="mt-5">
      <p>This Shop Accepts</p>
      <div className="flex flex-row items-center">
        <input checked={bsp} onChange={(e) => onBSPChange(e.target.checked)} id="bspCheckBox" type="checkbox" className="bg-gray-300 checked:bg-indigo-600 m-2 w-5 h-5 rounded"/>
        <label htmlFor="bspCheckBox">BSP</label>
      </div>
      <div className="flex flex-row items-center">
        <input checked={anz} onChange={(e) => onANZChange(e.target.checked)} id="anzCheckBox" type="checkbox" className="bg-gray-300 m-2 w-5 h-5 rounded"/>
        <label htmlFor="anzCheckBox">ANZ</label>
      </div>
    </div>
  );
}