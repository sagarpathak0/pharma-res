import React from "react";
import Image from "next/image";
// import dseu from "./dseulogo.png";

function App() {
  return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-sm w-full max-w-3xl px-8 py-8 border border-gray-400 relative">
        <br />
        {/* Logo */}
        <div className="mb-4 flex">
          <Image src="/dseulogo.png" alt="DSEU Logo" width={80} height={80} />
          <div className="text-center flex flex-col mx-auto mt-auto p-1 text-[#0072B9]">
            <div className="text-dseublue text-xl font-extrabold font-mono">
              दिल्ली कौशल एवं उद्यमिता विश्वविद्यालय
            </div>
            <div className="text-dseublue text-2xl font-extrabold font-serif">
              Delhi Skill & Entrepreneurship University
            </div>
            <div className="text-dseublue text-xs font-extrabold font-serif">
              (A State University Established under Govt. of NCT of Delhi Act 04
              of 2020)
            </div>
          </div>
        </div>

        {/* Serial Number */}

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-sm font-bold text-gray-800 ">
            STATEMENT OF MARKS
          </h1>
          <h2 className="text-lg font-serif font-bold text-gray-700">
            Diploma in Pharmacy
          </h2>
          <h2 className="text-md font-mono font-bold text-gray-700">
            First Year
          </h2>
        </div>

        {/* Student Info */}
        <div className="flex gap-6 mb-5 justify-between">
          <div className="flex gap-1 items-baseline">
            <p className="text-sm text-gray-500">Name of the Student:</p>
            <p className="text-gray-900 font-bold text-sm">ANOOP KUMAR</p>
          </div>
          <div className="flex gap-1 items-baseline">
            <p className="text-sm text-gray-500">Enrollment No.:</p>
            <p className="text-gray-900 font-bold text-sm">11321007</p>
          </div>
        </div>


        {/* Marks Table */}
        <div className="overflow-x-auto mb-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="border border-gray-200 px-1 py-2 text-left text-[12px] text-black">
                  S.No.
                </th>
                <th className="border border-gray-200 px-1 py-2 text-left text-[12px] text-black">
                  Course Code
                </th>
                <th className="border border-gray-200 px-1 py-2 text-left text-[12px] text-black">
                  Course Name
                </th>
                <th className="border border-gray-200 px-1 py-2 text-left text-[12px] text-black">
                  Max. Marks
                </th>
                <th className="border border-gray-200 px-1 py-2 text-left text-[12px] text-black">
                  Marks Obtained
                </th>
                
              </tr>
            </thead>
            <tbody>
              {[
                {
                  code: "ER20-11P",
                  name: "PHARMACEUTICS - PRACTICAL",
                  marks: 86,
                },
                { code: "ER20-11T", name: "PHARMACEUTICS - THEORY", marks: 65 },
                {
                  code: "ER20-12P",
                  name: "PHARMACEUTICAL CHEMISTRY - PRACTICAL",
                  marks: 82,
                },
                {
                  code: "ER20-12T",
                  name: "PHARMACEUTICAL CHEMISTRY - THEORY",
                  marks: 44,
                },
                {
                  code: "ER20-13P",
                  name: "PHARMACOGNOSY - PRACTICAL",
                  marks: 86,
                },
                { code: "ER20-13T", name: "PHARMACOGNOSY - THEORY", marks: 62 },
                {
                  code: "ER20-14P",
                  name: "HUMAN ANATOMY & PHYSIOLOGY - PRACTICAL",
                  marks: 83,
                },
                {
                  code: "ER20-14T",
                  name: "HUMAN ANATOMY & PHYSIOLOGY - THEORY",
                  marks: 64,
                },
                {
                  code: "ER20-15P",
                  name: "SOCIAL PHARMACY - PRACTICAL",
                  marks: 85,
                },
                {
                  code: "ER20-15T",
                  name: "SOCIAL PHARMACY - THEORY",
                  marks: 68,
                },
                {
                  code: "ER20-HF102",
                  name: "ENGLISH COMMUNICATION - I",
                  marks: 75,
                },
              ].map((subject, index) => {
                

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 text-[12px] px-1 py-1 text-black">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 text-[12px] px-1 py-1 text-black">
                      {subject.code}
                    </td>
                    <td className="border border-gray-200 text-[12px] px-1 py-1 text-black">
                      {subject.name}
                    </td>
                    <td className="border border-gray-200 text-[12px] px-1 py-1 text-black text-center">
                      100
                    </td>
                    <td className="border border-gray-200 text-[12px] px-1 py-1 text-black text-center">
                      {subject.marks}
                    </td>
                    
                  </tr>
                );
              })}

              <tr className="bg-white font-semibold">
                <td
                  colSpan={3}
                  className="border border-gray-200 px-4 py-1 text-right text-black text-[12px]"
                >
                  TOTAL
                </td>
                <td className="border border-gray-200 px-4 py-1 text-black text-[12px] text-center">
                  1000
                </td>
                <td className="border border-gray-200 px-4 py-1 text-black text-[12px] text-center">
                  725
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Result Section */}
        <div className="">
          <div className="flex items-center">
            <span className="text-gray-700 text-sm font-medium">Result:</span>
            <span className="pl-2 py-1 font-bold text-gray-700 text-xs">
              PASS
            </span>
          </div>
        </div>
        <div className="my-14">
          <br></br>
        </div>

        {/* Instructions */}
        {/* Instructions */}
        <div className="space-y-1 text-xs text-gray-600 mb-8">
          <h3 className="font-medium text-gray-700">Instructions:</h3>
          <ol className="list-decimal pl-4">
            <li>
              Students having more than two fail in the Paper Result shall not
              be entitled for the diploma
            </li>
            <li>
              English Communication - I marks are not included in the
              calculation of total marks
            </li>
            <li>
              
            </li>
          </ol>
                  
        </div>

        {/* Footer */}
        
        <div className="flex w-full gap-4 text-sm text-gray-600 justify-end">
          <div className="mt-10 text-sm">
            <p className="font-bold text-xs mb-1"></p>
            <p>Computer Generated Statement of marks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
