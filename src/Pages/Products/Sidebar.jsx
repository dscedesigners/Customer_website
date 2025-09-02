// import React from "react";

// const Sidebar = ({ isSidebarOpen, toggleSidebar }) => (
//   <aside
//     className={`fixed top-0 left-0 w-64 h-full bg-white p-4 overflow-y-auto z-50 transform ${
//       isSidebarOpen ? "translate-x-0" : "-translate-x-full"
//     } transition-transform duration-300 md:relative md:translate-x-0 md:w-1/4 lg:w-1/5`}
//   >
//     {/* Filters */}
//     <div className="mb-4">
//       <h3 className="font-medium">Category</h3>
//       <ul className="ml-4 space-y-2">
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> Formal Wear
//           </label>
//         </li>
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> Casual Wear
//           </label>
//         </li>
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> Sportswear
//           </label>
//         </li>
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> Accessories
//           </label>
//         </li>
//       </ul>
//     </div>

//     {/* Price Filter */}
//     <div className="mb-4">
//       <h3 className="font-medium">Price Range</h3>
//       <input
//         type="range"
//         min="0"
//         max="200"
//         value={200}
//         onChange={() => {}}
//         className="w-full"
//       />
//       <p className="text-sm">Up to: $200</p>
//     </div>

//     {/* Brand Filter */}
//     <div className="mb-4">
//       <h3 className="font-medium">Brand</h3>
//       <ul className="space-y-2">
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> Brand A
//           </label>
//         </li>
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> Brand B
//           </label>
//         </li>
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> Brand C
//           </label>
//         </li>
//       </ul>
//     </div>

//     {/* Size Filter */}
//     <div className="mb-4">
//       <h3 className="font-medium">Size</h3>
//       <ul className="space-y-2">
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> S
//           </label>
//         </li>
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> M
//           </label>
//         </li>
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> L
//           </label>
//         </li>
//       </ul>
//     </div>

//     {/* Color Filter */}
//     <div className="mb-4">
//       <h3 className="font-medium">Color</h3>
//       <ul className="space-y-2">
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> Black
//           </label>
//         </li>
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> Blue
//           </label>
//         </li>
//         <li>
//           <label>
//             <input type="checkbox" className="mr-2" /> White
//           </label>
//         </li>
//       </ul>
//     </div>
//   </aside>
// );

// export default Sidebar;
