"use client";
import React, { useState, useRef } from 'react';

type PackOption = {
    quantity: number;
    price: number;
    perUnit: string;
    stock: string;
};
const products = [
    {
        title: "MamyPoko Extra Absorb Diaper Pants Large,",
        quantity: "98 Count",
        mrp: "₹1970",
        price: "₹1230",
        discount: "50% OFF",
        image: "/images/diaper.png", // replace with actual image path
        timer: "",
    },
    {
        title: "MamyPoko Extra Absorb Diaper Pants Large,",
        quantity: "98 Count",
        mrp: "₹1970",
        price: "₹1230",
        discount: "50% OFF",
        image: "/images/diaper.png", // replace with actual image path
        timer: "",
    },
    {
        title: "Cetaphil Baby Daily lotion, 400 ml",
        quantity: "tube of 450 ml Gel",
        mrp: "₹1260",
        price: "₹710",
        discount: "50% OFF",
        image: "/images/cetaphil.png",
        timer: "05:02:12",
    },
    {
        title: "Nestle Nan Pro Stage 2 Formula Milk",
        quantity: "tube of 30 ml Gel",
        mrp: "₹1260",
        price: "₹630",
        discount: "50% OFF",
        image: "/images/nan.png",
        timer: "05:02:12",
    },
    {
        title: "Dabur Ashokarishta, 450 ml",
        quantity: "tube of 100 ml Gel",
        mrp: "₹160",
        price: "₹140",
        discount: "50% OFF",
        image: "/images/dabur.png",
        timer: "",
    },
    {
        title: "Flamingo Heat Belt Large, 1 Count",
        quantity: "tube of 30 ml Gel",
        mrp: "₹320",
        price: "₹280",
        discount: "50% OFF",
        image: "/images/flamingo.png",
        timer: "05:02:12",
    },
];
export default function ProductView() {
    const images = [
        "https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG",
        "https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG",
        "https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG",
        "https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG",
        "https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG",
        "https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG"
    ];

    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 4;

    const handleScrollUp = () => {
        setStartIndex((prev) => Math.max(0, prev - 1));
    };

    const handleScrollDown = () => {
        setStartIndex((prev) =>
            Math.min(images.length - visibleCount, prev + 1)
        );
    };

    const visibleImages = images.slice(startIndex, startIndex + visibleCount);

    const [selectedSize, setSelectedSize] = useState<string>("Large");
    const sizes: string[] = ["Large", "Small", "Medium", "New Born", "XL", "XXL"];

    const [selectedPackIndex, setSelectedPackIndex] = useState<number>(0);

    const packOptions: PackOption[] = [
        { quantity: 96, price: 1270, perUnit: "₹13.32 Per Unit", stock: "In Stock" },
        { quantity: 56, price: 970, perUnit: "₹11.32 Per Unit", stock: "In Stock" },
        { quantity: 34, price: 770, perUnit: "₹9.32 Per Unit", stock: "In Stock" },
        { quantity: 20, price: 270, perUnit: "₹5.32 Per Unit", stock: "In Stock" },
    ];

    const [quantity, setQuantity] = useState<number>(1);

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -300 : 300,
                behavior: "smooth",
            });
        }
    };

    return (
        <div className="min-h-xl py-10 ">
            <div className="max-w-7xl mx-auto p-6 rounded grid md:grid-cols-2 gap-8 w-[90%]">

                {/* Left: Image Gallery */}
                <div className="flex gap-6">
                    <div className="flex flex-col justify-between items-center space-y-2">
                        <button
                            onClick={handleScrollUp}
                            disabled={startIndex === 0}
                            className="text-white text-xl rounded-full bg-background1 px-4 py-2 disabled:opacity-50"
                        >
                            ↑
                        </button>

                        {visibleImages.map((src, index) => (
                            <img
                                key={index + startIndex}
                                src={src}
                                className="w-16 h-16 rounded border border-gray-200"
                                alt={`thumb${index + 1}`}
                            />
                        ))}

                        <button onClick={handleScrollDown}
                            disabled={startIndex + visibleCount >= images.length}
                            className="text-white text-xl rounded-full bg-background1 px-4 py-2 disabled:opacity-50"> ↓ </button>
                    </div>
                    <div className="flex-1 flex jusify-center items-center bg-white rounded-lg p-6 w-full ">
                        <img src="https://uploads.onecompiler.io/42zhuec4k/43ppbsg9g/Capturekjk.PNG" className="transition-transform duration-300 ease-in-out hover:scale-105 object-cover w-full  " alt="Main Product" />
                    </div>
                </div>

                {/* Right: Product Info */}
                <div className="space-y-4 ">
                    <div className='flex gap-6 items-start'>
                        <div className='w-[70%]'>
                            <h2 className="text-xl font-semibold ">Pampers Premium Care Diaper Pants XXL, 30 Count</h2>
                        </div>
                        <div className='flex justify-between gap-6'>
                            <button className='text-4xl text-primaryColor'>♡</button>
                            <button className='text-4xl text-primaryColor'>♡</button>
                        </div>
                    </div>

                    {/* Sizes */}
                    <div>
                        <p className="font-medium text-sm my-4">Select Sizes</p>
                        <div className="flex gap-2 flex-wrap ">
                            {sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-5 py-2 cursor-pointer text-sm rounded transition duration-200  ${selectedSize === size
                                        ? "bg-background1 text-white"
                                        : "bg-[#D9D9D9] text-black"
                                        }`} >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pack Sizes */}
                    <div className='w-[90%] pb-2'>
                        <p className="font-medium text-sm my-4">Select Pack Sizes :</p>
                        <div className="sm:grid grid-cols-2 sm:grid-cols-4 gap-3 flex overflow-x-auto space-x-4  sm:space-x-0">

                            {packOptions.map((pack, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedPackIndex(index)}
                                    className={` rounded cursor-pointer transition duration-200 ${selectedPackIndex === index
                                        ? "bg-background1 text-white"
                                        : "bg-[#D9D9D9]  text-black"
                                        }`}
                                >
                                    <p className="text-sm p-2">{pack.quantity}</p>
                                    <hr className='text-gray-100' />
                                    <div className='p-2'>
                                        <p className="text-md font-semibold mb-2">₹{pack.price}</p>
                                        <p className="text-xs mb-2">({pack.perUnit})</p>
                                        <p className="text-xs">{pack.stock}</p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quantity + Price */}
                    <div className="items-center gap-4">
                        <div className="flex items-center border rounded px-2 py-1 w-32 my-4">
                            <button onClick={handleDecrement} className="px-2 text-2xl ">
                                −
                            </button>
                            <span className="px-3 w-12 text-center">{quantity.toString().padStart(2, "0")}</span>
                            <button onClick={handleIncrement} className="px-2 text-2xl ">
                                +
                            </button>
                        </div>

                        <div className='flex'>
                            <p className="text-xl font-semibold text-primaryColor mr-2">₹1070*</p>
                            <p className="text-sm text-gray-500 mt-2"><span className="line-through">MRP: ₹1270</span> <span className="text-green-600">10% OFF</span></p>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <div>
                        <button className="w-56 bg-background1 text-white py-3 rounded font-medium flex items-center justify-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-105">
                            <img src="/Vector.png" alt="Cart" className="w-5 h-5" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 text-gray-800 text-md leading-relaxed w-[90%]">
                {/* Description */}
                <div className="mb-6">
                    <h2 className="font-semibold text-base text-xl mb-2">Description</h2>
                    <p className='pl-4'>
                        Best 12 hours absorbent pants' ever in MamyPoko product history in India, has +60% Deep Absorbent CrissCross
                        with extra 3rd layer that absorbs urine deeply and provides 2x protection for thigh leakage without sogginess
                        whole night so baby & mother can sleep deeply whole night'.
                    </p>
                </div>

                {/* Directions for Use - Basic */}
                <div className="mb-6">
                    <h2 className="font-semibold text-base text-xl mb-2">Directions for Use</h2>
                    <ul className="list-disc ml-5 space-y-1">
                        <li>To wear - Pull up the diaper like pants.</li>
                        <li>To remove - simply tear off both sides and pull the diaper down.</li>
                    </ul>
                </div>

                {/* Directions for Use - Features */}
                <div className="mb-6">
                    <h2 className="font-semibold text-base text-xl mb-2">Directions for Use</h2>
                    <ul className="list-disc ml-5 space-y-1">
                        <li>
                            +60% Deep Absorbent crisscross sheet - that absorbs urine deeply leaving no wetness on the topsheet. So
                            prevents leakage without sogginess for up to 12 hours.
                        </li>
                        <li>
                            Innovative Flexi Fit - that adjusts gently and evenly distributes pressure across baby's tummy & back to
                            provide 2X Protection for Thigh Leakage.
                        </li>
                        <li>
                            Skin Friendly sheet - The topsheet is enriched with the goodness of coconut oil making it skin friendly.
                        </li>
                        <li>Prevents thigh gaps and redness</li>
                    </ul>
                </div>

                {/* Safety Information */}
                <div>
                    <h2 className="font-semibold text-base text-xl mb-2">Safety Information</h2>
                    <p>
                        Keep the diaper pants away from children and pets to prevent accidental ingestion. Every pant is one time use
                        only. Diapers should be changed cleanly and hygienically to minimise the risk of infection. Ensure that the
                        diaper pants are not too tight to allow proper circulation and ease of movement for your baby. In case of any
                        skin irritation or allergy, discontinue use and consult a doctor.
                    </p>
                </div>
            </div>
            <div className=" py-10 px-4 max-w-7xl mx-auto w-[90%]">
                <h2 className="text-2xl font-semibold mb-6 text-primaryColor">
                    Similar <span className="text-secondaryColor">Products</span>
                    <hr className="bg-background1 h-1 w-[18%] border-0 rounded" />

                </h2>


                <div className="relative ">
                    {/* Left Button */}
                    <button
                        onClick={() => scroll("left")}
                        className="absolute left-0 top-[40%] z-10 bg-background1 text-white w-8 h-8 rounded-full flex items-center justify-center"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Scroll Container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto gap-4 no-scrollbar px-4 py-4"
                    >
                        {products.map((product, idx) => (
                            <div
                                key={idx}
                                className="min-w-[210px] max-w-[210px] bg-white rounded-lg shadow-sm p-3 flex-shrink-0 transition-transform duration-300 hover:scale-102"
                            >
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="h-36 object-contain mx-auto p-4"
                                />
                                <div className="mt-3 space-y-1 px-4 ">
                                    {product.timer && (
                                        <p className="text-red-500 text-xs font-medium">
                                            End In{" "}
                                            <span className="text-[#317C80] font-semibold">
                                                {product.timer}
                                            </span>
                                        </p>
                                    )}
                                    <p className="text-sm font-medium">{product.title}</p>
                                    <p className="text-xs text-gray-500">{product.quantity}</p>
                                    <hr className='text-[#D9D9D9]'/>
                                    <p className="text-xs text-gray-500">
                                        MRP <s>{product.mrp}</s>{" "}
                                        <span className="text-green-500 font-medium">
                                            {product.discount}
                                        </span>
                                    </p>
                                    <p className="text-[#317C80] text-lg font-semibold">
                                        {product.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Button */}
                    <button
                        onClick={() => scroll("right")}
                        className="absolute right-0 top-[40%] z-10 bg-background1 text-white w-8 h-8 rounded-full flex items-center justify-center "
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

    );
}
