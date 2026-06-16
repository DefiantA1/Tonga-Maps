'use client'

import { auth, db, storage } from "@/app/firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ShoppingCart, X } from "lucide-react";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";

type AddShopModalProps = {
  isOpen: boolean,
  exit: () => void,
  markerPosition: {lat: number, lng: number} | null
}

export function AddShopModal({isOpen, exit, markerPosition} : AddShopModalProps){
  const [name, setName] = useState<string>("");
  const [acceptsBSP, setAcceptsBSP] = useState<boolean>(false);
  const [acceptsANZ, setAcceptsANZ] = useState<boolean>(false);

  const [imgFile, setImgFile] = useState<File | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  
  function exitModal(){
    setName("");
    setComment("");
    setAcceptsANZ(false);
    setAcceptsBSP(false);
    setLoading(false);
    setImgFile(null);

    exit();
  }

  function slideInformation(){
    return `absolute bottom-0 left-0 lg:left-auto right-0 lg:w-90 lg:top-0 lg:rounded-none lg:pt-18 bg-white rounded-t-3xl p-6 transition-transform duration-300 ease-out text-black ${
      isOpen ? "translate-y-0 lg:translate-y-0 lg:-translate-x-0"
        : "translate-y-full lg:translate-y-0 lg:translate-x-full"
    }`;
  }
  
  return (
    <div
      className={`fixed inset-0 bg-black/50 transition-opacity ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={() => exitModal()}
    >
      <div
        className={slideInformation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-row">
            <h2 className="mr-3" style={{fontWeight: 'bold'}}>Add a Shop</h2>
            <ShoppingCart/>
          </div>
          <X className="cursor-pointer" onClick={() => exitModal()}/>
        </div>
        <hr className="mt-2 mb-4"/>
        <Field title={"Shop Name"} value={name} setValue={setName}/>
        <ImgField onFileChange={(f: File | null) => setImgFile(f)}/>
        <CardBoxes
          anz={acceptsANZ}
          bsp={acceptsBSP}
          onANZChange={(v) => setAcceptsANZ(v)} 
          onBSPChange={(v) => setAcceptsBSP(v)}
        />
        <div className="mt-3">
          <Field title={'Comment (Optional)'} setValue={setComment} value={comment}/>
        </div>
        <AddBtn/>
      </div>
    </div>
  );

  function AddBtn(){
    return (
      <div onClick={handleAddShop} className="cursor-pointer bg-green-500 w-full p-3 mt-4 rounded text-white font-semibold text-center">
        {loading 
          ? <div className="flex flex-row items-center justify-center">
              <Spinner size="sm"/>
              <p className="ml-2">Loading...</p>
            </div> 
          : <p>Add Shop</p>}
      </div>
    );
  }

  async function handleAddShop(){
    try{
      if(loading){
        return;
      }

      if(name == ''){
        throw Error('Please provide name of shop');
      }

      if(acceptsANZ == false && acceptsBSP == false){
        throw new Error('Which card does this shop provide?');
      }

      if(markerPosition == null){
        throw new Error('Shop location not found');
      }


      const uid = localStorage.getItem('uid');

      if(uid == null){
        throw new Error('uid for user not found');
      }

      const newShop : Shop = {
        name: name,
        acceptsANZ: acceptsANZ,
        acceptsBSP: acceptsBSP,
        lat: markerPosition.lat,
        lng: markerPosition.lng,
        uid: uid,

        // defaults
        createdAt: new Date().getTime(),
        pending: true,
      };

      setLoading(true);


      const toastId = toast.loading('Uploading Now...');

      let imgUrl : null | string = null;
      
      if(imgFile != null){
        const fileName = `${name.replaceAll(" ", "")}-${new Date().getTime()}`;
        const storageRef = ref(storage, `markers/${fileName}`)

        await uploadBytes(storageRef, imgFile);

        imgUrl = await getDownloadURL(storageRef);
        newShop.imgUrl = imgUrl;
      }
      
      if(comment != ''){
        newShop.comment = comment;
      }

      const dbPath = collection(db, 'markers');
      await addDoc(dbPath,newShop)

      exitModal();
      
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

export function Spinner({ size = "md" }) {
  const sizeClasses : any = {
    sm: "h-5 w-5 border-2",
    md: "h-8 w-8 border-4",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-gray-200 border-t-blue-600`}
      />
    </div>
  );
}

type FieldProps = {
  title: string,
  value: string,
  setValue: Dispatch<SetStateAction<string>>,
}

function Field({title, setValue, value} : FieldProps){
  return (
    <div className="mb-4">
      <p className="text-gray-600">{title}</p>
      <input value={value} onChange={(e) => setValue(e.target.value)} className="bg-gray-200 w-full p-2 rounded"/>
    </div>
  );
}

type ImgFieldProps = {
  onFileChange: (f: File | null) => void
}

function ImgField({onFileChange} : ImgFieldProps){
  const [fileName, setFileName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      
      const objectUrl = URL.createObjectURL(files[0]);
      setPreviewUrl(objectUrl);
      onFileChange(files[0]);
    } else {
      setFileName('');
      onFileChange(null);
    }
  };

  return (
    <div className="mb-4 text-gray-600">
      <p className="mb-2">Picture of Shop (Optional)</p>
      
      {
        previewUrl == null && <label htmlFor="image-picker-input" className="cursor-pointer rounded-md p-3 text-sm text-gray-800 text-center bg-gray-200 w-full block hover:bg-blue-500 hover:text-white transition-colors">Upload Photo (Optional)</label>
      }

      <input id="image-picker-input" className="hidden" type="file" accept="image/*" onChange={(e) => handleFileChange(e)}/>
      {
        previewUrl != null && <div className="relative">
          <img
              src={previewUrl}
              className="w-full rounded-lg"
              alt="Uploaded preview"
            />
          <X className="cursor-pointer absolute top-1 right-1 text-black font-bold bg-red-400 p-1 border-1 rounded-xl" onClick={() => {
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
    <div className="mt-5 text-gray-600">
      <p>This Shop Accepts</p>
      <div className="flex flex-row items-center">
        <input checked={bsp} onChange={(e) => onBSPChange(e.target.checked)} id="bspCheckBox" type="checkbox" className="bg-gray-300 checked:bg-indigo-600 m-2 w-5 h-5 rounded"/>
        <label htmlFor="bspCheckBox" className="text-gray-800">BSP</label>
      </div>
      <div className="flex flex-row items-center">
        <input checked={anz} onChange={(e) => onANZChange(e.target.checked)} id="anzCheckBox" type="checkbox" className="bg-gray-300 m-2 w-5 h-5 rounded"/>
        <label htmlFor="anzCheckBox" className="text-gray-800">ANZ</label>
      </div>
    </div>
  );
}