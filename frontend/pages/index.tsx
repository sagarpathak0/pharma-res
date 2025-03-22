import React from "react";
import Image from "next/image";
// import dseu from "./dseulogo.png";

function App() {
  return (
    <div className="min-h-full bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-sm w-full max-w-3xl px-8 py-4 border border-gray-400 relative">
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
          <h2 className="text-md font-mono font-bold text-gray-700">
            Examination Held in June 2024
          </h2>
        </div>

        {/* Student Info */}
        <div className="flex gap-6 mb-2 justify-between">
          <div className="flex gap-1 items-baseline">
            <p className="text-sm text-gray-500">Name of the Student:</p>
            <p className="text-gray-900 font-bold text-sm">ANOOP KUMAR</p>
          </div>
          <div className="flex gap-1 items-baseline">
            <p className="text-sm text-gray-500">Enrollment No.:</p>
            <p className="text-gray-900 font-bold text-sm">11321007</p>
          </div>
        </div>
        <div className="flex mb-3 gap-1 items-baseline">
            <p className="text-sm text-gray-500">Campus Name:</p>
            <p className="text-gray-900 font-bold text-sm">Meerabai DSEU Maharani Bagh Campus</p>
        </div>


        {/* Marks Table */}
        <div className="overflow-x-auto mb-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="border border-gray-200 px-1 py-2 text-[12px] text-center text-black">
                  S.No.
                </th>
                <th className="border border-gray-200 px-1 py-2 text-left text-[12px] text-black">
                  Course Code
                </th>
                <th className="border border-gray-200 px-1 py-2 text-left text-[12px] text-black">
                  Course Name
                </th>
                <th className="border border-gray-200 px-1 py-2 text-center text-[12px] text-black">
                  Max. Marks
                </th>
                <th className="border border-gray-200 px-1 py-2 text-center text-[12px] text-black">
                  Marks Obtained
                </th>
                
              </tr>
            </thead>
            <tbody>
              {[
                {
                  code: "ER20-11P",
                  name: "Pharmaceutics - Practical",
                  marks: 86,
                },
                { code: "ER20-11T", name: "Pharmaceutics - Theory", marks: 65 },
                {
                  code: "ER20-12P",
                  name: "Pharmaceutical Chemistry - Practical",
                  marks: 82,
                },
                {
                  code: "ER20-12T",
                  name: "Pharmaceutical Chemistry - Theory",
                  marks: 44,
                },
                {
                  code: "ER20-13P",
                  name: "Pharmacognosy - Practical",
                  marks: 86,
                },
                { code: "ER20-13T", name: "Pharmacognosy - Theory", marks: 62 },
                {
                  code: "ER20-14P",
                  name: "Human Anatomy & Physiology - Practical",
                  marks: 83,
                },
                {
                  code: "ER20-14T",
                  name: "Human Anatomy & Physiology - Theory",
                  marks: 64,
                },
                {
                  code: "ER20-15P",
                  name: "Social Pharmacy - Practical",
                  marks: 85,
                },
                {
                  code: "ER20-15T",
                  name: "Social Pharmacy - Theory",
                  marks: 68,
                },
                {
                  code: "ER20-HF102",
                  name: "Soft Skills Modules(English Communication - I & II)",
                  marks: 75,
                },
              ].map((subject, index) => {
                

                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 text-[12px] px-1 py-1 text-black text-center">
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
        <div className="space-y-1 text-sm text-gray-600 mb-8">
          <h3 className="font-medium text-gray-700">Instructions:</h3>
          <ol className="list-decimal pl-4">
            <li>
              Students failed in more than two courses shall not be entitled for the diploma.
            </li>
            <li>
              Soft Skill Modules marks are not included in the
              calculation of total marks.
            </li>
            <li>
              Student has failed in either Face the World Skill or Soft Skill Modules or both is passed provisionally. Student should pass these two subjects compulsarily for award of diploma.
            </li>
          </ol>
                  
        </div>

        {/* Footer */}
        
        <div className="flex w-full gap-4 text-sm text-gray-600 justify-end">
          <div className="mt-10 text-sm">
            <p className="font-bolder text-xs mb-1"></p>
            <p className="font-bolder text-sm mb-1 italic">Computer Generated Statement of marks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
