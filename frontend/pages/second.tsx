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
            <p className='text-gray-900 text-xs'>ANOOP KUMAR</p>
          </div>
          <div className="flex gap-1 items-baseline">
            <p className="text-xs text-gray-500">Enrollment No.:</p>
            <p className='text-gray-900 text-xs'>11321007</p>
          </div>
        </div>

        {/* Year */}
        <div className="flex justify-center mb-2">
          <p className='text-gray-700 text-xs'>Year: <span className='text-gray-900'>Second</span></p>
        </div>

        {/* Marks Table */}
        <div className="overflow-x-auto mb-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="border border-gray-200 px-1 py-2 text-left text-[10px] text-black">S.No.</th>
                <th className="border border-gray-200 px-1 py-2 text-left text-[10px] text-black">Course Code</th>
                <th className="border border-gray-200 px-1 py-2 text-left text-[10px] text-black">Course Name</th>
                <th className="border border-gray-200 px-1 py-2 text-left text-[10px] text-black">Max. Marks</th>
                <th className="border border-gray-200 px-1 py-2 text-left text-[10px] text-black">Marks Obtained</th>
                <th className="border border-gray-200 px-1 py-2 text-left text-[10px] text-black">Paper Result</th>
              </tr>
            </thead>
            <tbody>
              {/* {[...Array(12)].map((_, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black">{index + 1}</td>
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black"></td>
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black"></td>
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black"></td>
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black"></td>
                  <td className="border border-gray-200 text-xs px-4 py-1 text-black"></td>
                </tr>
              ))} */}
              {[
  { code: "ER20-21P", name: "PHARMACOLOGY - PRACTICAL", marks: 83 },
  { code: "ER20-21T", name: "PHARMACOLOGY - THEORY", marks: 62 },
  { code: "ER20-22P", name: "COMMUNITY PHARMACY & MANAGEMENT - PRACTICAL", marks: 76 },
  { code: "ER20-22T", name: "COMMUNITY PHARMACY & MANAGEMENT - THEORY", marks: 72 },
  { code: "ER20-23P", name: "BIOCHEMISTRY & CLINICAL PATHOLOGY - PRACTICAL", marks: 59 },
  { code: "ER20-23T", name: "BIOCHEMISTRY & CLINICAL PATHOLOGY - THEORY", marks: 47 },
  { code: "ER20-24P", name: "PHARMACOTHERAPEUTICS - PRACTICAL", marks: 83 },
  { code: "ER20-24T", name: "PHARMACOTHERAPEUTICS - THEORY", marks: 77 },
  { code: "ER20-25P", name: "HOSPITAL & CLINICAL PHARMACY - PRACTICAL", marks: 83 },
  { code: "ER20-25T", name: "HOSPITAL & CLINICAL PHARMACY - THEORY", marks: 68 },
  { code: "ER20-26T", name: "PHARMACY LAW & ETHICS - THEORY", marks: 75 },
  { code: "ER-HF201", name: "SOFT SKILLS MODULES (FACE THE WORLD SKILLS)", marks: 92 },
].map((subject, index) => {
  let result;
  if (subject.marks >= 75) result = "PD"; // Pass with Distinction
  else if (subject.marks >= 60) result = "PFD"; // Pass with First Division
  else if (subject.marks >= 50) result = "P"; // Pass
  else result = "F"; // Fail

  return (
    <tr key={index} className="hover:bg-gray-50">
      <td className="border border-gray-200 text-[8px] px-1 py-1 text-black">{index + 1}</td>
      <td className="border border-gray-200 text-[8px] px-1 py-1 text-black">{subject.code}</td>
      <td className="border border-gray-200 text-[8px] px-1 py-1 text-black">{subject.name}</td>
      <td className="border border-gray-200 text-[8px] px-1 py-1 text-black text-center">100</td>
      <td className="border border-gray-200 text-[8px] px-1 py-1 text-black text-center">{subject.marks}</td>
      <td className="border border-gray-200 text-[8px] px-1 py-1 text-black text-center">{result}</td>
    </tr>
  );
})}

              
              <tr className="bg-white font-semibold">
                <td colSpan={3} className="border border-gray-200 px-4 py-1 text-right text-black text-[10px]">TOTAL</td>
                <td className="border border-gray-200 px-4 py-1 text-black text-[10px] text-center">1100</td>
                <td className="border border-gray-200 px-4 py-1 text-black text-[10px] text-center">999</td>
                <td className="border border-gray-200 px-4 py-1 text-black text-[10px] text-center"></td>
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

        <div className="overflow-x-auto my-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                <th colSpan={3} className="border border-gray-200 px-4 py-2 text-center text-[10px] text-black">Marks Obtained/Maximum Marks</th>
                <th rowSpan={2} className="border border-gray-200 px-4 py-2 text-center text-[10px] text-black">Final Result</th>
              </tr>
              <tr>
                <th className="border border-gray-200 px-4 py-2 text-center uppercase text-[8px] text-black">First Year</th>
                <th className="border border-gray-200 px-4 py-2 text-center uppercase text-[8px] text-black">Second Year</th>
                <th className="border border-gray-200 px-4 py-2 text-center uppercase text-[8px] text-black">Grand Total</th>
              </tr>
            </thead>
            <tbody>
                <tr className="hover:bg-gray-50">
                    <td className="border border-gray-200 text-[8px] text-center px-4 py-1 text-black">1000/1100</td>
                    <td className="border border-gray-200 text-[8px] text-center px-4 py-1 text-black">999/1100</td>
                    <td className="border border-gray-200 text-[8px] text-center px-4 py-1 text-black">1999/2200</td>
                    <td className="border border-gray-200 text-[8px] text-center px-4 py-1 text-black">PASSED</td>
                </tr>
            </tbody>
          </table>
        </div>

        {/* Instructions */}
        <div className="space-y-1 text-xs text-gray-600 mb-8">
          <h3 className="font-medium text-gray-700">Instructions:</h3>
          <ol className="list-decimal pl-4">
            <li>Students having more than two fail in the Paper Result shall not be entitled for the diploma</li>
            <li>Face The World Skill marks are not included in the calculation of total marks</li>
            <li>Abbreviation: PD: Pass with Distinction, PFD: Pass with First Division, P: Pass, F: Fail</li>
            <li>Student passed provisionally has failed in either of face the world skill or English communication - I or both. To recieve diploma, student should pass these two subjects compulsarily</li>
          </ol>
        </div>

        {/* Footer */}
        <div className="flex">
          <p className="font-bold text-xs text-gray-600 mb-1">Date of Issue: </p>
          <p className='text-gray-700 text-xs'>12-March-2024</p>
        </div>
        <div className="flex justify-between gap-4 text-sm text-gray-600">
          <div className="mt-10">
            <p className="font-bold text-xs mb-1 ">Checked by:</p>
            <p>Deputy Registrar</p>
          </div>
          <div className="mt-10 text-right text-sm">
            <p className="font-bold text-xs mb-1">Issued by:</p>
            <p>Controller of Examination</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;