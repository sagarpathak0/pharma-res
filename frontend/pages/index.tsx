import React from 'react';
import Image from 'next/image';
// import dseu from "./dseulogo.png";

function App() {
  return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center p-4">
      
      <div className="bg-white shadow-sm w-full max-w-3xl px-8 py-4 border border-gray-400 relative">
        <div className="absolute text-sm font-bold text-black top-5 right-5">
            S.No - 2022/I/ABC123/R/456
        </div>
        <br />
        {/* Logo */}
        <div className="mb-4 flex">
          <Image src='/dseulogo.png' alt="DSEU Logo" width={80} height={80} />
          <div className="text-center flex flex-col mx-auto mt-auto p-1 text-[#0072B9]">
                <div className="text-dseublue text-xl font-extrabold font-mono">
                  दिल्ली कौशल एवं उद्यमिता विश्वविद्यालय
                </div>
                <div className="text-dseublue text-2xl font-extrabold font-serif">
                  Delhi Skill & Entrepreneurship University
                </div>
                <div className="text-dseublue text-xs font-extrabold font-serif">
                  (A State University Established under Govt. of NCT of Delhi
                  Act 04 of 2020)
                </div>
              </div>
        </div>
        
        {/* Serial Number */}
        
        
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xs font-bold text-gray-800 ">STATEMENT OF MARKS</h1>
          <h2 className="text-md font-serif font-bold text-gray-700">Diploma in Pharmacy</h2>
        </div>

        {/* Student Info */}
        <div className="flex gap-6 mb-2 justify-between">
          <div className="flex gap-1 items-baseline">
            <p className="text-xs text-gray-500">Name of the Student:</p>
            <p className='text-gray-900 text-xs'>Harshit Tiwari</p>
          </div>
          <div className="flex gap-1 items-baseline">
            <p className="text-xs text-gray-500">Enrollment No.:</p>
            <p className='text-gray-900 text-xs'>123456</p>
          </div>
        </div>

        {/* Year */}
        <div className="flex justify-center mb-2">
          <p className='text-gray-700 text-xs'>Year: <span className='text-gray-900'>First</span></p>
        </div>

        {/* Marks Table */}
        <div className="overflow-x-auto mb-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="border border-gray-200 px-4 py-2 text-left text-xs text-black">S.No.</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-xs text-black">Course Code</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-xs text-black">Course Name</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-xs text-black">Max. Marks</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-xs text-black">Marks Obtained</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-xs text-black">Paper Result</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(12)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black">{index + 1}</td>
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black"></td>
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black"></td>
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black"></td>
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black"></td>
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black"></td>
                </tr>
              ))}
              <tr className="bg-white font-semibold">
                <td colSpan={3} className="border border-gray-200 px-4 py-1 text-right text-black text-xs">Total</td>
                <td className="border border-gray-200 px-4 py-1 text-black text-xs"></td>
                <td className="border border-gray-200 px-4 py-1 text-black text-xs"></td>
                <td className="border border-gray-200 px-4 py-1 text-black text-xs"></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Result Section */}
        <div className="">
          <div className="flex items-center">
            <span className="text-gray-700 text-sm font-medium">Result:</span>
            <span className="pl-2 py-1 font-bold text-gray-700 text-xs">PASS</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-1 text-xs text-gray-600 mb-8">
          <h3 className="font-medium text-gray-700">Instructions:</h3>
          <ol className="list-decimal pl-4">
            <li>Students having more than two fail in the Paper Result shall not be entitled for the diploma</li>
            <li>English Communication - I marks are not included in the calculation of total marks</li>
            <li>Abbreviation: PD: Pass with Distinction, PFD: Pass with First Division, P: Pass, F: Fail</li>
          </ol>
        </div>

        {/* Footer */}
        <div className="flex">
          <p className="font-bold text-sm text-gray-600 mb-1">Date of Issue: </p>
          <p className='text-gray-700 text-sm'>12-March-2024</p>
        </div>
        <div className="flex justify-between gap-4 text-sm text-gray-600">
          <div className="mt-10">
            <p className="font-bold text-sm mb-1 ">Checked by:</p>
            <p>Deputy Registrar</p>
          </div>
          <div className="mt-10 text-right">
            <p className="font-bold text-sm mb-1">Issued by:</p>
            <p>Controller of Examination</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;