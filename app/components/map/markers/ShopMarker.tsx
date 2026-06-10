import { AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { CreditCard } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { ImgLoader } from "../../Img/ImgLoader";

type ShopMarkerProps = {
    shop: Shop
}

export const ShopMarker = ({shop} : ShopMarkerProps) => {
    const [showInfoWindow, setShowInfoWindow] = useState(false);
    
    return (
        <div>
            <AdvancedMarker 
                position={{lat: shop.lat, lng: shop.lng}}
                onClick={() => setShowInfoWindow(true)}
            >
                <img
                    src={shop.imgUrl}
                    alt={shop.name}
                    className="w-12 h-12 rounded-full border-2 bg-blue-400 border-blue shadow-lg"
                />
            </AdvancedMarker>
            {
                showInfoWindow && <InfoWindow
                        position={{
                            lat: shop.lat + 0.00005,
                            lng: shop.lng,
                        }}
                        onClose={() => setShowInfoWindow(false)}
                        className="text-black my-0 py-0"
                    >
                        <h3 className="mb-1 font-semibold text-lg">{shop.name}</h3>
                        {
                            shop.imgUrl != null && 
                                <img
                                    src={shop.imgUrl}
                                    alt={shop.name}
                                    className="w-50 rounded border border-gray-400"
                                />
                        }
                        <div className="mt-3">
                            <p className="mb-1 text-gray-800">Cards Accepted Here</p>
                            <div className="flex flex-row gap-2">
                                {
                                    shop.acceptsBSP && <img 
                                        src={'/BSP.png'}
                                        className="w-10 rounded"
                                    />
                                }
                                {
                                    shop.acceptsANZ && <img 
                                        src={'/ANZ.png'}
                                        className="w-10 rounded"
                                    />
                                }
                            </div>
                            {
                                shop.comment != null && <div className="mt-3">
                                    <p className="font-medium">Notes:</p>
                                    <p>{shop.comment}</p>
                                </div>
                            }
                        </div>
                    </InfoWindow>
            }
        </div>
    );
}