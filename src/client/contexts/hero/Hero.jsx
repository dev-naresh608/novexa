import React, { useContext } from "react";
import { Link } from "react-router-dom";


import {GradientButton} from '../../components'
import {Home} from "../../pages"
import { fruit_basket } from "../../../../public/assets";
function Hero() {

  return (
    <>
      {/* hero section  */}
      <section className="flex items-center py-10">
        <div className="h-72 w-full bg-yellow-200 px-20 flex items-center justify-between">
          {/* left content  */}
          <div className="space-y-4 ">
            <div>
              <h1 className="font-normal text-2xl sm:text-5xl">
                <span className="text-green-500 font-semibold">Organic </span>
                Foods at your <span className="font-semibold">Doorsteps</span>
              </h1>
            </div>
            <div className="text-green-900 text-xl font-semibold">
              <p>Enjoy Healthy Food.</p>
            </div>
            <div className="w-ma">
              <GradientButton componentType="Link" to="/login">Browse Stores</GradientButton>
            </div>
          </div>

          {/* right content  */}
          <div>
            <img src={fruit_basket} alt="hero banner" />
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;



// import React from "react";
// import { Link } from "react-router-dom";
// import { Truck, Leaf, ShieldCheck, Star } from "lucide-react";

// import { GradientButton } from "..";
// import { fruit_basket } from "../../../../public/assets";

// const TRUST_BADGES = [
//   { icon: Truck, label: "30-min delivery" },
//   { icon: Leaf, label: "Fresh & organic" },
//   { icon: ShieldCheck, label: "10,000+ happy customers" },
// ];

// function Hero() {
//   return (
//     <section className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
//       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-100 via-yellow-50 to-green-50 px-6 sm:px-10 lg:px-14 py-8 lg:py-10">
//         {/* decorative backdrop */}
//         <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-green-200/40 blur-2xl" />
//         <div className="absolute -left-10 bottom-0 w-40 h-40 rounded-full bg-yellow-300/30 blur-2xl" />

//         <div className="relative grid lg:grid-cols-2 gap-8 items-center">
//           {/* left content */}
//           <div className="space-y-4">
//             <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-700 bg-white/70 border border-green-200 rounded-full px-3 py-1.5">
//               Now delivering across Bengaluru
//             </span>

//             <h1 className="font-normal text-2xl sm:text-3xl lg:text-4xl leading-tight text-gray-900">
//               <span className="text-green-600 font-semibold">Organic </span>
//               foods at your <span className="font-semibold">doorstep</span>
//             </h1>

//             <p className="text-gray-600 text-sm sm:text-base max-w-md">
//               Fresh produce and everyday essentials from local stores,
//               delivered in minutes — every order, every time.
//             </p>

//             <div className="flex flex-wrap items-center gap-3">
//               <GradientButton componentType="Link" to="/login">
//                 Start Shopping
//               </GradientButton>
//               <Link
//                 to="/login"
//                 className="text-sm font-semibold text-gray-700 border border-gray-300 bg-white/70 rounded-2xl px-5 py-2.5 hover:border-green-400 hover:text-green-700 transition-colors"
//               >
//                 Browse Stores
//               </Link>
//             </div>

//             {/* trust strip */}
//             <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
//               {TRUST_BADGES.map(({ icon: Icon, label }) => (
//                 <div
//                   key={label}
//                   className="flex items-center gap-2 text-sm font-medium text-gray-700"
//                 >
//                   <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-green-700 shadow-sm shrink-0">
//                     <Icon className="w-3.5 h-3.5" />
//                   </span>
//                   {label}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* right content */}
//           <div className="relative flex justify-center lg:justify-end">
//             <div className="relative w-full max-w-[240px] sm:max-w-xs lg:max-w-sm">
//               <img
//                 src={fruit_basket}
//                 alt="Basket of fresh organic produce"
//                 className="w-full h-auto drop-shadow-xl"
//               />

//               {/* floating rating card */}
//               <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 sm:left-auto sm:right-2 sm:translate-x-0 flex items-center gap-2 bg-white rounded-2xl shadow-lg px-3.5 py-2.5">
//                 <div className="flex text-yellow-400">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Star key={i} className="w-3 h-3 fill-current" />
//                   ))}
//                 </div>
//                 <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
//                   4.8 rated service
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Hero;